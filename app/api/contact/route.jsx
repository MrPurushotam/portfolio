const nodemailer = require('nodemailer');

const contactroute = async (req, res) => {
    if (req.method === "POST") {
        const { name, email, message, subject } = req.body;

        // Create a transporter object using SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `${subject}`,
            text: `${name}: ${message}`
        };

        // Send mail with defined transport object
        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Email sent successfully', success: true });
        } catch (error) {
            res.status(500).json({ message: 'Error sending email', error, success: false });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default contactroute;