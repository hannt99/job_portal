import Notification from '../models/Notification.js';

// Controller to get all notifications
export const getAllNotificationController = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ receiverId: userId }).sort({ createdAt: -1 });
        const notRead = await Notification.find({ receiverId: userId, isRead: false }).sort({ createdAt: -1 });

        res.status(200).json({ code: 200, notifications, notRead });
    } catch (err) {
        console.error(`getAllNotificationController error: ${err}`);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

// Controller to change notification status
export const changeNotificationStatusController = async (req, res) => {
    try {
        const notificationId = req.params.notificationId;

        const notification = await Notification.findById(notificationId);
        if (!notification) return res.status(404).json({ code: 404, message: 'Not found' });

        await Notification.findByIdAndUpdate(notificationId, { isRead: true });

        res.status(200).json({ code: 200, message: 'Success' });
    } catch (err) {
        console.error(`Error in changeNotificationStatusController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

// Controller to delete notification
export const deleteNotificationController = async (req, res) => {
    try {
        const notificationId = req.params.notificationId;

        const notification = await Notification.findById(notificationId);
        if (!notification) return res.status(404).json({ code: 404, message: 'Không tìm thấy thông báo' });

        await Notification.findByIdAndDelete(notificationId);

        res.status(200).json({ code: 200, message: 'Đã xóa thành công thông báo' });
    } catch (err) {
        console.error(`Error in deleteNotificationController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};
