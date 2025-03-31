import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import dbConnect from './config/dbConnection.js';
import visaRouter from './routes/visa.js';
import temporaryExitRouter from './routes/temporaryExit.js';
import touristIndividualRouter from './routes/srilanka/touristIndividual/touristIndividual.js';
import turkeyVisaApplicationRouter from './routes/turkey/turkeyVisaApplicationRoute.js';
import australiaVisaApplicationRouter from './routes/australia/australiaTourismVisaApplicationRoute.js';
import { sendMailEveryDayForPendingPayment } from './cron.js';
import thailandVisaApplicationRouter from './routes/thailand/thailandVisaApplicationRoute.js';
import thailandVisaApplicationPersonRouter from './routes/thailand/thailandVisaApplicationPersonRoute.js';
import cambodiaVisaApplicationRouter from './routes/cambodia/cambodiaVisaApplicationRoute.js';
import egyptVisaApplicationRouter from './routes/egypt/egyptVisaApplicationModelRoute.js';
import egyptVisaDetailRouter from './routes/egypt/egyptVisaApplicationVisaDetailModelRoute.js';
import singaporeVisaApplicationRouter from './routes/singapore/singaporeVisaApplicationRoute.js';
import singaporeVisaApplicationPeopleRouter from './routes/singapore/singaporeVisaApplicationPeopleRoute.js';
import malaysiaVisaApplicationRouter from './routes/malaysia/malaysiaVisaApplicationRoute.js';
import malaysiaVisaApplicationPeopleRouter from './routes/malaysia/malaysiaVisaApplicationPeopleRoute.js';
import omanVisaApplicationRouter from './routes/oman/omanVisaApplicationRoute.js';
import omanVisaApplicationPeopleRouter from './routes/oman/omanVisaApplicationPeopleRoute.js';
import indonesiaVisaApplicationRouter from './routes/indonesia/indonesiaVisaApplicationRoute.js';
import japanVisaApplicationRouter from './routes/japan/japanVisaApplicationRoute.js';
import japanVisaApplicationPeopleRouter from './routes/japan/japanVisaApplicationPeopleRoute.js';
import moroccoVisaApplicationRouter from './routes/morocco/moroccoVisaApplicationRoute.js';
import moroccoVisaApplicationPeopleRouter from './routes/morocco/moroccoVisaApplicationPeopleRoute.js';
import paymentVisaApplicationRouter from './routes/payment/paymentRoute.js';
import touristIndividualPersonsRouter from './routes/srilanka/touristIndividual/touristIndividualPersons.js';
import visaBookingRouter from './routes/visaBookingRoute.js';
import { webhookCheckout } from './routes/bookingController.js';
import servicesIndiaTravelVisaRouter from './routes/servicesIndiaTravelVisaRoutes.js';
import travelToIndiaServicesVisaRouter from './routes/travelToIndiaServicesVisaRoutes.js';
import indiaTravelServicesVisaRouter from './routes/indiaTravelServicesVisaRoutes.js';
import blogsRouter from './routes/admin/blogsRoutes.js';
import categoryRouter from './routes/admin/categoryRoutes.js';
import adminsRouter from './routes/admin/adminsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminRouter from './routes/adminD/adminRoutes.js';
import ethiopiaVisaApplicationRouter from './routes/ethiopia/ethiopiaVisaApplicationRoute.js';
import ethiopiaDocumentsRoute from './routes/ethiopia/ethiopiaDocumentsRoute.js';

dotenv.config();
dbConnect();

const port = process.env.PORT || 8000;

const app = express();

// webhook indian visa payment code start here
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

// webhook indian visa payment code end here

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
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

app.use('/api', visaBookingRouter);

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

app.listen(port, () => {
  console.log(`Server is running on Port Number: ${port}`);
});

export default app;
