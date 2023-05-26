import express from 'express';
import FileController from '../controllers/fileController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// This middleware will protect all the routes that come after this point
router.use(authController.protect);

router.get('/', FileController.getFileList);

router.route('/upload')
    .get(FileController.getUploadForm)
    .post(FileController.uploadFile, FileController.parseDxf);

export default router;
