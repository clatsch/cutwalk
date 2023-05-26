import express from 'express';
import priceController from '../controllers/priceController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// This middleware will protect all the routes that come after this point
router.use(authController.protect);

// Route for handling materials
router.route('/')
    .post(priceController.calculatePrice);

// Route for rendering the list of uploaded files

export default router;
