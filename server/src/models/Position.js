import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PositionSchema = new Schema(
    {
        position: {
            type: String,
            trim: true,
            require: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Position', PositionSchema);
