const fs = require('fs');
const path = require('path');
const express = require('express');
const nodeMailer = require('nodemailer');
const bodyParser = require('body-parser');
const winston = require('winston');
const expressWinston = require('express-winston');
const { check, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');

const settings = require('./settings.json');

const app = express();

const PORT = process.env.PORT || 3002;
const PUBLIC_PATH = path.resolve(__dirname, './dist');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });
  
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
  }

app.use(expressWinston.logger({
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ],
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) { return false; }
}));

app.use(express.static(PUBLIC_PATH));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const templateIndex = fs.readFileSync(`${PUBLIC_PATH}/index.html`);

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(templateIndex);
});

// Email sending
let transporter = nodeMailer.createTransport({
    host: settings.email.host,
    port: settings.email.port,
    auth: {
        user: settings.email.user,
        pass: settings.email.password
    },
    tls: {
        rejectUnauthorized: false
    }
});

let mailOptions = {
    from: settings.email.from,
    to: settings.email.to,
    subject: settings.email.subject
};

function generateMail(data) {
    const { name, email, message } = data;

    return `
        <h1>You have a new email.</h1>
        <h2>User data:</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
    `;
}

app.post('/contacts', [
        check('name').exists().isLength({ min: 3 }).trim().escape(),
        check('email')
            .isEmail().withMessage('Incorrect email format')
            .trim()
            .escape()
            .normalizeEmail(),
        check('message').exists().isLength({ min: 3 }).trim().escape()
    ], function (req, res, next) {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(422).json({ data: errors.mapped() });
        }

        const mailHtml = generateMail(matchedData(req));
        mailOptions.html = mailHtml;

        transporter.sendMail(mailOptions, (err, info) => {
            let data = '';

            if (err) {
                console.log(err);

                data = 'Error! Message hasn\'t been sent.';
                res.status(err.responseCode).send({ data, error: err.response });
                return;
            }
            
            data = 'Message has been successfully sent.';

            res.status(200).send({ data });
        });
    }
);

app.listen(PORT, err => {
    if (err) return err;

    console.log(`Server started on port ${PORT}`);
})