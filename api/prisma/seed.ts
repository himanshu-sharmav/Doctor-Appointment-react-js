import { PrismaClient, UserRole, Gender, Day, prescriptionStatus, paymentStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.medicine.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.appointments.deleteMany();
  await prisma.reviews.deleteMany();
  await prisma.favourites.deleteMany();
  await prisma.doctorTimeSlot.deleteMany();
  await prisma.scheduleDay.deleteMany();
  await prisma.blogs.deleteMany();
  await prisma.userVerfication.deleteMany();
  await prisma.forgotPassword.deleteMany();
  await prisma.auth.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();

  console.log('✅ Existing data cleared');

  // Create sample doctors
  console.log('👨‍⚕️ Creating sample doctors...');
  const doctors = [
    {
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      address: '123 Medical Center Dr, Suite 101',
      img: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?w=400',
      phone: '+1-555-0101',
      gender: Gender.female,
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
      college: 'Medical University',
      completionYear: '2010',
      experience: '10 years',
      designation: 'Senior Cardiologist',
      award: 'Excellence in Cardiology',
      awardYear: '2020',
      registration: 'MD12345',
      year: '2010',
      experienceHospitalName: 'General Medical Center',
      expericenceStart: '2010',
      expericenceEnd: '2020',
      verified: true
    },
    {
      firstName: 'Dr. Michael',
      lastName: 'Chen',
      email: 'michael.chen@example.com',
      address: '456 Health Plaza, Floor 2',
      img: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?w=400',
      phone: '+1-555-0102',
      gender: Gender.male,
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
      college: 'University Medical School',
      completionYear: '2008',
      experience: '12 years',
      designation: 'Chief Neurologist',
      award: 'Excellence in Neurology',
      awardYear: '2019',
      registration: 'MD67890',
      year: '2008',
      experienceHospitalName: 'University Medical Center',
      expericenceStart: '2008',
      expericenceEnd: '2020',
      verified: true
    },
    {
      firstName: 'Dr. Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@example.com',
      address: '789 Wellness Way, Unit 3',
      img: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?w=400',
      phone: '+1-555-0103',
      gender: Gender.female,
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
      college: 'University Medical School',
      completionYear: '2012',
      experience: '8 years',
      designation: 'Pediatrician',
      award: 'Outstanding Pediatric Care',
      awardYear: '2021',
      registration: 'MD11111',
      year: '2012',
      experienceHospitalName: 'University Hospital',
      expericenceStart: '2012',
      expericenceEnd: '2020',
      verified: true
    },
    {
      firstName: 'Dr. James',
      lastName: 'Wilson',
      email: 'james.wilson@example.com',
      address: '321 Medical Blvd, Suite 5',
      img: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?w=400',
      phone: '+1-555-0104',
      gender: Gender.male,
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
      college: 'Medical College',
      completionYear: '2005',
      experience: '15 years',
      designation: 'Orthopedic Surgeon',
      award: 'Surgical Excellence Award',
      awardYear: '2018',
      registration: 'MD22222',
      year: '2005',
      experienceHospitalName: 'Medical Center Hospital',
      expericenceStart: '2005',
      expericenceEnd: '2020',
      verified: true
    },
    {
      firstName: 'Dr. Lisa',
      lastName: 'Thompson',
      email: 'lisa.thompson@example.com',
      address: '654 Care Circle, Floor 1',
      img: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?w=400',
      phone: '+1-555-0105',
      gender: Gender.female,
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
      college: 'University Medical School',
      completionYear: '2009',
      experience: '11 years',
      designation: 'Dermatologist',
      award: 'Dermatology Achievement Award',
      awardYear: '2020',
      registration: 'MD33333',
      year: '2009',
      experienceHospitalName: 'University Medical Center',
      expericenceStart: '2009',
      expericenceEnd: '2020',
      verified: true
    }
  ];

  const createdDoctors: any[] = [];
  for (const doctorData of doctors) {
    const doctor = await prisma.doctor.create({
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
      img: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?w=400'
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
      img: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?w=400'
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
      img: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?w=400'
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
      img: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?w=400'
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
      img: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?w=400'
    }
  ];

  const createdPatients: any[] = [];
  for (const patientData of patients) {
    const patient = await prisma.patient.create({
      data: patientData
    });
    createdPatients.push(patient);
    console.log(`✅ Created patient: ${patient.firstName} ${patient.lastName}`);
  }

  // Create auth records for doctors and patients
  console.log('🔐 Creating auth records...');
  const authRecords: any[] = [];

  // Doctor auth records
  for (const doctor of createdDoctors) {
    const hashedPassword = await bcrypt.hash('doctor123', 12);
    const authRecord = await prisma.auth.create({
      data: {
        email: doctor.email,
        password: hashedPassword,
        userId: doctor.id,
        role: UserRole.doctor
      }
    });
    authRecords.push(authRecord);
    console.log(`✅ Created auth for doctor: ${doctor.email}`);
  }

  // Patient auth records
  for (const patient of createdPatients) {
    const hashedPassword = await bcrypt.hash('patient123', 12);
    const authRecord = await prisma.auth.create({
      data: {
        email: patient.email,
        password: hashedPassword,
        userId: patient.id,
        role: UserRole.patient
      }
    });
    authRecords.push(authRecord);
    console.log(`✅ Created auth for patient: ${patient.email}`);
  }

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const adminAuth = await prisma.auth.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      role: UserRole.admin
    }
  });
  console.log('✅ Created admin user');

  // Create doctor time slots
  console.log('⏰ Creating doctor time slots...');
  for (const doctor of createdDoctors) {
    const timeSlot = await prisma.doctorTimeSlot.create({
      data: {
        doctorId: doctor.id,
        day: Day.monday,
        weekDay: 'Monday',
        maximumPatient: 10
      }
    });

    // Create schedule for the day
    await prisma.scheduleDay.createMany({
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

    const appointment = await prisma.appointments.create({
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
        paymentStatus: randomStatus === 'completed' ? paymentStatus.paid : paymentStatus.unpaid,
        prescriptionStatus: randomStatus === 'completed' ? prescriptionStatus.issued : prescriptionStatus.notIssued,
        isFollowUp: Math.random() > 0.7,
        patientType: 'New Patient'
      }
    });

    // Create payment for completed appointments
    if (randomStatus === 'completed' && randomDoctor.price) {
      await prisma.payment.create({
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

    await prisma.reviews.create({
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
    
    await prisma.blogs.create({
      data: {
        title: blogTitles[i],
        description: blogDescriptions[i],
        img: `https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?w=600`,
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
  const completedAppointments = await prisma.appointments.findMany({
    where: { status: 'completed' }
  });

  if (completedAppointments.length > 0) {
    for (let i = 0; i < Math.min(10, completedAppointments.length); i++) {
      const appointment = completedAppointments[i];
      const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
      const randomTest = tests[Math.floor(Math.random() * tests.length)];
      const randomInstruction = instructions[Math.floor(Math.random() * instructions.length)];

      const prescription = await prisma.prescription.create({
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
        await prisma.medicine.create({
          data: {
            prescriptionId: prescription.id,
            ...medicineData
          }
        });
      }
    }
    console.log(`✅ Created ${Math.min(10, completedAppointments.length)} prescriptions with medicines`);
  } else {
    console.log('⚠️ No completed appointments found, skipping prescriptions');
  }

  // Create sample favourites
  console.log('❤️ Creating sample favourites...');
  let favouriteCount = 0;
  for (const doctor of createdDoctors) {
    if (favouriteCount >= 5) break; // Limit to 5 favourites
    
    const randomPatient = createdPatients[Math.floor(Math.random() * createdPatients.length)];

    try {
      await prisma.favourites.create({
        data: {
          doctorId: doctor.id,
          patientId: randomPatient.id
        }
      });
      favouriteCount++;
    } catch (error) {
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
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
