import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CategorySchema = new Schema(
    {
        category: {
            type: String,
            trim: true,
            require: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Category', CategorySchema);
