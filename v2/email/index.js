/**
 * Email Module Index
 * Exports all email functionality for easy importing
 */

export {
  sendApplicationStartEmail,
  sendSaveAndExitEmail,
  isValidEmail,
} from './services/emailService.js';
export { sendEmail, createEmailTransporter } from './services/transporter.js';
export { emailConfig } from './config/emailConfig.js';
export {
  generateApplicationStartTemplate,
  generateApplicationStartSubject,
} from './templates/applicationStartTemplate.js';

// Default export for convenience
export { default as emailService } from './services/emailService.js';
