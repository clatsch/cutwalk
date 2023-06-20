import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    updated: {
        type: Date,
        default: Date.now(),
    }
});

const Material = mongoose.model('Material', materialSchema);

export default Material;
