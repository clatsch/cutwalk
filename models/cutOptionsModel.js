import mongoose from 'mongoose';

const cutOptionsSchema = new mongoose.Schema({
    machineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machine',
        required: true
    },
    materialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
        required: true
    },
    thickness: {
        type: Number,
        required: true
    },
    abrasiveFlow: {type: Number, default: 0},
    pressure: {type: Number, default: 0},
    piercing: {
        type: Number,
        default: 10,
    },
    quality: {
        xRough: {type: Number, default: 0},
        xRoughPhoto: {type: String, default: ''},
        rough: {type: Number, default: 0},
        roughPhoto: {type: String, default: ''},
        medium: {type: Number, default: 0},
        mediumPhoto: {type: String, default: ''},
        fine: {type: Number, default: 0},
        finePhoto: {type: String, default: ''},
        xFine: {type: Number, default: 0},
        xFinePhoto: {type: String, default: ''},
    }
});

cutOptionsSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'machineId',
        select: '-_id name',
    }).populate({
        path: 'materialId',
        select: '-_id name',
    })
    next();
})

const CutOptions = mongoose.model('CutOptions', cutOptionsSchema);

export default CutOptions;
