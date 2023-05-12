import Job from '../models/jobModel.js';
import catchAsync from '../utils/catchAsync.js';
import * as factory from './handlerFactory.js';

// ToCheck - Nested routes
export const setJobUserIds = (req, res, next) => {
    if (!req.body.job) req.body.job = req.params.jobId;
    if (!req.body.user) req.body.user = req.user._id;
    next();
};

export const getAllJobs = factory.getAll(Job);
export const getJob = factory.getOne(Job);
export const createJob = factory.createOne(Job);
export const updateJob = factory.updateOne(Job);
export const deleteJob = factory.deleteOne(Job);


