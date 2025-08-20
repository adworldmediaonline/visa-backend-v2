/**
 * Email Configuration for V2 Visa Application System
 * Handles Ethereal (testing) and Production SMTP settings
 */

export const emailConfig = {
  // Company branding information
  branding: {
    companyName: 'VisaCollect',
    logoUrl: 'https://visacollect.com/images/logo.png',
    websiteUrl: 'https://visacollect.com',
    supportEmail: 'support@visacollect.com',
    supportPhone: '+1 (888) 369-3111',
    supportPhoneRaw: '+18883693111',
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
    defaultFrom: process.env.HOSTINGER_EMAIL || 'support@visacollect.com',
    baseUrl: process.env.BASE_URL || 'https://visacollect.com',
    trackingUrl: process.env.TRACKING_URL || 'https://visacollect.com/track',
    resumeUrl: process.env.RESUME_URL || 'https://visacollect.com/resume',
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
