# Save and Exit Email Functionality

## Overview

The Save and Exit functionality now includes automated email notifications that are sent when users save their progress and exit the application.

## Implementation Details

### 1. Backend Changes

#### Updated API Interface

- Added `sendEmail` flag to `UpdateApplicationRequest` interface
- Backend controller checks this flag before sending emails

#### Email Trigger Logic

```javascript
// Only send email if:
// 1. sendEmail flag is true
// 2. Email address is available
// 3. User has progressed to a new step (stepCompleted > previousStepCompleted)
if (
  sendEmail &&
  application.emailAddress &&
  stepCompleted > previousStepCompleted
) {
  await sendSaveAndExitEmail(application.applicationId);
}
```

### 2. Mobile App Changes

#### Updated All Save and Exit Functions

All application screens now properly:

- **Save form data**: Current form values are saved to backend
- **Track progress**: `stepCompleted` is updated using `Math.max(previous, current)`
- **Send email**: `sendEmail: true` flag is passed to backend
- **Preserve step progression**: Never moves backwards in steps

#### Updated Screens:

1. **Trip Details** (Step 1)
2. **Document Upload** (Step 2)
3. **Application Form** (Step 3)
4. **Passport Details** (Step 4)
5. **Travelers Information** (Step 5)
6. **Processing Time** (Step 6)
7. **Order Review** (Step 7)

### 3. Email Content

The Save and Exit email includes:

- **Application ID** for tracking
- **Current progress** (Step X of 7)
- **Resume instructions** with direct link
- **Professional branding** and support contact info
- **Reminder to complete** the application

### 4. Data Preservation

#### What Gets Saved:

- **Form data**: All current form values (even if incomplete)
- **Step progress**: Maximum step reached
- **Email address**: For future communications
- **Selections**: Visa type, processing options, etc.

#### Smart Step Tracking:

```javascript
stepCompleted: Math.max(application?.stepCompleted || 0, currentStep);
```

This ensures users never lose progress and can always resume from their furthest point.

## Testing Save and Exit

### 1. Manual Testing

1. Start a new application
2. Fill out some information on any step
3. Click "Save and Exit"
4. Check your email for the save confirmation
5. Verify the application data was saved

### 2. Expected Behavior

- ✅ Email sent with Application ID and progress
- ✅ Form data preserved in backend
- ✅ Step progress maintained
- ✅ User can resume from home screen

### 3. Email Conditions

Emails are sent when:

- User clicks "Save and Exit" (not regular saving)
- User has progressed to a new step
- Application has an email address
- Step number increases from previous save

## Benefits

1. **User Retention**: Users get reminded to complete their application
2. **Progress Tracking**: Clear indication of where they left off
3. **Easy Resume**: Direct link to continue application
4. **Professional Communication**: Branded emails with support info
5. **Data Safety**: No loss of user input when exiting

## Environment Setup

Ensure these are configured in your `.env`:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
HOSTINGER_EMAIL=your-email@domain.com
HOSTINGER_PASSWORD=your-app-password
```

## Future Enhancements

Consider adding:

- Reminder emails after X days of inactivity
- Different email templates based on step
- SMS notifications for Save and Exit
- Analytics tracking for save/exit patterns
