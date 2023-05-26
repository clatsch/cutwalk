import express from 'express';
import * as jobController from '../controllers/jobController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// This middleware will protect all the routes that come after this point
router.use(authController.protect);

router.route('/')
    .get(jobController.getAllJobs)
    .post(jobController.createJob);

router.route('/:id')
    .get(jobController.getJob)

// Route for handling file uploads

export default router;
