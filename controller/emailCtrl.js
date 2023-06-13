const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");


const sendEmail = asyncHandler(async(data, req, res) => {
    const transporter = nodemailer.createTransport({
      host: process.env.SMPT_HOST,
      port: process.env.SMPT_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMPT_MAIL, // generated mail user
          pass: process.env.SMPT_PASSWORD, // generated mail password
        },
      });

    
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Fleek  👻" <mafadusei@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
      });
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });


module.exports = sendEmail;