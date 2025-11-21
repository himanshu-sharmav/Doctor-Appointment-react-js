import { PrismaClient } from '@prisma/client';
import { QueueService } from './src/app/modules/queue/queue.service';
import moment from 'moment';

const prisma = new PrismaClient();
const queueService = new QueueService();

async function verifyConflict() {
    try {
        console.log('🧪 Verifying Smart Queue Processing (Direct Service Call)...');

        // 1. Fetch a doctor
        const doctor = await prisma.doctor.findFirst();
        if (!doctor) throw new Error('No doctor found');
        console.log(`   ℹ️ Using Doctor: ${doctor.email} (${doctor.id})`);

        // 2. Create a Busy Slot (15 mins from now)
        const now = moment();
        const busyStart = moment().add(15, 'minutes');
        const busyDateStr = busyStart.format('YYYY-MM-DD HH:mm:ss');
        const busyTimeStr = busyStart.format('hh:mm A'); // e.g. "10:00 AM"

        console.log(`   ℹ️ Creating Busy Slot at: ${busyTimeStr}`);

        // Find a patient for the booking
        const patient = await prisma.patient.findFirst();
        if (!patient) throw new Error('No patient found');

        const preBookedApp = await prisma.appointments.create({
            data: {
                patientId: patient.id,
                doctorId: doctor.id,
                scheduleDate: busyDateStr,
                scheduleTime: busyTimeStr,
                status: 'pending',
                paymentStatus: 'paid'
            }
        });
        console.log(`   ✅ Created Pre-booked Appointment (ID: ${preBookedApp.id})`);

        // 3. Add a DIFFERENT patient to the Queue
        // Clean existing queue for this doctor to be clean
        await prisma.patientQueue.deleteMany({ where: { doctorId: doctor.id } });

        await prisma.patientQueue.create({
            data: {
                patientId: patient.id,
                doctorId: doctor.id,
                status: 'WAITING'
            }
        });
        console.log('   ✅ Added Patient to Queue');

        // 4. Call QueueService.bookQueueAppointments directly
        console.log('   🔄 Calling queueService.bookQueueAppointments()...');
        const result = await queueService.bookQueueAppointments(doctor.id);
        console.log('   ✅ Result:', result);

        // 5. Verify the allocated slot
        const newSlot = await prisma.appointmentSlot.findFirst({
            where: {
                doctorId: doctor.id,
                isBooked: true
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!newSlot) throw new Error('No slot created');

        const slotStart = moment(newSlot.startTime);
        console.log(`   ℹ️ New Slot Allocated At: ${slotStart.format('hh:mm A')}`);

        // Check overlap
        // Busy: Start -> Start+30
        // New: Start -> Start+30
        const busyEnd = moment(busyStart).add(30, 'minutes');
        const newEnd = moment(slotStart).add(30, 'minutes');

        const isOverlapping = (slotStart < busyEnd) && (newEnd > busyStart);

        if (isOverlapping) {
            console.error('   ❌ FAILURE: New slot overlaps with busy slot!');
            console.error(`      Busy: ${busyStart.format('hh:mm')} - ${busyEnd.format('hh:mm')}`);
            console.error(`      New:  ${slotStart.format('hh:mm')} - ${newEnd.format('hh:mm')}`);
        } else {
            console.log('   ✅ SUCCESS: New slot avoids the busy slot!');
            console.log(`      Busy: ${busyStart.format('hh:mm')} - ${busyEnd.format('hh:mm')}`);
            console.log(`      New:  ${slotStart.format('hh:mm')} - ${newEnd.format('hh:mm')}`);
        }

    } catch (error) {
        console.error('❌ Verification Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyConflict();
