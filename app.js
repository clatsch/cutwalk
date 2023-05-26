import path from 'path';
import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import AppError from './utils/appError.js';
// import globalErrorHandler from './controllers/errorController';
// import shipmentRouter from './routes/shipmentRoutes';
import userRouter from './routes/userRoutes.js';
import fileRouter from './routes/fileRoutes.js';
import materialRouter from './routes/materialRoutes.js';
import machineRouter from './routes/machineRoutes.js';
import cutOptionsRouter from './routes/cutOptionsRoutes.js';
import priceRouter from './routes/priceRoutes.js';
import jobRouter from './routes/jobRoutes.js';
// import viewRouter from './routes/viewRoutes';
// import customerRouter from './routes/customerRoutes';

// Start express app
const app = express();

// GLOBAL MIDDLEWARES
// Set security HTTP headers

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ['\'self\''],
    scriptSrc: ['\'self\'', "'unsafe-inline'", "'unsafe-eval'", 'cdnjs.cloudflare.com', 'code.jquery.com', 'cdn.datatables.net'],
  },
}));


// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 1000000, //ToDO set to 100
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
// ToDo finalize options
app.use(mongoSanitize({
  whitelist: [
    'customer', 'amount',
  ],
}));

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Serving static files
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(express.static(path.join(__dirname, 'public')));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// ROUTES

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   next();
// });

// app.use('/', viewRouter);
// app.use('/api/v1/shipments', shipmentRouter);
app.use('/api/v1/files', fileRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/machines', machineRouter);
app.use('/api/v1/materials', materialRouter);
app.use('/api/v1/cutoptions', cutOptionsRouter);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/calculate-price', priceRouter);
// app.use('/api/v1/customers', customerRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
/*
app.use(globalErrorHandler);
*/
export default app;
