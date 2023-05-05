import path from 'path';
import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';

import AppError from './utils/appError.js';
// import globalErrorHandler from './controllers/errorController';
// import shipmentRouter from './routes/shipmentRoutes';
import userRouter from './routes/userRoutes.js';
import fileRouter from './routes/fileRoutes.js';
// import viewRouter from './routes/viewRoutes';
// import customerRouter from './routes/customerRoutes';

// Start express app
const app = express();

// GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ['\'self\''],
    scriptSrc: ['\'self\'', 'cdnjs.cloudflare.com', 'code.jquery.com', 'cdn.datatables.net'],
  },
}));

// app.set('view engine', 'ejs');
//
// // could also be './views', but this is safer
// app.set('views', path.join(__dirname, 'views/pages'));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
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
// app.use('/', viewRouter);
// app.use('/api/v1/shipments', shipmentRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/files', fileRouter);
// app.use('/api/v1/customers', customerRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
/*
app.use(globalErrorHandler);
*/
export default app;
