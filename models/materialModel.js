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
    // Other material attributes
});

const Material = mongoose.model('Material', materialSchema);

export default Material;

// import mongoose from 'mongoose';
//
// const thicknessSchema = new mongoose.Schema({
//     thickness: {
//         type: String,
//         required: true,
//     },
//     abrasiveFlow: { type: Number, default: 450 },
//     pressure: { type: Number, default: 3800 },
//     xRough: { type: Number, default: 0 },
//     rough: { type: Number, default: 0 },
//     medium: { type: Number, default: 0 },
//     fine: { type: Number, default: 0 },
//     xFine: { type: Number, default: 0 },
//     photo: { type: String, default: '' },
// });
//
// const materialSchema = new mongoose.Schema({
//     material: {
//         type: String,
//         required: true,
//     },
//     thicknesses: [thicknessSchema],
// });
//
// const Material = mongoose.model('Material', materialSchema);
//
// export default Material;
