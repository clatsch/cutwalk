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
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const File = mongoose.model('File', fileModel);

export default File;
