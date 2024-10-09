import TimeAgo from 'javascript-time-ago';

import vi from 'javascript-time-ago/locale/vi';
import it from 'javascript-time-ago/locale/it';

TimeAgo.addLocale(vi);
TimeAgo.addLocale(it);

export const formatVNDate = (dateToFormat) => {
    const date = new Date(dateToFormat || null);
    let intl = new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'full',
    });
    const formatedDate = intl.format(date);
    return formatedDate;
};

export const formatVNDateTime = (dateTimeToFormat) => {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
    };
    const date = new Date(dateTimeToFormat || null);
    let intl = new Intl.DateTimeFormat('it-IT', options);
    const formatedDate = intl.format(date);
    return formatedDate;
};

export const formatVNTimeAgo = (timeToFormat) => {
    const timeAgo = new TimeAgo('vi-VN');
    
    const time = new Date(timeToFormat || null);
    const formattedTime = timeAgo.format(time);
    return formattedTime;
};
