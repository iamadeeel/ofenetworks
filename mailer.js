var nodemailer = require('nodemailer');
const config = require('./config/mail-options');


var transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    auth: {
        user: config.username,
        pass: config.password
    }
});

module.exports.sendMail = function(receiver_email, mail_subject, mail_body){
    transport.sendMail({
        from: config.from_address,
        to: receiver_email,
        subject: mail_subject,
        text: mail_body}, (error, info) => {
        if (error) {
            console.log(error);
            return false;
        }
        console.log('Message sent: %s', info.messageId);
        return true;
    });
};
