const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
var port = process.env.PORT || 8080;
const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
    const output = `
      <h3>Contact Details</h3>
      <ul>  
        <li><b>Name:</b> ${req.body.name}</li>
        <li><b>Age:</b> ${req.body.age}</li>
        <li><b>Email:</b> ${req.body.email}</li>
        <li><b>Phone:</b> ${req.body.phone}</li>
        <li><b>Company:</b> ${req.body.company}</li>
        <li><b>City:</b> ${req.body.city}</li>
        <li><b>Appointment Reason:</b> ${req.body.reason}</li>
      </ul>
        `;

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'Gmail',
    auth: {
         user: 'usergmail@gmail.com', // generated ethereal user
         pass: 'userpassword'  // generated ethereal password
     },
     tls:{
       rejectUnauthorized:false
     }
   });

// setup email data with unicode symbols
let mailOptions = {
    from: 'usergmail@gmail.com', // sender address
     to: req.body.email,
    subject: ' Appointment', // Subject line
    text: 'Hello', // plain text body
    html: output // html body
};   

 // send mail with defined transport object
 transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);   
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('contact', {msg:'Email has been sent'});
});
});

app.listen(port, () => console.log('Server started...'));




