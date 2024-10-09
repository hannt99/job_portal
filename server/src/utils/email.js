import nodeMailer from 'nodemailer';

// Send verify mail
const sendMail = async (email, subject, html) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.PASS_SENDER,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: email,
            subject: subject,
            html: html,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Mail has been sent', info.response);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

export default sendMail;
