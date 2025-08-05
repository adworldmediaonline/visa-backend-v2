# V2 Email Setup and Testing Guide

## Overview

The V2 visa application system now includes automated email functionality that sends notifications to users when they:

1. **Start an application** - Receive Application ID for tracking
2. **Save and exit** - Get reminder emails to continue their application

## Email Service Features

### 1. Application Start Email

- **Trigger**: When a user starts a new visa application
- **Purpose**: Provides Application ID for tracking and resuming
- **Content**: Welcome message, Application ID, tracking instructions, next steps

### 2. Save and Exit Email

- **Trigger**: When a user saves progress and exits (optional)
- **Purpose**: Reminds users to continue their application
- **Content**: Current progress, resume link, Application ID

## Configuration

### Environment Variables

Ensure these variables are set in your `.env` file:

```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
HOSTINGER_EMAIL=your-email@domain.com
HOSTINGER_PASSWORD=your-app-password
```

### Email Templates

Email templates are located in `v2/services/emailService.js` and include:

- Professional branding
- Clear Application ID display
- Tracking instructions
- Next steps guidance
- Support contact information

## Testing

### 1. Run the Test Script

```bash
cd visa-backend-v2/v2
node test-email.js
```

### 2. Manual Testing via Mobile App

1. Open the mobile app
2. Go to Apply → Country Selection
3. Enter your email address
4. Select countries and continue
5. Check your email for the Application ID

### 3. Test Save and Exit

1. Start an application
2. Progress through some steps
3. Use "Save and Exit" button
4. Check for save confirmation email (if implemented)

## Mobile App Integration

### Updated Features

- **Country Selection**: Now includes email input field
- **Email Validation**: Ensures valid email format
- **Application Start**: Automatically sends email with Application ID
- **User Feedback**: Clear messaging about email notifications

### API Changes

- `StartApplicationRequest` now includes optional `emailAddress` field
- `startApplication` endpoint sends email automatically
- `updateApplication` endpoint can send save/exit emails with `sendEmail` flag

## Important Notes

1. **Email Delivery**: Test with real email addresses to ensure delivery
2. **Error Handling**: Email failures don't prevent application creation
3. **Privacy**: Email addresses are stored securely in the database
4. **Tracking**: Application IDs are unique and generated automatically

## Support

For issues with email functionality:

1. Check SMTP credentials in `.env`
2. Verify email addresses are valid
3. Check server logs for email errors
4. Test with different email providers

## Next Steps

Consider adding:

- Payment confirmation emails
- Application status update emails
- Document upload reminder emails
- Application approval/rejection notifications
