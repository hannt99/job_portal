import User from '../models/User.js';
import Resume from '../models/Resume.js';
import Company from '../models/Company.js';
import JobSave from '../models/JobSave.js';
import Notification from '../models/Notification.js';
import { generateVerifyEmailToken, generateAccessToken, generateResetPasswordToken } from '../utils/tokenGenerator.js';
import bcrypt from 'bcryptjs';
import sendMail from '../utils/email.js';
import jwt from 'jsonwebtoken';

/**
 * Controller to sign in
 * */
export const signInController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !user.isActive) {
            return res.status(404).json({ code: 404, message: 'Tài khoản không tồn tại hoặc chưa được xác thực' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ code: 400, message: 'Email hoặc mật khẩu không chính xác' });
        }

        const accessToken = generateAccessToken(user);

        res.cookie('testToken', '123456BlaBla', {
            expires: new Date(Date.now() + 24 * 3600000),
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        res.cookie('accessToken', accessToken, {
            expires: new Date(Date.now() + 24 * 3600000),
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        return res.status(200).json({
            code: 200,
            message: 'Đăng nhập thành công',
            accessToken,
        });
    } catch (err) {
        console.error(`signInController error: ${err}`);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to register
 * */
export const registerController = async (req, res) => {
    try {
        const { email, password, role, companyName } = req.body;

        // Validate email format
        // const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // for Gmail only
        const emailRegex = /^[^@\s]+@([^@\s])+$/; // for All
        if (!emailRegex.test(email)) {
            return res.status(403).json({ code: 403, message: 'Email không hợp lệ' });
        }

        // Check if email is already used
        const isEmailExist = await User.findOne({ email });
        if (isEmailExist) {
            return res.status(403).json({ code: 403, message: 'Email đã được sử dụng' });
        }

        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create and save new user
        const newUser = new User({ ...req.body, password: hashedPassword });
        await newUser.save();

        // Create and save new resume
        const newResume = new Resume({ ...req.body, userId: newUser._id });
        await newResume.save();

        // Create and save new job save
        const newJobSave = new JobSave({ ...req.body, userId: newUser._id });
        await newJobSave.save();

        // If the user is a company representative, create a new company
        if (role === 0) {
            const existingCompany = await Company.findOne({ companyName });
            if (existingCompany) {
                await User.findByIdAndDelete(newUser._id);
                await Resume.findOneAndDelete({ userId: newUser._id });
                return res.status(403).json({ code: 403, message: 'Tên công ty đã được sử dụng' });
            }
            const newCompany = new Company({ ...req.body, userId: newUser._id });
            await newCompany.save();
        }

        // Send verification email
        const subject = 'TimViecNhanh - Xác thực tài khoản người dùng';
        const token = generateVerifyEmailToken(newUser);
        const verificationUrl = `${process.env.BASE_URL}/api/v1/auth/verify-account?token=${token}`;
        const supportUrl = `${process.env.REACT_APP_BASE_URL}/`;
        // const html = `<p>Hãy nhấn vào <a href="${verificationUrl}">liên kết</a> để xác thực tài khoản của bạn</p>
        //               <p>Thời gian hiệu lực trong vòng 24 giờ</p>`;

        let linkVerificationHtml_1 = `<a href="${verificationUrl}" style="display:inline-block;margin:0;border-radius:5px;background:#059669;padding:10px 14px;font-family:Arial,Helvetica,sans-serif;color:#ffffff;font-size:14px;font-weight:normal;line-height:100%;text-decoration:none;text-transform:none" target="_blank"> Xác minh email </a>`;
        let linkVerificationHtml_2 = `<a href="${verificationUrl}" target="_blank">${verificationUrl}</a>`;
        let linkSupportHtml = `<a href="${supportUrl}" style="color:#0076a8;text-decoration:none;" target="_blank">hãy liên hệ hỗ trợ ngay</a>`;
        let linkHomeHtml = `<a href="${process.env.REACT_APP_BASE_URL}/" style="color:#0076a8;text-decoration:none" target="_blank">TimViecNhanh</a>`;

        const html = `<div style="background-color:#ffffff">
            <div style="margin:0px auto;max-width:600px">
                <table style="width:100%" border="0" cellspacing="0" cellpadding="0" align="center" role="presentation">
                    <tbody>
                        <tr>
                            <td style="padding:0px 5px;padding-left:5px;padding-right:5px;text-align:center;direction:ltr;font-size:0px">
                                <div style="display:inline-block;width:100%;vertical-align:top;direction:ltr;text-align:left;font-size:0px">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                        <tbody>
                                            <tr>
                                                <td style="vertical-align:top;padding-right:0px;padding-left:0px">
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                                        <tbody>
                                                            <tr>
                                                                <td align="left" style="padding:10px 25px;padding-bottom:0px;padding-left:0px;padding-right:0px;font-size:0px;word-break:break-word">
                                                                    <table border="0" style="border-collapse:collapse;border-spacing:0px" cellspacing="0" cellpadding="0" role="presentation" >
                                                                        <tbody>
                                                                            <tr>
                                                                                <td style="width:167px">
                                                                                    <img width="167" height="auto" style="display:block;outline:none;width:100%;height:auto;border:0;text-decoration:none;font-size:14px" src="https://raw.githubusercontent.com/hannt99/job-seeking/main/client/public/assets/images/logo.png" data-bit="iit">
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="margin:0px auto;max-width:600px">
                <table style="width:100%" border="0" cellspacing="0" cellpadding="0" align="center" role="presentation">
                    <tbody>
                        <tr>
                            <td style="padding:0px;padding-left:0px;padding-right:0px;direction:ltr;text-align:center;font-size:0px">
                                <div style="display:inline-block;width:100%;vertical-align:top;direction:ltr;text-align:left;font-size:0px">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                        <tbody>
                                            <tr>
                                                <td style="padding-left:0px;padding-right:0px;vertical-align:top">
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                                        <tbody>
                                                            <tr>
                                                                <td style="padding:10px 25px;padding-right:0px;padding-left:0px;font-size:0px;word-break:break-word">
                                                                    <p style="margin:0px auto;margin-bottom:18px;width:100%;border-top:solid 5px #059669;font-size:1px;line-height:1.4">
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="margin:0px auto;max-width:600px">
                <table style="width:100%" border="0" cellspacing="0" cellpadding="0" align="center" role="presentation">
                    <tbody>
                        <tr>
                            <td style="padding:0px 5px;padding-left:5px;padding-right:5px;text-align:center;direction:ltr;font-size:0px">
                                <div style="display:inline-block;width:100%;vertical-align:top;text-align:left;direction:ltr;font-size:0px;">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                        <tbody>
                                            <tr>
                                                <td style="vertical-align:top;padding-right:0px;padding-left:0px">
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                                        <tbody>
                                                            <tr>
                                                                <td align="left" style="padding:10px 25px;padding-top:0px;padding-left:0px;padding-right:0px;font-size:0px;word-break:break-word">
                                                                    <div style="font-family:Arial,Helvetica,sans-serif;text-align:left;color:#3c3c3c;font-size:14px;line-height:140%">
                                                                        <h2>Chào mừng bạn đến với TimViecNhanh!</h2>
                                                                        <p style="margin-bottom:18px;line-height:1.4">Để hoàn tất việc thiết lập Tài khoản TimViecNhanh của bạn, hãy nhấp vào <strong>Xác minh email</strong>.</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="left" style="padding:10px 25px;padding-top:0;padding-bottom:0px;padding-left:0px;padding-right:0px;font-size:0px;word-break:break-word">
                                                                    <table style="border-collapse:separate;line-height:100%" border="0" cellspacing="0" cellpadding="0" role="presentation" >
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center" valign="middle" style="border:none;border-radius:5px;background:#059669" bgcolor="#059669" role="presentation" >
                                                                                    ${linkVerificationHtml_1}
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="left" style="padding:10px 25px;padding-left:0px;padding-right:0px;padding-bottom:0px;font-size:0px;word-break:break-word">
                                                                    <div style="text-align:left;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:140%;color:#3c3c3c">
                                                                        <p style="margin-bottom:18px;line-height:1.4"> Hoặc cũng có thể xác minh email của bạn bằng cách hãy sao chép và dán liên kết sau vào trình duyệt của bạn: </p>
                                                                        <p style="margin-bottom:18px;line-height:1.4">
                                                                            ${linkVerificationHtml_2}
                                                                        </p>
                                                                        <p style="margin-bottom:18px;line-height:1.4">Nếu bạn không tạo tài khoản này, ${linkSupportHtml}.</p>
                                                                        <p style="margin-bottom:18px;line-height:1.4"> Đội ngũ hỗ trợ khách hàng của TimViecNhanh </p>
                                                                        <p style="margin-bottom:18px;font-size:85%;line-height:1.4;font-style:italic;"> Đây là email được tạo tự động, vui lòng không trả lời email này! </p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="margin:0px auto;max-width:600px">
                <table style="width:100%" border="0" cellspacing="0" cellpadding="0" align="center" role="presentation">
                    <tbody>
                        <tr>
                            <td style="padding:0px;padding-left:0px;padding-right:0px;direction:ltr;text-align:center;font-size:0px;">
                                <div style="display:inline-block;width:100%;vertical-align:top;direction:ltr;text-align:left;font-size:0px">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                        <tbody>
                                            <tr>
                                                <td style="padding-left:0px;padding-right:0px;vertical-align:top">
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                                        <tbody>
                                                            <tr>
                                                                <td style="padding:10px 25px;padding-left:0px;padding-right:0px;font-size:0px;word-break:break-word">
                                                                    <p style="margin:0px auto;margin-bottom:18px;width:100%;border-top:solid 1px #cccccc;font-size:1px;line-height:1.4">
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="margin:0px auto;max-width:600px">
                <table style="width:100%" border="0" cellspacing="0" cellpadding="0" align="center" role="presentation">
                    <tbody>
                        <tr>
                            <td style="padding:0px 5px;padding-left:5px;padding-right:5px;direction:ltr;text-align:center;font-size:0px">
                                <div style="display:inline-block;width:100%;vertical-align:top;direction:ltr;text-align:left;font-size:0px">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                        <tbody>
                                            <tr>
                                                <td style="padding-right:0px;padding-left:0px;vertical-align:top">
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                                        <tbody>
                                                            <tr>
                                                                <td style="padding:10px 25px;padding-left:0px;padding-right:0px;font-size:0px;word-break:break-word" align="left">
                                                                    <div style="text-align:left;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:140%;color:#7f7f7f">
                                                                        &copy; 2024 
                                                                        ${linkHomeHtml}
                                                                        | Ho Chi Minh City, VietNam 
                                                                        <u></u>
                                                                        <u></u> 
                                                                        | <span style="white-space:nowrap">+84 123-456-789</span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>;`;

        // sendMail(newUser.email, subject, html);

        // Notify admin of new user registration
        const admin = await User.findOne({ role: 2 });
        if (admin) {
            const newNotification = new Notification({
                notification: 'Hệ thống có người dùng mới',
                receiverId: admin._id,
                link: `${process.env.REACT_APP_BASE_URL}/admin/user-manage`,
                isRead: false,
            });
            await newNotification.save();
        }

        return res.status(200).json({ code: 200, message: 'Vui lòng kiểm tra email', adminId: admin?._id });
    } catch (err) {
        console.error(`registerController error: ${err}`);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to verify account
 * */
export const verifyAccountController = async (req, res) => {
    try {
        const { token } = req.query;

        jwt.verify(token, process.env.VERIFY_EMAIL_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ code: 403, message: 'Mã xác thực không hợp lệ hoặc đã hết hạn' });
            }

            await User.updateOne({ _id: decoded._id }, { $set: { isActive: true } });

            const signInUrl = `${process.env.REACT_APP_BASE_URL}/signin`;
            const supportUrl = `${process.env.REACT_APP_BASE_URL}/`;

            let linkLoginHtml = `<a href="${signInUrl}" style="display:inline-block;margin:0;font-family:Arial,Helvetica,sans-serif;color:#059669;font-size:14px;font-weight:bold;line-height:100%;text-decoration:none;text-transform:none" target="_blank"> Đăng nhập </a>`;
            let linkHomeHtml = `<a href="${process.env.REACT_APP_BASE_URL}/" style="color:#0076a8;text-decoration:none" target="_blank">TimViecNhanh</a>`;

            const html = `<div style="background-color:#ffffff">
                <div style="margin:0px auto;max-width:600px">
                <table style="width:100%" border="0" cellspacing="0" cellpadding="0" align="center" role="presentation">
                    <tbody>
                        <tr>
                            <td style="padding:0px 5px;padding-left:5px;padding-right:5px;text-align:center;direction:ltr;font-size:0px">
                                <div style="display:inline-block;width:100%;vertical-align:top;direction:ltr;text-align:left;font-size:0px">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                        <tbody>
                                            <tr>
                                                <td style="vertical-align:top;padding-right:0px;padding-left:0px">
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                                        <tbody>
                                                            <tr>
                                                                <td align="left" style="padding:10px 25px;padding-bottom:0px;padding-left:0px;padding-right:0px;font-size:0px;word-break:break-word">
                                                                    <table border="0" style="border-collapse:collapse;border-spacing:0px" cellspacing="0" cellpadding="0" role="presentation" >
                                                                        <tbody>
                                                                            <tr>
                                                                                <td style="width:167px">
                                                                                    <img width="167" height="auto" style="display:block;outline:none;width:100%;height:auto;border:0;text-decoration:none;font-size:14px" src="https://raw.githubusercontent.com/hannt99/job-seeking/main/client/public/assets/images/logo.png" data-bit="iit">
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>

                <div style="margin:0px auto;max-width:600px">
                    <table style="width:100%" border="0" cellspacing="0" cellpadding="0" align="center" role="presentation">
                        <tbody>
                            <tr>
                                <td style="padding:0px;padding-left:0px;padding-right:0px;direction:ltr;text-align:center;font-size:0px">
                                    <div style="display:inline-block;width:100%;vertical-align:top;direction:ltr;text-align:left;font-size:0px">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                            <tbody>
                                                <tr>
                                                    <td style="padding-left:0px;padding-right:0px;vertical-align:top">
                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="padding:10px 25px;padding-right:0px;padding-left:0px;font-size:0px;word-break:break-word">
                                                                        <p style="margin:0px auto;margin-bottom:18px;width:100%;border-top:solid 5px #059669;font-size:1px;line-height:1.4">
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="margin:0px auto;max-width:600px">
                    <table style="width:100%" border="0" cellspacing="0" cellpadding="0" align="center" role="presentation">
                        <tbody>
                            <tr>
                                <td style="padding:0px 5px;padding-left:5px;padding-right:5px;text-align:center;direction:ltr;font-size:0px">
                                    <div style="display:inline-block;width:100%;vertical-align:top;text-align:left;direction:ltr;font-size:0px;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                            <tbody>
                                                <tr>
                                                    <td style="vertical-align:top;padding-right:0px;padding-left:0px">
                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                                            <tbody>
                                                                <tr>
                                                                    <td align="left" style="padding:10px 25px;padding-top:0px;padding-left:0px;padding-right:0px;font-size:0px;word-break:break-word">
                                                                        <div style="font-family:Arial,Helvetica,sans-serif;text-align:left;color:#3c3c3c;font-size:14px;line-height:140%">
                                                                            <h2>Xác thực tài khoản TimViecNhanh thành công!</h2>
                                                                            <p style="margin-bottom:18px;line-height:1.4">Chuyển đến trang ${linkLoginHtml}</p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="left" style="padding:10px 25px;padding-left:0px;padding-right:0px;padding-bottom:0px;font-size:0px;word-break:break-word">
                                                                        <div style="text-align:left;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:140%;color:#3c3c3c">
                                                                            <p style="margin-bottom:18px;font-size:85%;line-height:1.4;font-style:italic;"> Đây là email được tạo tự động, vui lòng không trả lời email này! </p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="margin:0px auto;max-width:600px">
                    <table style="width:100%" border="0" cellspacing="0" cellpadding="0" align="center" role="presentation">
                        <tbody>
                            <tr>
                                <td style="padding:0px;padding-left:0px;padding-right:0px;direction:ltr;text-align:center;font-size:0px;">
                                    <div style="display:inline-block;width:100%;vertical-align:top;direction:ltr;text-align:left;font-size:0px">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                            <tbody>
                                                <tr>
                                                    <td style="padding-left:0px;padding-right:0px;vertical-align:top">
                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="padding:10px 25px;padding-left:0px;padding-right:0px;font-size:0px;word-break:break-word">
                                                                        <p style="margin:0px auto;margin-bottom:18px;width:100%;border-top:solid 1px #cccccc;font-size:1px;line-height:1.4">
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="margin:0px auto;max-width:600px">
                    <table style="width:100%" border="0" cellspacing="0" cellpadding="0" align="center" role="presentation">
                        <tbody>
                            <tr>
                                <td style="padding:0px 5px;padding-left:5px;padding-right:5px;direction:ltr;text-align:center;font-size:0px">
                                    <div style="display:inline-block;width:100%;vertical-align:top;direction:ltr;text-align:left;font-size:0px">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                            <tbody>
                                                <tr>
                                                    <td style="padding-right:0px;padding-left:0px;vertical-align:top">
                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="padding:10px 25px;padding-left:0px;padding-right:0px;font-size:0px;word-break:break-word" align="left">
                                                                        <div style="text-align:left;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:140%;color:#7f7f7f">
                                                                            &copy; 2024 
                                                                            ${linkHomeHtml}
                                                                            | Ho Chi Minh City, VietNam 
                                                                            <u></u>
                                                                            <u></u> 
                                                                            | <span style="white-space:nowrap">+84 123-456-789</span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>;`;

            return res.status(200).format({
                'text/html': () => {
                    res.send(html);
                },
            });
        });
    } catch (err) {
        console.error(`verifyAccountController error: ${err}`);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

// Controller to forgot password
export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email exists
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(404).json({ code: 404, message: 'Email không tồn tại' });
        }

        // Generate reset password token and send email
        const subject = 'TimViecNhanh - Đặt lại mật khẩu';

        const token = generateResetPasswordToken(userData);
        // ================
        const resetPasswordUrl = `${process.env.REACT_APP_BASE_URL}/reset-password?token=${token}`;
        const supportUrl = `${process.env.REACT_APP_BASE_URL}/`;

        let linkResetPasswordHtml_1 = `<a href="${resetPasswordUrl}" style="display:inline-block;margin:0;border-radius:5px;background:#059669;padding:10px 14px;font-family:Arial,Helvetica,sans-serif;color:#ffffff;font-size:14px;font-weight:normal;line-height:100%;text-decoration:none;text-transform:none" target="_blank"> Đặt lại mật khẩu </a>`;
        let linkResetPasswordHtml_2 = `<a href="${resetPasswordUrl}" target="_blank">${resetPasswordUrl}</a>`;
        let linkSupportHtml = `<a href="${supportUrl}" style="color:#0076a8;text-decoration:none;" target="_blank">hãy liên hệ hỗ trợ ngay</a>`;
        let linkHomeHtml = `<a href="${process.env.REACT_APP_BASE_URL}/" style="color:#0076a8;text-decoration:none" target="_blank">TimViecNhanh</a>`;

        // const html = `<p>Xin chào ${userData.email}, Hãy nhấn vào <a href="${resetUrl}">liên kết</a> này và đặt lại mật khẩu của bạn</p>
        //               <p>Thời gian hiệu lực trong vòng 10 phút</p>`;
        const html = `<div style="background-color:#ffffff">
            <div style="margin:0px auto;max-width:600px">
                <table style="width:100%" border="0" cellspacing="0" cellpadding="0" align="center" role="presentation">
                    <tbody>
                        <tr>
                            <td style="padding:0px 5px;padding-left:5px;padding-right:5px;text-align:center;direction:ltr;font-size:0px">
                                <div style="display:inline-block;width:100%;vertical-align:top;direction:ltr;text-align:left;font-size:0px">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                        <tbody>
                                            <tr>
                                                <td style="vertical-align:top;padding-right:0px;padding-left:0px">
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                                        <tbody>
                                                            <tr>
                                                                <td align="left" style="padding:10px 25px;padding-bottom:0px;padding-left:0px;padding-right:0px;font-size:0px;word-break:break-word">
                                                                    <table border="0" style="border-collapse:collapse;border-spacing:0px" cellspacing="0" cellpadding="0" role="presentation" >
                                                                        <tbody>
                                                                            <tr>
                                                                                <td style="width:167px">
                                                                                    <img width="167" height="auto" style="display:block;outline:none;width:100%;height:auto;border:0;text-decoration:none;font-size:14px" src="https://raw.githubusercontent.com/hannt99/job-seeking/main/client/public/assets/images/logo.png" data-bit="iit">
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="margin:0px auto;max-width:600px">
                <table style="width:100%" border="0" cellspacing="0" cellpadding="0" align="center" role="presentation">
                    <tbody>
                        <tr>
                            <td style="padding:0px;padding-left:0px;padding-right:0px;direction:ltr;text-align:center;font-size:0px">
                                <div style="display:inline-block;width:100%;vertical-align:top;direction:ltr;text-align:left;font-size:0px">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                        <tbody>
                                            <tr>
                                                <td style="padding-left:0px;padding-right:0px;vertical-align:top">
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                                        <tbody>
                                                            <tr>
                                                                <td style="padding:10px 25px;padding-right:0px;padding-left:0px;font-size:0px;word-break:break-word">
                                                                    <p style="margin:0px auto;margin-bottom:18px;width:100%;border-top:solid 5px #059669;font-size:1px;line-height:1.4">
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="margin:0px auto;max-width:600px">
                <table style="width:100%" border="0" cellspacing="0" cellpadding="0" align="center" role="presentation">
                    <tbody>
                        <tr>
                            <td style="padding:0px 5px;padding-left:5px;padding-right:5px;text-align:center;direction:ltr;font-size:0px">
                                <div style="display:inline-block;width:100%;vertical-align:top;text-align:left;direction:ltr;font-size:0px;">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                        <tbody>
                                            <tr>
                                                <td style="vertical-align:top;padding-right:0px;padding-left:0px">
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                                        <tbody>
                                                            <tr>
                                                                <td align="left" style="padding:10px 25px;padding-top:0px;padding-left:0px;padding-right:0px;font-size:0px;word-break:break-word">
                                                                    <div style="font-family:Arial,Helvetica,sans-serif;text-align:left;color:#3c3c3c;font-size:14px;line-height:140%">
                                                                        <h2>Xin chào ${userData.fullName}</h2>
                                                                        <p style="margin-bottom:18px;color:black;line-height:1.4">Để hoàn tất việc đặt lại Mật khẩu TimViecNhanh của bạn, hãy nhấp vào <strong>Đặt lại mật khẩu</strong>.</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="left" style="padding:10px 25px;padding-top:0;padding-bottom:0px;padding-left:0px;padding-right:0px;font-size:0px;word-break:break-word">
                                                                    <table style="border-collapse:separate;line-height:100%" border="0" cellspacing="0" cellpadding="0" role="presentation" >
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center" valign="middle" style="border:none;border-radius:5px;background:#059669" bgcolor="#059669" role="presentation" >
                                                                                    ${linkResetPasswordHtml_1}
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="left" style="padding:10px 25px;padding-left:0px;padding-right:0px;padding-bottom:0px;font-size:0px;word-break:break-word">
                                                                    <div style="text-align:left;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:140%;color:#3c3c3c">
                                                                        <p style="margin-bottom:18px;line-height:1.4"> Hoặc cũng có thể đặt lại mật khẩu của bạn bằng cách sao chép và dán liên kết sau vào trình duyệt của bạn: </p>
                                                                        <p style="margin-bottom:18px;line-height:1.4">
                                                                            ${linkResetPasswordHtml_2}
                                                                        </p>
                                                                        <p style="margin-bottom:18px;line-height:1.4">Nếu bạn không thực hiện hành động này, ${linkSupportHtml}.</p>
                                                                        <p style="margin-bottom:18px;line-height:1.4"> Đội ngũ hỗ trợ khách hàng của TimViecNhanh </p>
                                                                        <p style="margin-bottom:18px;font-size:85%;line-height:1.4;font-style:italic;"> Đây là email được tạo tự động, vui lòng không trả lời email này! </p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="margin:0px auto;max-width:600px">
                <table style="width:100%" border="0" cellspacing="0" cellpadding="0" align="center" role="presentation">
                    <tbody>
                        <tr>
                            <td style="padding:0px;padding-left:0px;padding-right:0px;direction:ltr;text-align:center;font-size:0px;">
                                <div style="display:inline-block;width:100%;vertical-align:top;direction:ltr;text-align:left;font-size:0px">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                        <tbody>
                                            <tr>
                                                <td style="padding-left:0px;padding-right:0px;vertical-align:top">
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                                        <tbody>
                                                            <tr>
                                                                <td style="padding:10px 25px;padding-left:0px;padding-right:0px;font-size:0px;word-break:break-word">
                                                                    <p style="margin:0px auto;margin-bottom:18px;width:100%;border-top:solid 1px #cccccc;font-size:1px;line-height:1.4">
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="margin:0px auto;max-width:600px">
                <table style="width:100%" border="0" cellspacing="0" cellpadding="0" align="center" role="presentation">
                    <tbody>
                        <tr>
                            <td style="padding:0px 5px;padding-left:5px;padding-right:5px;direction:ltr;text-align:center;font-size:0px">
                                <div style="display:inline-block;width:100%;vertical-align:top;direction:ltr;text-align:left;font-size:0px">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                        <tbody>
                                            <tr>
                                                <td style="padding-right:0px;padding-left:0px;vertical-align:top">
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                                        <tbody>
                                                            <tr>
                                                                <td style="padding:10px 25px;padding-left:0px;padding-right:0px;font-size:0px;word-break:break-word" align="left">
                                                                    <div style="text-align:left;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:140%;color:#7f7f7f">
                                                                        &copy; 2024 
                                                                        ${linkHomeHtml}
                                                                        | Ho Chi Minh City, VietNam 
                                                                        <u></u>
                                                                        <u></u> 
                                                                        | <span style="white-space:nowrap">+84 123-456-789</span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>;`;

        sendMail(userData.email, subject, html);
        // ================
        // Respond with success message and reset token
        return res.status(200).json({
            code: 200,
            message: 'Kiểm tra email và đặt lại mật khẩu của bạn',
            resetToken: token,
        });
    } catch (err) {
        console.error(`forgotPasswordController error: ${err}`);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

// Controller to reset password
export const resetPasswordController = async (req, res) => {
    try {
        const { token, password } = req.body;

        // Verify reset password token
        jwt.verify(token, process.env.RESET_PASS_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ code: 403, message: 'Mã xác thực không hợp lệ hoặc đã hết hạn' });
            }

            // Hash the new password
            const salt = bcrypt.genSaltSync(10);
            const newPassword = bcrypt.hashSync(password, salt);

            // Update user's password
            await User.updateOne({ _id: decoded._id }, { $set: { password: newPassword } });

            // Respond with success message
            return res.status(200).json({ code: 200, message: 'Mật khẩu đã được đặt lại thành công' });
        });
    } catch (err) {
        console.error(`resetPasswordController error: ${err}`);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

// Controller to get current user
export const getCurrentUserController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select('-password');

        if (!currentUser) {
            return res.status(404).json({ code: 404, message: 'User not found' });
        }

        return res.status(200).json({ code: 200, message: 'Success', currentUser });
    } catch (err) {
        console.error(`getCurrentUserController error: ${err}`);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

// Controller to sign out
export const signOutController = (req, res) => {
    try {
        res.clearCookie('accessToken', {
            secure: true,
            sameSite: 'none',
        })
            .status(200)
            .json({ code: 200, message: 'Đăng xuất thành công' });
    } catch (err) {
        console.error(`signOutController error: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};
