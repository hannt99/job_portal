'use client';

import { useState, useEffect } from 'react';
import NotificationCard from './notificationCard';
import { socket } from '@/socket';
import axios from 'axios';
import { IoNotifications } from 'react-icons/io5';

const Notification = () => {
    const [reRender, setReRender] = useState(false);

    const [notiTab, setNotiTab] = useState(false); // true -> not read
    const [notifications, setNotifications] = useState([]);
    const [notReadNoti, setNotReadNoti] = useState([]);
    // Get all notifications from server
    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notification/get-all`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                setNotReadNoti(res?.data?.notRead);
                if (notiTab === false) {
                    return setNotifications(res?.data?.notifications);
                } else {
                    setNotifications(res?.data?.notRead);
                }
            } catch (err) {
                console.log(`fetchNotification error: ${err}`);
                return;
            }
        };
        fetchNotification();
    }, [notiTab, reRender]);

    useEffect(() => {
        socket.on('getNotification', (data) => {
            setReRender(!reRender);
        });
    }, [socket, reRender]);

    const handleChangeNotificationStatus = async (id) => {
        try {
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/notification/change-status/${id}`,
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                },
            );
            return setReRender(!reRender);
        } catch (err) {
            console.log(`handleChangeNotificationStatus error: ${err}`);
            return;
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/notification/delete/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            return setReRender(!reRender);
        } catch (err) {
            console.log(`handleDelete error: ${err}`);
            return;
        }
    };

    return (
        <div className="group relative mr-5 rounded-full bg-[var(--secondary-color)] p-3 text-[2.6rem] text-[var(--primary-color)] cursor-pointer">
            <IoNotifications />
            <span
                className={
                    notReadNoti?.length > 0
                        ? 'block absolute top-0 right-0 min-w-[18px] rounded-full bg-red-600 p-1.5 text-center text-[1rem] font-semibold text-[white] leading-none'
                        : 'hidden'
                }
            >
                {notReadNoti?.length}
            </span>
            <div className="hidden group-hover:block z-[999] absolute top-[100%] right-[-12px] custom-shadow-v1 border rounded-lg bg-white text-black">
                <div className="p-[12px] cursor-default">
                    <h3 className="text-[2.4rem] font-bold">Thông báo</h3>
                    <div className="flex items-center gap-x-3 text-[1.5rem]">
                        <div
                            onClick={() => setNotiTab(false)}
                            className={
                                notiTab === false
                                    ? 'rounded-xl bg-[var(--secondary-color)] hover:bg-[#f1f1f1] p-3 font-semibold text-[var(--primary-color)] cursor-pointer'
                                    : 'rounded-xl                             hover:bg-[#f1f1f1] p-3 font-semibold                             cursor-pointer'
                            }
                        >
                            Tất cả
                        </div>
                        <div
                            onClick={() => setNotiTab(true)}
                            className={
                                notiTab === true
                                    ? 'rounded-xl bg-[var(--secondary-color)] hover:bg-[#f1f1f1] p-3 font-semibold text-[var(--primary-color)] cursor-pointer'
                                    : 'rounded-xl                             hover:bg-[#f1f1f1] p-3 font-semibold                             cursor-pointer'
                            }
                        >
                            Chưa đọc
                        </div>
                    </div>
                </div>
                <ul className="w-[320px] max-h-[300px] overflow-hidden hover:overflow-y-auto">
                    {notifications?.length > 0 ? (
                        notifications
                            ?.sort(function (a, b) {
                                return new Date(b.createdAt) - new Date(a.createdAt);
                            })
                            .map((notification, index) => {
                                return (
                                    <NotificationCard
                                        key={index}
                                        linkTask={notification?.link}
                                        notification={notification?.notification}
                                        createdAt={notification?.createdAt}
                                        isRead={notification.isRead}
                                        handleChangeNotificationStatus={() =>
                                            handleChangeNotificationStatus(notification?._id)
                                        }
                                        handleDelete={() => {
                                            handleDelete(notification?._id);
                                        }}
                                    />
                                );
                            })
                    ) : (
                        <li className="w-full truncate p-[12px] text-center text-[1.3rem] cursor-default">
                            Không có thông báo
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Notification;
