"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🌱 Starting database seeding...');
        // Clear existing data
        console.log('🧹 Clearing existing data...');
        yield prisma.medicine.deleteMany();
        yield prisma.prescription.deleteMany();
        yield prisma.payment.deleteMany();
        yield prisma.appointments.deleteMany();
        yield prisma.reviews.deleteMany();
        yield prisma.favourites.deleteMany();
        yield prisma.doctorTimeSlot.deleteMany();
        yield prisma.scheduleDay.deleteMany();
        yield prisma.blogs.deleteMany();
        yield prisma.userVerfication.deleteMany();
        yield prisma.forgotPassword.deleteMany();
        yield prisma.auth.deleteMany();
        yield prisma.patient.deleteMany();
        yield prisma.doctor.deleteMany();
        console.log('✅ Existing data cleared');
        // Create sample doctors
        console.log('👨‍⚕️ Creating sample doctors...');
        const doctors = [
            {
                firstName: 'Dr. Sarah',
                lastName: 'Johnson',
                email: 'sarah.johnson@example.com',
                address: '123 Medical Center Dr, Suite 101',
                img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
                phone: '+1-555-0101',
                gender: client_1.Gender.female,
                dob: '1985-03-15',
                biography: 'Experienced cardiologist with over 10 years of practice specializing in interventional cardiology.',
                clinicName: 'HeartCare Medical Center',
                clinicAddress: '123 Medical Center Dr, Suite 101',
                city: 'New York',
                state: 'NY',
                country: 'USA',
                postalCode: '10001',
                price: '150',
                services: 'Cardiology, Heart Surgery, EKG',
                specialization: 'Cardiology',
                degree: 'MD',
                college: 'Harvard Medical School',
                completionYear: '2010',
                experience: '10 years',
                designation: 'Senior Cardiologist',
                award: 'Best Cardiologist Award',
                awardYear: '2020',
                registration: 'MD12345',
                year: '2010',
                experienceHospitalName: 'Massachusetts General Hospital',
                expericenceStart: '2010',
                expericenceEnd: '2020',
                verified: true
            },
            {
                firstName: 'Dr. Michael',
                lastName: 'Chen',
                email: 'michael.chen@example.com',
                address: '456 Health Plaza, Floor 2',
                img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
                phone: '+1-555-0102',
                gender: client_1.Gender.male,
                dob: '1980-07-22',
                biography: 'Dedicated neurologist with expertise in treating complex neurological disorders and stroke management.',
                clinicName: 'NeuroCare Institute',
                clinicAddress: '456 Health Plaza, Floor 2',
                city: 'Los Angeles',
                state: 'CA',
                country: 'USA',
                postalCode: '90210',
                price: '180',
                services: 'Neurology, Stroke Treatment, Brain Surgery',
                specialization: 'Neurology',
                degree: 'MD, PhD',
                college: 'Stanford University School of Medicine',
                completionYear: '2008',
                experience: '12 years',
                designation: 'Chief Neurologist',
                award: 'Excellence in Neurology',
                awardYear: '2019',
                registration: 'MD67890',
                year: '2008',
                experienceHospitalName: 'Stanford Medical Center',
                expericenceStart: '2008',
                expericenceEnd: '2020',
                verified: true
            },
            {
                firstName: 'Dr. Emily',
                lastName: 'Rodriguez',
                email: 'emily.rodriguez@example.com',
                address: '789 Wellness Way, Unit 3',
                img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
                phone: '+1-555-0103',
                gender: client_1.Gender.female,
                dob: '1988-11-08',
                biography: 'Passionate pediatrician committed to providing comprehensive care for children of all ages.',
                clinicName: 'Little Angels Pediatrics',
                clinicAddress: '789 Wellness Way, Unit 3',
                city: 'Chicago',
                state: 'IL',
                country: 'USA',
                postalCode: '60601',
                price: '120',
                services: 'Pediatrics, Vaccinations, Child Care',
                specialization: 'Pediatrics',
                degree: 'MD',
                college: 'Johns Hopkins University School of Medicine',
                completionYear: '2012',
                experience: '8 years',
                designation: 'Pediatrician',
                award: 'Outstanding Pediatric Care',
                awardYear: '2021',
                registration: 'MD11111',
                year: '2012',
                experienceHospitalName: 'Johns Hopkins Hospital',
                expericenceStart: '2012',
                expericenceEnd: '2020',
                verified: true
            },
            {
                firstName: 'Dr. James',
                lastName: 'Wilson',
                email: 'james.wilson@example.com',
                address: '321 Medical Blvd, Suite 5',
                img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
                phone: '+1-555-0104',
                gender: client_1.Gender.male,
                dob: '1975-05-12',
                biography: 'Skilled orthopedic surgeon specializing in joint replacement and sports medicine.',
                clinicName: 'OrthoCare Surgical Center',
                clinicAddress: '321 Medical Blvd, Suite 5',
                city: 'Houston',
                state: 'TX',
                country: 'USA',
                postalCode: '77001',
                price: '200',
                services: 'Orthopedics, Joint Replacement, Sports Medicine',
                specialization: 'Orthopedics',
                degree: 'MD',
                college: 'Baylor College of Medicine',
                completionYear: '2005',
                experience: '15 years',
                designation: 'Orthopedic Surgeon',
                award: 'Surgical Excellence Award',
                awardYear: '2018',
                registration: 'MD22222',
                year: '2005',
                experienceHospitalName: 'Baylor St. Luke\'s Medical Center',
                expericenceStart: '2005',
                expericenceEnd: '2020',
                verified: true
            },
            {
                firstName: 'Dr. Lisa',
                lastName: 'Thompson',
                email: 'lisa.thompson@example.com',
                address: '654 Care Circle, Floor 1',
                img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
                phone: '+1-555-0105',
                gender: client_1.Gender.female,
                dob: '1982-09-30',
                biography: 'Compassionate dermatologist with expertise in treating various skin conditions and cosmetic procedures.',
                clinicName: 'SkinCare Dermatology',
                clinicAddress: '654 Care Circle, Floor 1',
                city: 'Miami',
                state: 'FL',
                country: 'USA',
                postalCode: '33101',
                price: '160',
                services: 'Dermatology, Skin Care, Cosmetic Procedures',
                specialization: 'Dermatology',
                degree: 'MD',
                college: 'University of Miami Miller School of Medicine',
                completionYear: '2009',
                experience: '11 years',
                designation: 'Dermatologist',
                award: 'Dermatology Achievement Award',
                awardYear: '2020',
                registration: 'MD33333',
                year: '2009',
                experienceHospitalName: 'University of Miami Hospital',
                expericenceStart: '2009',
                expericenceEnd: '2020',
                verified: true
            }
        ];
        const createdDoctors = [];
        for (const doctorData of doctors) {
            const doctor = yield prisma.doctor.create({
                data: doctorData
            });
            createdDoctors.push(doctor);
            console.log(`✅ Created doctor: ${doctor.firstName} ${doctor.lastName}`);
        }
        // Create sample patients
        console.log('👥 Creating sample patients...');
        const patients = [
            {
                firstName: 'John',
                lastName: 'Smith',
                dateOfBirth: new Date('1990-01-15'),
                bloodGroup: 'A+',
                mobile: '+1-555-0201',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                gender: 'male',
                country: 'USA',
                email: 'john.smith@example.com',
                address: '123 Main St, New York, NY 10001',
                img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
            },
            {
                firstName: 'Maria',
                lastName: 'Garcia',
                dateOfBirth: new Date('1985-06-20'),
                bloodGroup: 'O+',
                mobile: '+1-555-0202',
                city: 'Los Angeles',
                state: 'CA',
                zipCode: '90210',
                gender: 'female',
                country: 'USA',
                email: 'maria.garcia@example.com',
                address: '456 Oak Ave, Los Angeles, CA 90210',
                img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400'
            },
            {
                firstName: 'David',
                lastName: 'Brown',
                dateOfBirth: new Date('1992-12-10'),
                bloodGroup: 'B+',
                mobile: '+1-555-0203',
                city: 'Chicago',
                state: 'IL',
                zipCode: '60601',
                gender: 'male',
                country: 'USA',
                email: 'david.brown@example.com',
                address: '789 Pine St, Chicago, IL 60601',
                img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
            },
            {
                firstName: 'Sarah',
                lastName: 'Davis',
                dateOfBirth: new Date('1988-03-25'),
                bloodGroup: 'AB+',
                mobile: '+1-555-0204',
                city: 'Houston',
                state: 'TX',
                zipCode: '77001',
                gender: 'female',
                country: 'USA',
                email: 'sarah.davis@example.com',
                address: '321 Elm St, Houston, TX 77001',
                img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
            },
            {
                firstName: 'Robert',
                lastName: 'Miller',
                dateOfBirth: new Date('1995-08-05'),
                bloodGroup: 'O-',
                mobile: '+1-555-0205',
                city: 'Miami',
                state: 'FL',
                zipCode: '33101',
                gender: 'male',
                country: 'USA',
                email: 'robert.miller@example.com',
                address: '654 Maple Dr, Miami, FL 33101',
                img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
            }
        ];
        const createdPatients = [];
        for (const patientData of patients) {
            const patient = yield prisma.patient.create({
                data: patientData
            });
            createdPatients.push(patient);
            console.log(`✅ Created patient: ${patient.firstName} ${patient.lastName}`);
        }
        // Create auth records for doctors and patients
        console.log('🔐 Creating auth records...');
        const authRecords = [];
        // Doctor auth records
        for (const doctor of createdDoctors) {
            const hashedPassword = yield bcrypt_1.default.hash('doctor123', 12);
            const authRecord = yield prisma.auth.create({
                data: {
                    email: doctor.email,
                    password: hashedPassword,
                    userId: doctor.id,
                    role: client_1.UserRole.doctor
                }
            });
            authRecords.push(authRecord);
            console.log(`✅ Created auth for doctor: ${doctor.email}`);
        }
        // Patient auth records
        for (const patient of createdPatients) {
            const hashedPassword = yield bcrypt_1.default.hash('patient123', 12);
            const authRecord = yield prisma.auth.create({
                data: {
                    email: patient.email,
                    password: hashedPassword,
                    userId: patient.id,
                    role: client_1.UserRole.patient
                }
            });
            authRecords.push(authRecord);
            console.log(`✅ Created auth for patient: ${patient.email}`);
        }
        // Create admin user
        const adminPassword = yield bcrypt_1.default.hash('admin123', 12);
        const adminAuth = yield prisma.auth.create({ cv  ,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
            data: {
                email: 'admin@example.com',
                password: adminPassword,
                role: client_1.UserRole.admin
            }
        });
        console.log('✅ Created admin user');
        // Create doctor time slots
        console.log('⏰ Creating doctor time slots...');
        for (const doctor of createdDoctors) {
            const timeSlot = yield prisma.doctorTimeSlot.create({
                data: {
                    doctorId: doctor.id,
                    day: client_1.Day.monday,
                    weekDay: 'Monday',
                    maximumPatient: 10
                }
            });
            // Create schedule for the day
            yield prisma.scheduleDay.createMany({
                data: [
                    {
                        startTime: '09:00',
                        endTime: '10:00',
                        doctorTimeSlotId: timeSlot.id
                    },
                    {
                        startTime: '10:00',
                        endTime: '11:00',
                        doctorTimeSlotId: timeSlot.id
                    },
                    {
                        startTime: '11:00',
                        endTime: '12:00',
                        doctorTimeSlotId: timeSlot.id
                    },
                    {
                        startTime: '14:00',
                        endTime: '15:00',
                        doctorTimeSlotId: timeSlot.id
                    },
                    {
                        startTime: '15:00',
                        endTime: '16:00',
                        doctorTimeSlotId: timeSlot.id
                    },
                    {
                        startTime: '16:00',
                        endTime: '17:00',
                        doctorTimeSlotId: timeSlot.id
                    }
                ]
            });
            console.log(`✅ Created time slots for ${doctor.firstName} ${doctor.lastName}`);
        }
        // Create sample appointments
        console.log('📅 Creating sample appointments...');
        const appointmentStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        const reasons = [
            'Regular checkup',
            'Follow-up consultation',
            'Emergency consultation',
            'Routine examination',
            'Specialist consultation'
        ];
        for (let i = 0; i < 15; i++) {
            const randomDoctor = createdDoctors[Math.floor(Math.random() * createdDoctors.length)];
            const randomPatient = createdPatients[Math.floor(Math.random() * createdPatients.length)];
            const randomStatus = appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)];
            const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
            const appointment = yield prisma.appointments.create({
                data: {
                    patientId: randomPatient.id,
                    doctorId: randomDoctor.id,
                    trackingId: `APT${Date.now()}${i}`,
                    firstName: randomPatient.firstName,
                    lastName: randomPatient.lastName,
                    email: randomPatient.email,
                    phone: randomPatient.mobile,
                    address: randomPatient.address,
                    description: `Appointment for ${randomReason}`,
                    scheduleDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    scheduleTime: '10:00',
                    reasonForVisit: randomReason,
                    status: randomStatus,
                    paymentStatus: randomStatus === 'completed' ? client_1.paymentStatus.paid : client_1.paymentStatus.unpaid,
                    prescriptionStatus: randomStatus === 'completed' ? client_1.prescriptionStatus.issued : client_1.prescriptionStatus.notIssued,
                    isFollowUp: Math.random() > 0.7,
                    patientType: 'New Patient'
                }
            });
            // Create payment for completed appointments
            if (randomStatus === 'completed' && randomDoctor.price) {
                yield prisma.payment.create({
                    data: {
                        appointmentId: appointment.id,
                        paymentMethod: 'Credit Card',
                        paymentType: 'Online',
                        DoctorFee: parseInt(randomDoctor.price),
                        bookingFee: 20,
                        vat: 5,
                        totalAmount: parseInt(randomDoctor.price) + 20 + 5
                    }
                });
            }
            console.log(`✅ Created appointment: ${appointment.trackingId}`);
        }
        // Create sample reviews
        console.log('⭐ Creating sample reviews...');
        for (let i = 0; i < 20; i++) {
            const randomDoctor = createdDoctors[Math.floor(Math.random() * createdDoctors.length)];
            const randomPatient = createdPatients[Math.floor(Math.random() * createdPatients.length)];
            const stars = ['4', '5'];
            const descriptions = [
                'Excellent doctor, very professional and caring.',
                'Great experience, highly recommend!',
                'Very knowledgeable and patient with explanations.',
                'Outstanding care and attention to detail.',
                'Professional and friendly service.'
            ];
            yield prisma.reviews.create({
                data: {
                    doctorId: randomDoctor.id,
                    patientId: randomPatient.id,
                    description: descriptions[Math.floor(Math.random() * descriptions.length)],
                    star: stars[Math.floor(Math.random() * stars.length)],
                    isRecommended: Math.random() > 0.3,
                    response: Math.random() > 0.7 ? 'Thank you for your kind words!' : null
                }
            });
        }
        console.log('✅ Created 20 reviews');
        // Create sample blogs
        console.log('📝 Creating sample blogs...');
        const blogTitles = [
            'Understanding Heart Health: A Comprehensive Guide',
            'Neurological Disorders: Symptoms and Treatment Options',
            'Pediatric Care: Building Healthy Habits from Childhood',
            'Orthopedic Surgery: What to Expect',
            'Skin Care Tips for Different Skin Types'
        ];
        const blogDescriptions = [
            'Heart disease remains one of the leading causes of death worldwide. Understanding the risk factors, symptoms, and preventive measures is crucial for maintaining cardiovascular health. This comprehensive guide covers everything from diet and exercise to medical interventions.',
            'Neurological disorders can be complex and challenging to diagnose. This article explores common neurological conditions, their symptoms, diagnostic procedures, and available treatment options to help patients and families better understand these conditions.',
            'Childhood is the foundation for lifelong health. This guide provides parents with essential information about pediatric care, including vaccination schedules, nutrition guidelines, and when to seek medical attention.',
            'Orthopedic surgery can be intimidating for many patients. This article explains the different types of orthopedic procedures, preparation steps, recovery expectations, and rehabilitation processes.',
            'Every skin type has unique characteristics and requires specific care. This comprehensive guide covers skincare routines, product recommendations, and treatment options for different skin conditions and concerns.'
        ];
        for (let i = 0; i < 5; i++) {
            const randomDoctor = createdDoctors[i % createdDoctors.length];
            yield prisma.blogs.create({
                data: {
                    title: blogTitles[i],
                    description: blogDescriptions[i],
                    img: `https://images.unsplash.com/photo-${1500000000000 + i}?w=600`,
                    userId: randomDoctor.id
                }
            });
        }
        console.log('✅ Created 5 blog posts');
        // Create sample prescriptions
        console.log('💊 Creating sample prescriptions...');
        const diseases = [
            'Hypertension',
            'Diabetes Type 2',
            'Asthma',
            'Migraine',
            'Arthritis'
        ];
        const tests = [
            'Blood pressure monitoring',
            'Blood glucose test',
            'Spirometry test',
            'Neurological examination',
            'X-ray imaging'
        ];
        const instructions = [
            'Take medication as prescribed, monitor blood pressure daily',
            'Follow diabetic diet, exercise regularly, monitor blood sugar',
            'Use inhaler as needed, avoid triggers, regular checkups',
            'Take pain medication at onset, rest in dark room',
            'Physical therapy exercises, avoid heavy lifting, regular follow-up'
        ];
        // Get completed appointments for prescriptions
        const completedAppointments = yield prisma.appointments.findMany({
            where: { status: 'completed' }
        });
        if (completedAppointments.length > 0) {
            for (let i = 0; i < Math.min(10, completedAppointments.length); i++) {
                const appointment = completedAppointments[i];
                const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
                const randomTest = tests[Math.floor(Math.random() * tests.length)];
                const randomInstruction = instructions[Math.floor(Math.random() * instructions.length)];
                const prescription = yield prisma.prescription.create({
                    data: {
                        doctorId: appointment.doctorId || '',
                        patientId: appointment.patientId || '',
                        appointmentId: appointment.id,
                        followUpdate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        instruction: randomInstruction,
                        isFullfilled: Math.random() > 0.5,
                        isArchived: false,
                        daignosis: `Diagnosis: ${randomDisease}`,
                        disease: randomDisease,
                        test: randomTest
                    }
                });
                // Create medicines for prescription
                const medicines = [
                    { medicine: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
                    { medicine: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' },
                    { medicine: 'Albuterol', dosage: '2 puffs', frequency: 'As needed', duration: '90 days' },
                    { medicine: 'Ibuprofen', dosage: '400mg', frequency: 'Every 6 hours', duration: '7 days' },
                    { medicine: 'Acetaminophen', dosage: '500mg', frequency: 'Every 4-6 hours', duration: '7 days' }
                ];
                for (const medicineData of medicines) {
                    yield prisma.medicine.create({
                        data: Object.assign({ prescriptionId: prescription.id }, medicineData)
                    });
                }
            }
            console.log(`✅ Created ${Math.min(10, completedAppointments.length)} prescriptions with medicines`);
        }
        else {
            console.log('⚠️ No completed appointments found, skipping prescriptions');
        }
        // Create sample favourites
        console.log('❤️ Creating sample favourites...');
        let favouriteCount = 0;
        for (const doctor of createdDoctors) {
            if (favouriteCount >= 5)
                break; // Limit to 5 favourites
            const randomPatient = createdPatients[Math.floor(Math.random() * createdPatients.length)];
            try {
                yield prisma.favourites.create({
                    data: {
                        doctorId: doctor.id,
                        patientId: randomPatient.id
                    }
                });
                favouriteCount++;
            }
            catch (error) {
                // Skip if already exists
                continue;
            }
        }
        console.log(`✅ Created ${favouriteCount} favourites`);
        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   👨‍⚕️ Doctors: ${createdDoctors.length}`);
        console.log(`   👥 Patients: ${createdPatients.length}`);
        console.log(`   📅 Appointments: 15`);
        console.log(`   ⭐ Reviews: 20`);
        console.log(`   📝 Blogs: 5`);
        console.log(`   💊 Prescriptions: 10`);
        console.log(`   ❤️ Favourites: 8`);
        console.log('\n🔑 Default Passwords:');
        console.log('   Doctors: doctor123');
        console.log('   Patients: patient123');
        console.log('   Admin: admin123');
    });
}
main()
    .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
