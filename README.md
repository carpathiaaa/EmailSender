# ICpEP.SE - PLM Bulk Email Sender

This Node.js project automates the process of sending personalized emails to a list of organizations using Gmail. The recipient list and organization names are sourced from a Google Sheet, and the emails use a pre-designed HTML template with dynamic placeholders and embedded images.

---

## Features

- Reads organization names and email addresses from Google Sheets
- Sends personalized Gmail emails using `nodemailer`
- Uses your pre-designed Gmail HTML template (with embedded headers and footers)
- Replaces `{{ORG_NAME}}` dynamically in the email body
- Supports image attachments with `cid` for inline display
- Uses `.env` for secure credential management
- Ignores `node_modules` and secrets in Git

---

## Project Structure

```
.
├── index.js              # Main script to run the email sender
├── .env                  # Environment variables (NOT committed to Git)
├── .gitignore            # Ignores sensitive files and folders
├── credentials.json      # Google API service credentials
├── package.json          # Project metadata and dependencies
├── package-lock.json     # Dependency lock file
├── template.html         # HTML email template with placeholders
└── assets/
   ├── BigHeader.png     # Header image used in the email
   ├── ICPEPLogo.png     # Footer image used in the email signature

```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/email-sender.git
cd email-sender
```

### 2. Install dependencies
```bash
npm install
```
### 3. Create a .env file
Create a .env file in the root directory with the following content:
```
SENDER_EMAIL=your-email@gmail.com
SENDER_PASS=your-app-password
SPREADSHEET_ID=your-google-sheet-id
```
Make sure to use an App Password from your Gmail account (under Google Account > Security > App passwords).

### 4. Add Google API credentials
Place your downloaded credentials.json from Google Cloud Console (Service Account credentials with Sheets API enabled) in the root folder.

---

## How It Works
### Read from Google Sheets
The readSheet() function uses the Google Sheets API to read:

- Column A: Organization Name

- Column B: Email Address

### Generate HTML Email
- template.html includes a placeholder like {{ORG_NAME}}, which is dynamically replaced for each organization.

- Inline images like headers and footers are embedded using cid: with nodemailer.

### Send with Gmail
- Uses nodemailer to send emails via Gmail SMTP.

- Emails are sent one by one, and each result is logged in the terminal.

---

## Run the Script
```
node index.js
```

You should see logs like:
```
Email sent to Organization XYZ <example@gmail.com>
```

---

## Best Practices
1. **Never commit .env or credentials.json — make sure they are listed in .gitignore.**

2. Commit package-lock.json to ensure consistent installs.

3. Use template.html to format your HTML email for Gmail compatibility.

4. Create an .env.example file with dummy values for teammates.

---

## License
MIT License. Feel free to fork and adapt for your organization.

---

## Credits
Developed by Charles Chang-il Jung (Vice President Internal, ICpEP.SE - PLM)
With help from Google APIs, nodemailer, and VS Code.
