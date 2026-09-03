const User = require('../models/User');
const Case = require('../models/Case');
const TimelineEvent = require('../models/TimelineEvent');
const Message = require('../models/Message');
const Document = require('../models/Document');
const Appointment = require('../models/Appointment');
const Task = require('../models/Task');
const Note = require('../models/Note');

const seedData = async () => {
  try {
    // 1. Wipe all collections clean in MongoDB
    await Promise.all([
      User.deleteMany({}),
      Case.deleteMany({}),
      TimelineEvent.deleteMany({}),
      Message.deleteMany({}),
      Document.deleteMany({}),
      Appointment.deleteMany({}),
      Task.deleteMany({}),
      Note.deleteMany({})
    ]);

    console.log('[JusticeHub Seed] MongoDB database wiped completely clean.');
    console.log('[JusticeHub Seed] Creating initial production authentication accounts...');

    // 2. Create Director Admin Account
    const admin = await User.create({
      name: 'Director Rajeshwar Natarajan',
      email: 'admin@justicehub.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 98765 00000',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
    });

    // 3. Create Empaneled Senior Advocate Account
    const lawyer1 = await User.create({
      name: 'Adv. Priya Mehta',
      email: 'lawyer1@justicehub.com',
      password: 'password123',
      role: 'lawyer',
      phone: '+91 98112 34567',
      specialization: 'Property & Real Estate Law',
      experienceYears: 14,
      lawyerStatus: 'Available',
      bio: 'Senior Counsel specializing in commercial property disputes, land acquisition title audits, and real estate litigation.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    });

    // 4. Create Client Account
    const client1 = await User.create({
      name: 'Rahul Sharma',
      email: 'client@justicehub.com',
      password: 'password123',
      role: 'client',
      phone: '+91 99887 65432',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    });

    // Sync Cloudinary folders for accounts
    const upload = require('../config/upload');
    const allUsers = [admin, lawyer1, client1];
    for (const u of allUsers) {
      await upload.syncClientDetailsToCloudinary(u, []);
    }

    console.log('[JusticeHub Seed] Clean Production Database initialized with 0 dummy cases.');
  } catch (error) {
    console.error('[JusticeHub Seed] Error seeding database:', error);
  }
};

module.exports = seedData;
