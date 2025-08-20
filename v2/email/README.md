# V2 Email Service

A comprehensive email service for the V2 Visa Application System, built from scratch with Nodemailer and Ethereal Email support.

## 📁 Folder Structure

```
v2/email/
├── config/
│   └── emailConfig.js          # Email configuration and settings
├── services/
│   ├── transporter.js          # Nodemailer transporter creation
│   └── emailService.js         # Main email service functions
├── templates/
│   └── applicationStartTemplate.js  # Application start email template
├── index.js                    # Module exports
└── README.md                   # This file
```

## 🚀 Features

- **Ethereal Email Integration**: Automatic test email accounts for development
- **Production SMTP Support**: Configurable production email settings
- **Professional Templates**: Beautiful HTML email templates
- **Error Handling**: Robust error handling that doesn't break application flow
- **Preview URLs**: Ethereal preview URLs for easy email testing
- **Modular Design**: Clean, maintainable code structure

## 📧 Email Types

### 1. Application Start Email
- **Trigger**: When user starts a new visa application with email address
- **Content**: Welcome message, Application ID, tracking instructions, next steps
- **Template**: Professional HTML design with company branding

### 2. Save and Exit Email (Coming Soon)
- **Trigger**: When user saves progress and exits application
- **Content**: Progress summary, resume link, Application ID

## ⚙️ Configuration

### Environment Variables

```bash
# Development/Testing (uses Ethereal)
USE_ETHEREAL=true
NODE_ENV=development

# Production SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
HOSTINGER_EMAIL=your-email@domain.com
HOSTINGER_PASSWORD=your-app-password

# Optional customization
BASE_URL=https://visacollect.com
TRACKING_URL=https://visacollect.com/track
RESUME_URL=https://visacollect.com/resume
```

### Email Configuration

The email service automatically:
- Uses **Ethereal Email** for development/testing
- Falls back to **production SMTP** for live environments
- Creates test accounts automatically
- Provides preview URLs for testing

## 🔧 Usage

### Import the Email Service

```javascript
import { sendApplicationStartEmail } from '../email/index.js';
```

### Send Application Start Email

```javascript
try {
  const result = await sendApplicationStartEmail(applicationId);
  console.log('Email sent successfully:', result.messageId);

  // For development - get preview URL
  if (result.previewURL) {
    console.log('Preview URL:', result.previewURL);
  }
} catch (error) {
  console.error('Email failed:', error);
  // Application continues even if email fails
}
```

## 🧪 Testing

### Development Testing
1. Set `USE_ETHEREAL=true` in environment
2. Start application and trigger email
3. Check console for Ethereal preview URL
4. Open preview URL to see email content

### Production Testing
1. Set production SMTP credentials
2. Set `NODE_ENV=production`
3. Test with real email addresses

## 📝 API Integration

### Start Application Endpoint

```bash
POST /api/v2/visa/applications/start
Content-Type: application/json

{
  "passportCountry": "AU",
  "destinationCountry": "GB",
  "emailAddress": "user@example.com"
}
```

**Response includes:**
- Application ID
- Email confirmation (if sent successfully)
- Ethereal preview URL (in development)

## 🎨 Email Template Features

### Application Start Email
- **Responsive Design**: Works on all devices
- **Professional Branding**: Company logo and colors
- **Clear Application ID**: Prominently displayed
- **Action Buttons**: Continue and Track Application
- **Next Steps**: Clear guidance for users
- **Support Information**: Contact details

### Template Data
```javascript
{
  applicationId: "VISA-ABC123",
  visaName: "United Kingdom ETA",
  passportCountry: "Australia",
  destinationCountry: "United Kingdom",
  userEmail: "user@example.com"
}
```

## 🔒 Security & Privacy

- **No Sensitive Data**: Only Application ID and basic info in emails
- **Secure SMTP**: TLS encryption for production emails
- **Error Isolation**: Email failures don't affect application creation
- **Privacy Compliant**: Minimal data collection

## 🚀 Future Enhancements

- [ ] Save and Exit email template
- [ ] Payment confirmation emails
- [ ] Application status update emails
- [ ] Document upload reminder emails
- [ ] SMS notifications integration
- [ ] Email analytics and tracking
- [ ] Multi-language support
- [ ] Custom email templates per country

## 🐛 Troubleshooting

### Common Issues

1. **Ethereal Account Creation Fails**
   - Check internet connection
   - Service automatically falls back to production SMTP

2. **Production Emails Not Sending**
   - Verify SMTP credentials in environment variables
   - Check firewall/network restrictions
   - Ensure app passwords are used (not regular passwords)

3. **Preview URLs Not Showing**
   - Ensure `USE_ETHEREAL=true` for development
   - Check console logs for preview URLs

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
```

This will show detailed email sending logs and Ethereal account information.

## 📞 Support

For email service issues:
1. Check environment variables
2. Verify email addresses are valid
3. Check server logs for detailed errors
4. Test with different email providers

## 🔄 Migration from Old Email Service

The new email service is a drop-in replacement:

```javascript
// Old import
import { sendApplicationStartEmail } from '../services/emailService.js';

// New import
import { sendApplicationStartEmail } from '../email/index.js';
```

All function signatures remain the same for seamless migration.
