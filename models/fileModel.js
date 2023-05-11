import mongoose from 'mongoose';

const fileModel = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    filepath: {
        type: String,
        required: true,
    },
    totalLength: {
        type: Number,
        default: 0,
    },
    contourCount: {
        type: Number,
        default: 0,
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Upload must belong to a user'],
    },
});

const File = mongoose.model('File', fileModel);

export default File;
