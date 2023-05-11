import multer from 'multer';

import path from 'path';
import File from '../models/fileModel.js';
import AppError from "../utils/appError.js";
import parseDxfFile from '../utils/dxfParser.js';
import dxfParser from 'dxf-parser';

const __dirname = path.dirname(new URL(import.meta.url).pathname);


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
        cb(new AppError('Not a DXF file! Please upload only DXF Files'), false);
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
            userId: req.user._id,
        });

        try {
            // Save the new File object to the database
            await newFile.save();

            // Get the absolute path of the uploaded file
            const absolutePath = path.join(process.cwd(), 'public', 'files', 'uploads', req.file.filename);

            // Parse the DXF file to get the total length and contour count
            const parsedDxf = await parseDxfFile(absolutePath);
            const totalLength = parsedDxf ? parsedDxf.totalLength : 0;
            const contourCount = parsedDxf ? parsedDxf.contourCount : 0;

            // Update the values in the File object
            newFile.set({
                totalLength: totalLength,
                contourCount: contourCount,
            });

            // Save the updated File object to the database
            await newFile.save();
            next()

        } catch (err) {
            return next(err);
        }
    });
};

FileController.parseDxf = async (req, res, next) => {
    const { filename } = req.file;

    try {
        const absolutePath = path.join(process.cwd(), 'public', 'files', 'uploads', filename);
        const parsedDxf = await parseDxfFile(absolutePath);
        res.json(parsedDxf);
    } catch (error) {
        next(error);
    }
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
