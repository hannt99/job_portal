export const checkDatetime = (nowDate, newDate) => {
    if (nowDate < Date.parse(newDate)) {
        return 'Đang tuyển';
    } else {
        return 'Hết hạn nộp';
    }
};
