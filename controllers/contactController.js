import Contact from '../models/contactModel.js';
import nodemailer from 'nodemailer';

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.HOSTINGER_EMAIL,
      pass: process.env.HOSTINGER_PASSWORD,
    },
    tls: { ciphers: 'TLSv1.2' },
    requireTLS: true,
    debug: false,
    connectionTimeout: 10000,
  });
};

// Submit contact form
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required (name, email, message)',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address',
      });
    }

    // Get client info
    const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Save to database
    const contactSubmission = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      ipAddress,
      userAgent,
    });

    await contactSubmission.save();

    // Send notification email to admin
    try {
      const transporter = createTransporter();
      
      const adminMailOptions = {
        from: process.env.HOSTINGER_EMAIL,
        to: process.env.ADMIN_EMAIL || process.env.HOSTINGER_EMAIL,
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
            <div style='background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;'>
              <h2 style='color: #1998c7; margin: 0;'>New Contact Form Submission</h2>
            </div>
            
            <div style='background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;'>
              <table style='width: 100%; border-collapse: collapse;'>
                <tr>
                  <td style='padding: 10px; border-bottom: 1px solid #e9ecef; font-weight: bold; width: 30%;'>Name:</td>
                  <td style='padding: 10px; border-bottom: 1px solid #e9ecef;'>${name}</td>
                </tr>
                <tr>
                  <td style='padding: 10px; border-bottom: 1px solid #e9ecef; font-weight: bold;'>Email:</td>
                  <td style='padding: 10px; border-bottom: 1px solid #e9ecef;'>${email}</td>
                </tr>
                <tr>
                  <td style='padding: 10px; border-bottom: 1px solid #e9ecef; font-weight: bold;'>Submission ID:</td>
                  <td style='padding: 10px; border-bottom: 1px solid #e9ecef;'>${contactSubmission._id}</td>
                </tr>
                <tr>
                  <td style='padding: 10px; border-bottom: 1px solid #e9ecef; font-weight: bold;'>Date:</td>
                  <td style='padding: 10px; border-bottom: 1px solid #e9ecef;'>${new Date().toLocaleString()}</td>
                </tr>
                <tr>
                  <td style='padding: 10px; border-bottom: 1px solid #e9ecef; font-weight: bold;'>IP Address:</td>
                  <td style='padding: 10px; border-bottom: 1px solid #e9ecef;'>${ipAddress}</td>
                </tr>
              </table>
              
              <div style='margin-top: 20px;'>
                <h4 style='color: #495057; margin-bottom: 10px;'>Message:</h4>
                <div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #1998c7;'>
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(adminMailOptions);
    } catch (emailError) {
      console.error('Error sending admin notification email:', emailError);
      // Don't fail the request if email fails
    }

    // Note: User confirmation email disabled as per requirements

    res.status(201).json({
      status: 'success',
      message: 'Thank you for your message! We will get back to you soon.',
      data: {
        id: contactSubmission._id,
        name: contactSubmission.name,
        email: contactSubmission.email,
        submittedAt: contactSubmission.createdAt,
      },
    });

  } catch (error) {
    console.error('Error in submitContactForm:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: messages,
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'An error occurred while processing your request. Please try again later.',
    });
  }
};

// Get all contact submissions (admin only)
export const getAllContactSubmissions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) {
      query.status = status;
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        contacts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error in getAllContactSubmissions:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching contact submissions.',
    });
  }
};

// Get contact submission by ID (admin only)
export const getContactSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact submission not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { contact },
    });
  } catch (error) {
    console.error('Error in getContactSubmissionById:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching the contact submission.',
    });
  }
};

// Update contact submission status (admin only)
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'responded'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status. Must be one of: new, read, responded',
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact submission not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Contact status updated successfully.',
      data: { contact },
    });
  } catch (error) {
    console.error('Error in updateContactStatus:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the contact status.',
    });
  }
}; 