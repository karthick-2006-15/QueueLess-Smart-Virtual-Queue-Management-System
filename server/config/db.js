const mongoose = require('mongoose');
const Service = require('../models/Service');

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
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
