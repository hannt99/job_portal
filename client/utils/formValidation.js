import isEmpty from 'validator/lib/isEmpty';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';

// Validate email
export const emailValidator = (email, setIsEmailErr, setEmailErrMsg) => {
    const errors = {};
    if (isEmpty(email)) {
        errors.email = 'Email không được để trống';
        setIsEmailErr(true);
    } else if (!isEmail(email)) {
        errors.email = 'Email không hợp lệ';
        setIsEmailErr(true);
    } else {
        setIsEmailErr(false);
    }
    setEmailErrMsg(errors);
    if (Object.keys(errors).length > 0) return false;
    return true;
};

// Validate password
export const passwordValidator = (password, confirmPassword, setIsPasswordErr, setPasswordErrMsg) => {
    const errors = {};
    if (isEmpty(password)) {
        errors.oldPassword = 'Mật khẩu cũ không được để trống';
        errors.newPassword = 'Mật khẩu mới không được để trống';
        errors.password = 'Mật khẩu không được để trống';
        errors.confirmPassword = 'Xác nhận mật khẩu không được để trống';
        setIsPasswordErr(true);
    } else if (password.length < 6) {
        errors.oldPassword = 'Mật khẩu cũ phải có ít nhất 6 kí tự';
        errors.newPassword = 'Mật khẩu mới phải có ít nhất 6 kí tự';
        errors.password = 'Mật khẩu phải có ít nhất 6 kí tự';
        errors.confirmPassword = 'Xác nhận mật khẩu phải có ít nhất 6 kí tự';
        setIsPasswordErr(true);
    } else if (confirmPassword !== password) {
        errors.confirmPassword = 'Xác nhận mật khẩu không trùng khớp';
        setIsPasswordErr(true);
    } else {
        setIsPasswordErr(false);
    }
    setPasswordErrMsg(errors);
    if (Object.keys(errors).length > 0) return false;
    return true;
};

// Validate name
export const fullNameValidator = (fullName, setIsFullNameErr, setFullNameErrMsg) => {
    const errors = {};
    if (isEmpty(fullName)) {
        errors.fullName = 'Tên không được để trống';
        errors.companyName = 'Tên công ty không được để trống';
        errors.jobTitle = 'Tên công việc không được để trống';
        errors.jobDesc = 'Mô tả công việc không được để trống';
        setIsFullNameErr(true);
    } else {
        setIsFullNameErr(false);
    }
    setFullNameErrMsg(errors);
    if (Object.keys(errors).length > 0) return false;
    return true;
};

// isMobilePhone function or similar generic validators may not handle Vietnamese landline numbers correctly due to their specific format and rules.
// Therefore, I implementing custom validation logic tailored to Vietnamese landline numbers.
const isValidVietnamLandline = (number) => {
    // Example regex for Vietnamese landline numbers
    const regex = /^0\d{2,3}\d{6,7}$/;
    return regex.test(number);
};

// Validate phone
export const phoneValidator = (phone, setIsPhoneErr, setPhoneErrMsg) => {
    const errors = {};
    if (isEmpty(phone)) {
        errors.phone = 'Số điện thoại không được để trống';
        setIsPhoneErr(true);
    } else if (!isMobilePhone(phone, 'vi-VN')) {
        if (isValidVietnamLandline(phone)) {
            setIsPhoneErr(false);
        } else {
            errors.phone = 'Số điện thoại không hợp lệ';
            setIsPhoneErr(true);
        }
    }
    setPhoneErrMsg(errors);
    if (Object.keys(errors).length > 0) return false;
    return true;
};

// Validate number
export const numberValidatorFrom = (from, setIsNumberErr, setNumberErrMsg) => {
    const errors = {};
    if (isEmpty(String(from))) {
        errors.number = 'Số không được để trống';
        setIsNumberErr(true);
    } else if (!/^[1-9]\d*$/.test(from)) {
        // Ensure that the input starts with a digit from 1 to 9
        errors.number = 'Số không hợp lệ';
        setIsNumberErr(true);
    } else if (from <= 0 || from > 19999) {
        errors.number = 'Số không hợp lệ';
        setIsNumberErr(true);
    } else {
        setIsNumberErr(false);
    }
    setNumberErrMsg(errors);
    if (Object.keys(errors).length > 0) return false;
    return true;
};

export const numberValidatorTo = (to, from, setIsNumberErr, setNumberErrMsg) => {
    const errors = {};
    if (isEmpty(String(to))) {
        errors.number = 'Số không được để trống';
        setIsNumberErr(true);
    } else if (!/^[1-9]\d*$/.test(from)) {
        // Ensure that the input starts with a digit from 1 to 9
        errors.number = 'Số không hợp lệ';
        setIsNumberErr(true);
    } else if (to <= 0 || to > 19999) {
        errors.number = 'Số không hợp lệ';
        setIsNumberErr(true);
    } else if (to <= from) {
        errors.number = 'Số sau phải lớn';
        setIsNumberErr(true);
    } else {
        setIsNumberErr(false);
    }
    setNumberErrMsg(errors);
    if (Object.keys(errors).length > 0) return false;
    return true;
};

// Validate date
export const disabledPastDate = () => {
    let today, dd, mm, yyyy, hh, minu;
    today = new Date();
    dd = ('0' + today.getDate()).slice(-2);
    mm = ('0' + (today.getMonth() + 1)).slice(-2);
    yyyy = today.getFullYear();
    hh = ('0' + today.getHours()).slice(-2);
    minu = ('0' + today.getMinutes()).slice(-2);
    return yyyy + '-' + mm + '-' + dd + 'T' + hh + ':' + minu;
};

export const dateValidator = (date, setIsDateErr, setDateErrMsg) => {
    const errors = {};
    if (isEmpty(date)) {
        errors.jobDeadline = 'Ngày hết hạn không được để trống';
        setIsDateErr(true);
    } else {
        setIsDateErr(false);
    }
    setDateErrMsg(errors);
    if (Object.keys(errors).length > 0) return false;
    return true;
};

export const dropListValidator = (value, setIsDropListErr, setDropListErrMsg) => {
    const errors = {};
    if (!value || value.length === 0) {
        errors.gender = 'Giới tính không được để trống';
        errors.position = 'Chức vụ không được để trống';
        errors.province = 'Tỉnh/thành không được để trống';

        errors.jobPosition = 'Vị trí công việc không được để trống';
        errors.jobCareer = 'Ngành nghề không được để trống';
        errors.jobSkill = 'Kỹ năng không được để trống';
        errors.jobExp = 'Kinh nghiệm không được để trống';
        errors.jobSalaryRange = 'Mức lương không được để trống';
        errors.jobLocation = 'Địa điểm làm việc không được để trống';

        errors.jobType = 'Hình thức không được để trống';
        setIsDropListErr(true);
    } else {
        setIsDropListErr(false);
    }
    setDropListErrMsg(errors);
    if (Object.keys(errors).length > 0) return false;
    return true;
};
