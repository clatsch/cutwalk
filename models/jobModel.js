import mongoose from 'mongoose';

const jobModel = new mongoose.Schema({
    jobName: {
        type: String,
        required: true,
    },
    machineId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Machine',
        //required: [true, 'Job must have a material assigned to it'],
    },
    materialId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Material',
        //required: [true, 'Job must have a material assigned to it'],
    },
    cutOptionsId: {
        type: mongoose.Schema.ObjectId,
        ref: 'CutOptions',
        //required: [true, 'Job must have a material assigned to it'],
    },
    totalLength: {
        type: Number
    },
    price: {
        type: Number
    },

    quality: {
        type: String
    },
    fileId: {
        type: mongoose.Schema.ObjectId,
        ref: 'File',
        required: [true, 'Job must belong to a file'],
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        //required: [true, 'Job must belong to a user'],
    },
    tags: [String]
});

jobModel.pre(/^find/, function (next) {
    this.populate({
        path: 'machineId',
        select: '-_id name',
    }).populate({
        path: 'materialId',
        select: '-_id name',
    }).populate({
        path: 'cutOptionsId',
        select: '-_id thickness',
    })

    next();
})

const Job = mongoose.model('Job', jobModel);

export default Job;
