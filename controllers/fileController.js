import path from 'path';
import multer from 'multer';
import File from '../models/fileModel.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

const FileController = {};

FileController.getUploadForm = (req, res) => {
    // res.render('upload-form');
    console.log('Well done and uploaded')
};

FileController.uploadFile = upload.single('file'), async (req, res) => {
    try {
        const file = new File({
            filename: req.file.filename,
            filepath: req.file.path,
            userId: req.user._id,
        });
        await file.save();
        res.redirect('/files');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

FileController.getFileList = async (req, res) => {
    try {
        const files = await File.find({ userId: req.user._id });
        res.render('file-list', { files });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default FileController;
