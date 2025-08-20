/**
 * Email Configuration for V2 Visa Application System
 * Handles Ethereal (testing) and Production SMTP settings
 */

export const emailConfig = {
  // Company branding information
  branding: {
    companyName: 'VisaCollect',
    logoUrl: 'https://visacollect.com/images/logo.png',
    supportEmail: 'info@visacollect.com',
  },

  // SMTP Configuration
  smtp: {
    // Production settings
    production: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.HOSTINGER_EMAIL || 'support@visacollect.com',
        pass: process.env.HOSTINGER_PASSWORD || 'your-password',
      },
      tls: { ciphers: 'TLSv1.2' },
      requireTLS: true,
      connectionTimeout: 10000,
    },

    // Ethereal settings (for testing)
    ethereal: {
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'anna.yost80@ethereal.email',
        pass: 'h8br5jQFGMAaH1VHPv',
      },
    },
  },

  // Email template settings
  templates: {
    defaultFrom: process.env.HOSTINGER_EMAIL || 'info@visacollect.com',
    // Mobile app deep links
    continueAppUrl: 'visacollect://home', // Opens Home tab in mobile app
    trackAppUrl: 'visacollect://track', // Opens Track tab in mobile app
  },

  // Environment detection
  environment: {
    isProduction: process.env.NODE_ENV === 'production',
    useEthereal:
      process.env.USE_ETHEREAL === 'true' ||
      process.env.NODE_ENV !== 'production',
  },
};

export default emailConfig;
