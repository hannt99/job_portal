import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
    {
        notification: {
            type: String,
            trim: true,
        },
        receiverId: {
            type: String,
            trim: true,
        },
        link: {
            type: String,
            trim: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Notification', NotificationSchema);
