const express = require('express');
const { readSheet, writeSheet, appendRow } = require('./routes/sheets');
const { sendEmails, logs } = require('./send/send');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/data', async (req, res) => {
    try {
        const data = await readSheet();
        res.json(data);
    } catch (e) {
        res.status(500).send('Error fetching sheet data');
    }
});

app.post('/update', async (req, res) => {
    const data = req.body.updatedRows; // expects [[Org, Email], ...]
    try {
        await writeSheet(data);
        res.send('Sheet updated');
    } catch (err) {
        res.status(500).send('Error writing to sheet');
    }
});

app.post('/send-emails', async (req, res) => {
    try {
        await sendEmails();
        res.send('Emails sent successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error sending emails.');
    }
});

app.post('/add-row', async (req, res) => {
    const newRow = req.body.newRow; // expects ['Org Name', 'email@example.com']
    if (!Array.isArray(newRow) || newRow.length !== 2) {
        return res.status(400).send('Invalid row format');
    }

    try {
        await appendRow(newRow);
        res.send('Row added successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding new row');
    }
});


app.get('/logs', (req, res) => {
    res.json(logs);
});

app.post('/logs/clear', (req, res) => {
    logs.length = 0;
    res.send('Logs cleared');
});

app.post('/shutdown', (req, res) => {
    res.send('Shutting down...');
    console.log('Received shutdown signal from browser. Exiting...');
    process.exit(0);
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

