import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SkillSchema = new Schema(
    {
        skill: {
            type: String,
            trim: true,
            require: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Skill', SkillSchema);
