import mongoose from 'mongoose';
import {number} from "sharp/lib/is.js";

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
    }
});

// machineSchema.index({ name: 1 }, { unique: true });

const Machine = mongoose.model('Machine', machineSchema);

export default Machine;
