import express from 'express';
import viewsController from '../controllers/viewsController.js';
import authController from '../controllers/authController.js';

const router = express.Router();

// isLoggedIn in unprotected routes, if globally, query of isLoggedIn and protect would both run
router.get('/', authController.isLoggedIn, viewsController.getLoginForm)
router.get('/forgotpassword', authController.isLoggedIn, viewsController.getForgotPasswordForm)
router.get('/resetpassword/:token', authController.isLoggedIn, viewsController.getResetPasswordForm)
router.get('/shipments', authController.protect, viewsController.getShipments );
router.get('/shipment/:id', authController.protect, viewsController.getShipment);
router.get('/newShipment', authController.protect, viewsController.getNewShipment);
router.get('/customers', authController.protect, viewsController.getCustomers)
router.get('/customer/:id', authController.protect, viewsController.getCustomer);
router.get('/newCustomer', authController.protect, viewsController.getNewCustomer)
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/users', authController.protect, authController.restrictsTo('admin'), viewsController.getUsers)
router.get('/user/:id', authController.protect, authController.restrictsTo('admin'), viewsController.getUser)
router.get('/users/signup', authController.protect, authController.restrictsTo('admin'), viewsController.getSignupForm)

export default router;
