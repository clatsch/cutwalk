import mongoose from 'mongoose';

const machineSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'There is already a machine with this name'],
        required: true
    },
    type: {
        type: String,
        required: true
    },
    maxWidth: {
        type: Number,
        required: true
    },
    maxLength: {
        type: Number,
        required: true
    },
    maxHeight: {
        type: Number,
        required: true
    },
    rate: {
        type: Number,
        default: 120,
    },
    updated: {
        type: Date,
        default: Date.now(),
    }
});

// machineSchema.index({ name: 1 }, { unique: true });

const Machine = mongoose.model('Machine', machineSchema);

export default Machine;
