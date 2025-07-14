const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
require('dotenv').config();

const templatePath = path.join(__dirname, '..', 'template.html');
let baseHTML = fs.readFileSync(templatePath, 'utf8');
baseHTML = baseHTML.replace(/{{FORM_URL}}/g, process.env.FORM_URL);

const credentialsPath = '/etc/secrets/credentials.json';
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

    const values = data.map(row => [row[0], row[1]]); // 2D array: [[Org1, Email1], ...]

    const response = await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: `'Final List'!A2:B`,
        valueInputOption: 'RAW',
        requestBody: { values }
    });

    return response;
}

async function appendRow(newRow) {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: `'Final List'!A:B`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
            values: [newRow] // e.g., ['New Org', 'new@email.com']
        }
    });

    return response;
}


module.exports = { readSheet, writeSheet, appendRow };
