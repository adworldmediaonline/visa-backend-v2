import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import dbConnect from './config/dbConnection.js';
import { webhookCheckout } from './controllers/indiaVisa/paymentIndiaVisaController.js';
import { sendMailEveryDayForPendingPayment } from './cron.js';
import adminsRouter from './routes/admin/adminsRoutes.js';
import blogsRouter from './routes/admin/blogsRoutes.js';
import categoryRouter from './routes/admin/categoryRoutes.js';
import adminRouter from './routes/adminD/adminRoutes.js';
import australiaVisaApplicationRouter from './routes/australia/australiaTourismVisaApplicationRoute.js';
import cambodiaVisaApplicationRouter from './routes/cambodia/cambodiaVisaApplicationRoute.js';
import contactRouter from './routes/contactRoutes.js';
import egyptVisaApplicationRouter from './routes/egypt/egyptVisaApplicationModelRoute.js';
import egyptVisaDetailRouter from './routes/egypt/egyptVisaApplicationVisaDetailModelRoute.js';
import egyptDeclarationRouter from './routes/egyptN/egyptDeclarationRoutes.js';
import egyptDocumentsRoute from './routes/egyptN/egyptDocumentsRoute.js';
import egyptEmailRouter from './routes/egyptN/egyptEmailRoutes.js';
import egyptGovRefDetailsRouter from './routes/egyptN/egyptGovRefDetailsRoute.js';
import egyptPaymentRouter from './routes/egyptN/egyptPaymentRoutes.js';
import egyptVisaApplicationRouterN from './routes/egyptN/egyptVisaApplicationRoute.js';
import ethiopiaDocumentsRoute from './routes/ethiopia/ethiopiaDocumentsRoute.js';
import mailRouter from './routes/ethiopia/ethiopiaEmailRoutes.js';
import ethiopiaGovRefDetailsRouter from './routes/ethiopia/ethiopiaGovRefDetailsRoute.js';
import ethiopiaPaymentRouter from './routes/ethiopia/ethiopiaPaymentRoutes.js';
import ethiopiaVisaApplicationRouter from './routes/ethiopia/ethiopiaVisaApplicationRoute.js';
import indiaTravelServicesVisaRouter from './routes/indiaTravelServicesVisaRoutes.js';
import indiaVisaRouter from './routes/indiaVisa/indiaVisaApplicationRoute.js';
import indiaVisaPaymentRouter from './routes/indiaVisa/paymentIndiaVisaRoute.js';
import indonesiaVisaApplicationRouter from './routes/indonesia/indonesiaVisaApplicationRoute.js';
import japanVisaApplicationPeopleRouter from './routes/japan/japanVisaApplicationPeopleRoute.js';
import japanVisaApplicationRouter from './routes/japan/japanVisaApplicationRoute.js';
import kenyaDeclarationRouter from './routes/kenya/kenyaDeclarationRoutes.js';
import kenyaDocumentsRoute from './routes/kenya/kenyaDocumentsRoute.js';
import kenyaEmailRouter from './routes/kenya/kenyaEmailRoutes.js';
import kenyaGovRefDetailsRouter from './routes/kenya/kenyaGovRefDetailsRoute.js';
import kenyaPaymentRouter from './routes/kenya/kenyaPaymentRoutes.js';
import kenyaVisaApplicationRouter from './routes/kenya/kenyaVisaApplicationRoute.js';
import malaysiaVisaApplicationPeopleRouter from './routes/malaysia/malaysiaVisaApplicationPeopleRoute.js';
import malaysiaVisaApplicationRouter from './routes/malaysia/malaysiaVisaApplicationRoute.js';
import moroccoVisaApplicationPeopleRouter from './routes/morocco/moroccoVisaApplicationPeopleRoute.js';
import moroccoVisaApplicationRouter from './routes/morocco/moroccoVisaApplicationRoute.js';
import omanVisaApplicationPeopleRouter from './routes/oman/omanVisaApplicationPeopleRoute.js';
import omanVisaApplicationRouter from './routes/oman/omanVisaApplicationRoute.js';
import paymentVisaApplicationRouter from './routes/payment/paymentRoute.js';
import servicesIndiaTravelVisaRouter from './routes/servicesIndiaTravelVisaRoutes.js';
import simpleUploadRouter from './routes/simpleUpload.routes.js';
import singaporeVisaApplicationPeopleRouter from './routes/singapore/singaporeVisaApplicationPeopleRoute.js';
import singaporeVisaApplicationRouter from './routes/singapore/singaporeVisaApplicationRoute.js';
import touristIndividualRouter from './routes/srilanka/touristIndividual/touristIndividual.js';
import touristIndividualPersonsRouter from './routes/srilanka/touristIndividual/touristIndividualPersons.js';
import temporaryExitRouter from './routes/temporaryExit.js';
import thailandVisaApplicationPersonRouter from './routes/thailand/thailandVisaApplicationPersonRoute.js';
import thailandVisaApplicationRouter from './routes/thailand/thailandVisaApplicationRoute.js';
import travelToIndiaServicesVisaRouter from './routes/travelToIndiaServicesVisaRoutes.js';
import turkeyVisaApplicationRouter from './routes/turkey/turkeyVisaApplicationRoute.js';
import uploadRoutes from './routes/uploadRoutes.js';
import visaRouter from './routes/visa.js';
// V2 Routes - New centralized visa application system
import visaV2Router from './v2/routes/visa.routes.js';

dotenv.config();
dbConnect();

const port = process.env.PORT || 8090;

const app = express();

// CRITICAL: Debug logging middleware for all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// IMPORTANT: Webhook routes MUST be defined BEFORE any body parsers
// These routes get the raw request body needed for signature verification
// Define multiple webhook paths with both variations (with/without trailing slash)
const webhookPaths = [
  '/api/v1/india-visa/payments/webhook-checkout',
  '/api/v1/india-visa/payments/webhook-checkout/',
];

webhookPaths.forEach(path => {
  app.post(
    path,
    express.raw({ type: 'application/json' }),
    (req, res, next) => {
      console.log(`Webhook received on path: ${req.path}`);
      console.log(
        'Stripe signature:',
        req.headers['stripe-signature'] ? 'Present' : 'Missing'
      );
      console.log('Body type:', typeof req.body);
      console.log('Body is Buffer:', Buffer.isBuffer(req.body));
      console.log('Body length:', req.body?.length || 0);

      // Now pass to the actual webhook handler
      webhookCheckout(req, res);
    }
  );
});

// Regular middleware setup - AFTER the webhook route
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Platform',
      'X-Requested-With',
    ],
  })
);
app.use(cookieParser());

app.use(
  bodyParser.json({
    limit: '50mb',
  })
);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome To Budgetree Api Test Server' });
});

// V2 Routes - New centralized visa application system
app.use('/api/v2/visa', visaV2Router);

// Simple Upload Routes - For testing file uploads
app.use('/api/v2/simple-upload', simpleUploadRouter);

app.use('/visa', visaRouter, temporaryExitRouter);
app.use(
  '/visa/services-travel-india',
  servicesIndiaTravelVisaRouter,
  temporaryExitRouter
);
app.use(
  '/visa/travel-to-india-services',
  travelToIndiaServicesVisaRouter,
  temporaryExitRouter
);
app.use(
  '/visa/india-travel-services',
  indiaTravelServicesVisaRouter,
  temporaryExitRouter
);
app.use('/slvisa', touristIndividualRouter);
app.use('/slvisa', touristIndividualPersonsRouter);

app.use('/turkeyvisa', turkeyVisaApplicationRouter);
app.use('/australiavisa', australiaVisaApplicationRouter);
app.use('/cambodiavisa', cambodiaVisaApplicationRouter);
app.use('/indonesiavisa', indonesiaVisaApplicationRouter);
app.use('/egyptvisa', egyptVisaApplicationRouter, egyptVisaDetailRouter);
app.use(
  '/singaporevisa',
  singaporeVisaApplicationRouter,
  singaporeVisaApplicationPeopleRouter
);
app.use(
  '/omanvisa',
  omanVisaApplicationRouter,
  omanVisaApplicationPeopleRouter
);
app.use(
  '/moroccovisa',
  moroccoVisaApplicationRouter,
  moroccoVisaApplicationPeopleRouter
);
app.use(
  '/malaysiavisa',
  malaysiaVisaApplicationRouter,
  malaysiaVisaApplicationPeopleRouter
);
app.use(
  '/japanvisa',
  japanVisaApplicationRouter,
  japanVisaApplicationPeopleRouter
);
app.use(
  '/thailandvisa',
  thailandVisaApplicationRouter,
  thailandVisaApplicationPersonRouter
);
app.use('/evisapayment', paymentVisaApplicationRouter);

sendMailEveryDayForPendingPayment();

// india visa routes
app.use('/api/v1/india-visa', indiaVisaRouter);
app.use('/api/v1/india-visa/payments', indiaVisaPaymentRouter);
// Webhook route is now defined at the top of the file

// for admin dashboard
app.use('/api/v1/blogs', blogsRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/admins', adminsRouter);

app.use('/api/v1/upload', uploadRoutes);

// New Admin Routes
app.use('/api/v1/adminD', adminRouter);

// Ethiopia Visa Routes
app.use('/api/v1/ethiopia-visa', ethiopiaVisaApplicationRouter);
app.use('/api/v1/ethiopia-visa/documents', ethiopiaDocumentsRoute);
app.use('/api/v1/mail', mailRouter);
app.use('/api/v1/ethiopia-visa/payments', ethiopiaPaymentRouter);
app.use('/api/v1/ethiopia-visa/gov-ref', ethiopiaGovRefDetailsRouter);

// Kenya Visa Routes
app.use('/api/v1/kenya-visa', kenyaVisaApplicationRouter);
app.use('/api/v1/kenya-visa/documents', kenyaDocumentsRoute);
app.use('/api/v1/kenya-visa/payments', kenyaPaymentRouter);
app.use('/api/v1/kenya-visa/gov-ref', kenyaGovRefDetailsRouter);
app.use('/api/v1/kenya-visa/declarations', kenyaDeclarationRouter);
app.use('/api/v1/kenya-visa/mail', kenyaEmailRouter);

// Egypt Visa Routes
app.use('/api/v1/egypt-visa', egyptVisaApplicationRouterN);
app.use('/api/v1/egypt-visa/documents', egyptDocumentsRoute);
app.use('/api/v1/egypt-visa/payments', egyptPaymentRouter);
app.use('/api/v1/egypt-visa/gov-ref', egyptGovRefDetailsRouter);
app.use('/api/v1/egypt-visa/declarations', egyptDeclarationRouter);
app.use('/api/v1/egypt-visa/mail', egyptEmailRouter);

// Contact Routes
app.use('/api/contact', contactRouter);

// 404 handler
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl,
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on Port Number: ${port}`);
  console.log(`Server accessible at:`);
  console.log(`  - Local: http://localhost:${port}`);
  console.log(`  - Network: http://192.168.31.81:${port}`);
});

export default app;
