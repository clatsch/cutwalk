import multer from 'multer';
import File from '../models/fileModel.js';
import AppError from "../utils/appError.js";

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/files/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const uploadFilter = (req, file, cb) => {
    if (file.mimetype === 'image/vnd.dxf') {
        cb(null, true);
    } else {
        cb(new AppError('Not a DXF file, Please upload only DXF Files'), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: uploadFilter
});

const FileController = {};

FileController.getUploadForm = (req, res) => {
    // res.render('upload-form');
    console.log('Well done and uploaded')
};

FileController.uploadFile = (req, res, next) => {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            return next(err);
        }

        // Create a new File object
        const newFile = new File({
            filename: req.file.filename,
            filepath: req.file.path,
            userId: req.user._id
        });

        try {
            // Save the new File object to the database
            await newFile.save();
            res.send('File uploaded successfully');
        } catch (err) {
            return next(err);
        }
    });
};

FileController.getFileList = async (req, res) => {
    try {
        const files = await File.find({ userId: req.user._id });
        res.status(200).json({
            status: 'success',
            data: {
                files
            }
        });
        // res.render('file-list', { files });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default FileController;
