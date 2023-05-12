import mongoose from 'mongoose';

const jobModel = new mongoose.Schema({
    jobName: {
        type: String,
        required: true,
    },
    materialId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Material',
        required: [true, 'Job must have a material assigned to it'],
    },
    fileId: {
        type: mongoose.Schema.ObjectId,
        ref: 'File',
        required: [true, 'Job must belong to a file'],
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Job must belong to a user'],
    },
});

const Job = mongoose.model('Job', jobModel);

export default Job;
