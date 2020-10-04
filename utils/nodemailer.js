const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const sendResetMail = async (options) => {
  /*
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();
*/
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: `${process.env.SMTP_HOST}`,
    port: `${process.env.SMTP_PORT}`,
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // sender address
    to: options.toEmail, // list of receivers
    subject: options.toSubject, // Subject line
    text: options.message
  };

  const sendIt = await transporter.sendMail(info)


  console.log("Message sent: %s", info.messageId);
  /*
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  */
}

// main().catch(console.error);
module.exports = sendResetMail