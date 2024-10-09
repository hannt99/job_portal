import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ResumeSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        jobPosition: {
            type: String,
            trim: true,
            require: true,
            default: '',
        },
        careers: {
            type: Array,
            trim: true,
            require: true,
            default: [],
        },
        skills: {
            type: Array,
            trim: true,
            require: true,
            default: [],
        },
        experience: {
            type: String,
            trim: true,
            require: true,
            default: '',
        },
        salaryRange: {
            type: String,
            trim: true,
            require: true,
            default: '',
        },
        workingLocation: {
            type: Array,
            trim: true,
            require: true,
            default: [],
        },
        cv: {
            type: Array,
            trim: true,
            default: [],
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Resume', ResumeSchema);
