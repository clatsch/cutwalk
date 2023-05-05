import express from 'express';
import FileController from '../controllers/fileController.js';

const router = express.Router();

// Route for rendering the file upload form
router.get('/upload', FileController.getUploadForm);

// Route for handling file uploads
router.post('/upload', FileController.uploadFile);

// Route for rendering the list of uploaded files
router.get('/', FileController.getFileList);

export default router;
