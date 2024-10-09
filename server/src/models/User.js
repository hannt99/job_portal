import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        fullName: {
            type: String,
            trim: true,
            default: '',
        },
        gender: {
            type: String,
            trim: true,
            default: 'Nam',
        },
        birthDate: {
            type: String,
            trim: true,
            default: '',
        },
        avatar: {
            type: String,
            trim: true,
            default:
                'https://png.pngtree.com/png-vector/20220608/ourmid/pngtree-man-avatar-isolated-on-white-background-png-image_4891418.png',
        },
        phone: {
            type: String,
            trim: true,
            default: '',
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            trim: true,
            required: true,
        },
        role: {
            type: Number,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        isAppeared: {
            // whether a user appears in candidate suggestions for employers, isProfileVisible
            type: Boolean,
            default: false,
        },
        isSeeking: {
            // whether the user is actively seeking a job, isSeekingJob
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('User', UserSchema);
