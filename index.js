const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
require('dotenv').config();

const templatePath = path.join(__dirname, 'template.html');
let baseHTML = fs.readFileSync(templatePath, 'utf8');
baseHTML = baseHTML.replace(/{{FORM_URL}}/g, process.env.FORM_URL);

const credentials = JSON.parse(fs.readFileSync('credentials.json'));

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});


async function readSheet() {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = `'Final List'!A2:B`; // A: Org Name, B: Email

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    return response.data.values; // returns array of rows
}


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,       // e.g. icpep.seplm2025@gmail.com
        pass: process.env.SENDER_PASS         // App password
    }
});


async function main() {
    const rows = await readSheet();

    for (const row of rows) {
        const orgName = row[0];
        const recipientEmail = row[1];

        const personalizedHTML = baseHTML.replace('{{ORG_NAME}}', orgName);

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: recipientEmail,
            subject: "Verifying Your Organization's Contact Email | ICpEP.SE - PLM 2025",
            html: personalizedHTML,
            attachments: [
                {
                    filename: 'BigHeader.png',
                    path: './assets/BigHeader.png',
                    cid: 'header_image'
                },
                {
                    filename: 'ICPEPLogo.png',
                    path: './assets/ICPEPLogo.png',
                    cid: 'footer_image'
                }
            ]
        };


        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${orgName} <${recipientEmail}>: ${info.response}`);
        } catch (error) {
            console.error(`Failed to send to ${recipientEmail}:`, error.message);
        }
    }
}

main();
