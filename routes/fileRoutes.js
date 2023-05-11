import express from 'express';
import FileController from '../controllers/fileController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// This middleware will protect all the routes that come after this point
router.use(authController.protect);

// Route for rendering the file upload form
router.get('/upload', FileController.getUploadForm);

// Route for handling file uploads
router.post('/upload',
    FileController.uploadFile,
    FileController.parseDxf);

// Route for rendering the list of uploaded files
router.get('/', FileController.getFileList);

export default router;
