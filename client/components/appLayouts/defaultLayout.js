'use client';

import { useState, useEffect, createContext } from 'react';
import { usePathname } from 'next/navigation';

import Header from '@/components/appLayouts/header';
import HeaderXSidebar from './headerXSidebar';
import Footer from '@/components/appLayouts/footer';
import Sidebar from './sidebar';

import { FaBars } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';

import TimeAgo from 'javascript-time-ago';
import vi from 'javascript-time-ago/locale/vi';
TimeAgo.addDefaultLocale(vi);

import { socket } from '@/socket';

export const UserAvatarContext = createContext();

const DefaultLayout = ({ main }) => {
    const pathname = usePathname();
    const doesAccessAuthPath = () => {
        return (
            pathname?.includes('/signin') ||
            pathname?.includes('/register') ||
            pathname?.includes('/forgot-password') ||
            pathname?.includes('/reset-password')
        );
    };

    const userId = typeof window !== 'undefined' && localStorage.getItem('userId');
    // Socket
    useEffect(() => {
        socket.emit('addUser', userId);
    }, [userId]);

    const [isChangeUserAvatar, setIsChangeUserAvatar] = useState(false);

    const [toggleSidebar, setToggleSidebar] = useState(false);
    const toggle = () => {
        setToggleSidebar(!toggleSidebar);
    };

    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const scrollPage = () => {
            const windowHeight = window.scrollY;
            if (windowHeight > 60) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', scrollPage);

        return () => window.removeEventListener('scroll', scrollPage);
    }, []);

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);
    if (loading) return <div className="h-screen"></div>;
    return (
        <UserAvatarContext.Provider value={{ isChangeUserAvatar, setIsChangeUserAvatar }}>
            {doesAccessAuthPath() ? (
                <div className="relative w-full h-screen overflow-auto bg-multiply flex">
                    <div className="py-5 m-auto">{main}</div>
                    <div className="fixed top-0 left-0 bottom-0 right-0 bg-gradient-to-b from-[#161c2d]/5 to-[#161c2d]/100"></div>
                </div>
            ) : pathname?.includes('/employer') || pathname?.includes('/admin') ? (
                <>
                    <div
                        className={
                            toggleSidebar
                                ? 'fuck fixed top-0 left-0 bottom-0 translate-x-0       lg:translate-x-0 z-50 w-full md:w-[260px] bg-white transition-all'
                                : 'fuck fixed top-0 left-0 bottom-0 translate-x-[-100%] lg:translate-x-0 z-50 w-full md:w-[260px] bg-white transition-all'
                        }
                    >
                        <Sidebar setToggleSidebar={setToggleSidebar} />
                        <div
                            onClick={() => setToggleSidebar(false)}
                            className="absolute top-0 right-0 w-[42px] h-[42px] lg:hidden flex items-center justify-center text-[24px] cursor-pointer"
                        >
                            <FaXmark />
                        </div>
                    </div>
                    <div className="fixed top-0 left-0 lg:left-[260px] right-0 h-[60px] z-40 lg:z-50">
                        <HeaderXSidebar />
                        <div
                            onClick={toggle}
                            className="absolute top-[50%] translate-y-[-50%] left-[12px] flex w-[42px] h-[42px] lg:hidden items-center justify-center text-[18px] cursor-pointer"
                        >
                            <FaBars />
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 pl-0 lg:pl-[260px] pt-[60px] w-full min-h-screen bg-[#f4f6fb]">
                        {main}
                    </div>
                </>
            ) : (
                // root ({root}/), company ({root}/company/...), job ({root}/job/...), account ({root}/account/...)
                <div className="flex flex-col h-screen">
                    <div
                        className={`shadow-md ${pathname === '/' ? 'bg-[white]' : 'bg-white'} ${
                            scrolled ? 'fixed top-0 left-0 right-0 z-[999] bg-white animate-fadeIn' : ''
                        } flex justify-center`}
                    >
                        <Header />
                    </div>
                    <div className="bg-[#f4f6fb] flex flex-col flex-1 items-center">{main}</div>
                    <div className="flex justify-center">
                        <Footer />
                    </div>
                </div>
            )}
        </UserAvatarContext.Provider>
    );
};

export default DefaultLayout;
