const mongoose = require('mongoose');
const Service = require('../models/Service');
const User = require('../models/User');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed default services if empty
    const count = await Service.countDocuments();
    if (count === 0) {
      await Service.create([
        {
          name: 'Certificate Office',
          prefix: 'CERT',
          description: 'Degree certificates, transcripts, Bonafide and ID cards',
          location: 'Admin Block, Ground Floor',
          counterNumber: 'Counter 2',
          averageServiceTime: 4,
          status: 'OPEN',
        },
        {
          name: 'Accounts Section',
          prefix: 'ACC',
          description: 'Tuition fees, scholarship disbursements, and fine clearance',
          location: 'Admin Block, 1st Floor',
          counterNumber: 'Counter 1',
          averageServiceTime: 6,
          status: 'OPEN',
        },
        {
          name: 'IT Help Desk',
          prefix: 'IT',
          description: 'Campus WiFi setup, portal password resets, and lab accounts',
          location: 'Tech Hub, Room 104',
          counterNumber: 'Counter 4',
          averageServiceTime: 5,
          status: 'OPEN',
        },
        {
          name: 'Central Library',
          prefix: 'LIB',
          description: 'Book issuance, returns, digital repository access, and NOC',
          location: 'Central Library, Block C',
          counterNumber: 'Circulation Desk',
          averageServiceTime: 3,
          status: 'OPEN',
        },
        {
          name: 'Examination Cell',
          prefix: 'EXAM',
          description: 'Hall tickets, revaluation applications, and grade sheets',
          location: 'Exam Wing, 2nd Floor',
          counterNumber: 'Counter 3',
          averageServiceTime: 5,
          status: 'CLOSED',
        },
      ]);
      console.log('✅ Pre-seeded 5 default campus services into MongoDB.');
    }

    // Seed default users for Admin, Staff, and Student
    const adminExists = await User.findOne({ email: 'admin@queueless.com' });
    if (!adminExists) {
      await User.create({
        name: 'System Administrator',
        email: 'admin@queueless.com',
        studentId: 'ADM-001',
        phone: '+91 98765 00001',
        password: 'admin123',
        role: 'ADMIN',
      });
      console.log('✅ Seeded Admin: admin@queueless.com / admin123');
    }

    const staffExists = await User.findOne({ email: 'staff@queueless.com' });
    if (!staffExists) {
      await User.create({
        name: 'Desk Operator 1',
        email: 'staff@queueless.com',
        studentId: 'STF-001',
        phone: '+91 98765 00002',
        password: 'staff123',
        role: 'STAFF',
      });
      console.log('✅ Seeded Staff: staff@queueless.com / staff123');
    }

    const studentExists = await User.findOne({ email: 'student@queueless.com' });
    if (!studentExists) {
      await User.create({
        name: 'Karthick R (Student)',
        email: 'student@queueless.com',
        studentId: '2024-CSE-01',
        phone: '+91 98765 43210',
        password: 'student123',
        role: 'USER',
      });
      console.log('✅ Seeded Student: student@queueless.com / student123');
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
