import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const JobSaveSchema = new Schema(
    {
        userId: {
            type: String,
            trim: true,
            require: true,
        },
        totalJobs: [
            {
                jobId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Job',
                },
                saveTime: String,
            },
        ],
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('JobSave', JobSaveSchema);
