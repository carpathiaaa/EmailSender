const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
require('dotenv').config();

const templatePath = path.join(__dirname, '..', 'template.html');
let baseHTML = fs.readFileSync(templatePath, 'utf8');
baseHTML = baseHTML.replace(/{{FORM_URL}}/g, process.env.FORM_URL);

const credentialsPath = path.join(__dirname, '..', 'credentials.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath));

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
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

async function writeSheet(data) {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = process.env.SPREADSHEET_ID;

    // Step 1: Clear old data from A2:B
    await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: `'Final List'!A2:B`,
    });

    // Step 2: Write new data (including added rows)
    const values = data.map(row => [row[0], row[1]]);

    const response = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `'Final List'!A2`,
        valueInputOption: 'RAW',
        requestBody: { values }
    });

    return response;
}


module.exports = { readSheet, writeSheet };
