import dotenv from 'dotenv';
import mongoose from 'mongoose';
import VisaApplication from './models/visaApplication.model.js';
import {
  sendApplicationStartEmail,
  sendSaveAndExitEmail,
} from './services/emailService.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/visa-application'
    );
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Test email functionality
const testEmailFlow = async () => {
  console.log('🧪 Testing V2 Email Functionality...\n');

  try {
    // Connect to database
    await connectDB();

    // Create a test application
    const testApplication = new VisaApplication({
      passportCountry: {
        name: 'Australia',
        code: 'AU',
        flag: '🇦🇺',
      },
      destinationCountry: {
        name: 'United Kingdom',
        code: 'GB',
        flag: '🇬🇧',
      },
      emailAddress: 'test@example.com', // Replace with your test email
      source: 'test',
    });

    await testApplication.save();
    console.log('✅ Test application created:', testApplication.applicationId);

    // Test 1: Application Start Email
    console.log('\n📧 Testing Application Start Email...');
    try {
      await sendApplicationStartEmail(testApplication.applicationId);
      console.log('✅ Application start email sent successfully');
    } catch (error) {
      console.error('❌ Application start email failed:', error.message);
    }

    // Test 2: Save and Exit Email
    console.log('\n📧 Testing Save and Exit Email...');
    try {
      // Update the application to simulate progress
      testApplication.stepCompleted = 2;
      testApplication.visaOptionName = 'United Kingdom ETA';
      await testApplication.save();

      await sendSaveAndExitEmail(testApplication.applicationId);
      console.log('✅ Save and exit email sent successfully');
    } catch (error) {
      console.error('❌ Save and exit email failed:', error.message);
    }

    // Clean up: Remove test application
    await VisaApplication.deleteOne({ _id: testApplication._id });
    console.log('\n🧹 Test application cleaned up');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n✅ Test completed');
    process.exit(0);
  }
};

// Run the test
testEmailFlow();
