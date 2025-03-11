// utils/cronJob.js

import cron from 'node-cron';
import visaRequestFormController from '../controllers/visa.js';

const startCronJob = () => {
  // Schedule the task to run every 2 minutes
  cron.schedule('* * * * *', () => {
    console.log('Running the task to send emails...');
    visaRequestFormController.sendPendingMailVisaRequestForm();
  });
};

export default startCronJob;
