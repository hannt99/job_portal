import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CompanySchema = new Schema(
    {
        userId: {
            type: String,
            trim: true,
            require: true,
        },
        companyName: {
            type: String,
            trim: true,
            require: true,
            unique: true,
        },
        companyEmail: {
            type: String,
            trim: true,
            default: '',
        },
        companyPhone: {
            type: String,
            trim: true,
            default: '',
        },
        companyAddress: {
            type: Object,
            trim: true,
            require: true,
        },
        companySize: {
            type: Object,
            require: true,
        },
        companyCareer: {
            type: String,
            trim: true,
            default: '',
        },
        position: {
            type: String,
            trim: true,
            require: true,
        },
        introduction: {
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
        website: {
            type: String,
            trim: true,
            default: '',
        },
        followers: {
            type: Array,
            trim: true,
            default: [],
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Company', CompanySchema);
