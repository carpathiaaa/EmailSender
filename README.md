# ICpEP.SE - PLM Bulk Email Sender with Frontend Editor

This is a full-stack Node.js application that automates sending personalized emails to organizations based on data from Google Sheets. It includes a browser-based interface where users can view, edit, and update email entries in real-time, trigger email sending, and view logs of sent messages.

## Features

- Read and write to a Google Sheet via the Sheets API
- HTML email template with dynamic placeholders (`{{ORG_NAME}}`)
- Sends emails using Gmail + Nodemailer + App Password
- Embedded images in emails using `cid` references
- Web-based interface (localhost) to:
  - View and edit org/email data in a table
  - Save changes to the sheet
  - Trigger email sending
  - View real-time logs
  - Clear logs
- Auto-shutdown when browser tab is closed
- Deployment-ready with support for Render secret file mounting

## Project Structure

```
.
├── app.js                # Main Express server
├── .env                 # Environment variables (not committed)
├── credentials.json     # Google API service account credentials (secret)
├── template.html        # HTML email template (with {{ORG_NAME}} and {{FORM_URL}})
├── public/
│   └── index.html       # Frontend UI (table + buttons)
├── routes/
│   └── sheets.js        # Google Sheets API functions
├── send/
│   └── send.js          # Email sending logic + log handling
├── assets/
│   ├── BigHeader.png    # Embedded email header image
│   └── ICPEPLogo.png    # Embedded footer/logo
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/carpathiaaa/EmailSender.git
cd EmailSender
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

```
SENDER_EMAIL=your-gmail@gmail.com
SENDER_PASS=your-app-password
SPREADSHEET_ID=your-google-sheet-id
FORM_URL=https://forms.gle/your-google-form-link
```

Use [Google App Passwords](https://support.google.com/accounts/answer/185833) — do not use your actual Gmail password.

### 4. Add Google API Credentials

You must have a service account key with access to Google Sheets API.

**Local dev only:**
Place `credentials.json` in the root of your project.

**For deployment (Render):**

- Go to your service > Environment > Secret Files
- Add a secret named `credentials.json`
- Paste your credential contents
- Update code path to:

```js
const credentialsPath = "/etc/secrets/credentials.json";
```

## How to Use

### 1. Start the Server

```bash
node app.js
```

Visit [http://localhost:3000](http://localhost:3000)

### 2. Use the Web Interface

- **Edit org names / emails directly** in the table
- Click **Save Changes** to update the sheet
- Click **Send Emails** to trigger mass emailing
- View logs below (success/failure per email)
- Click **Clear Logs** to reset

On closing the tab, the app will shut down automatically (if local).

## Email Functionality

- Each email uses `template.html` and replaces:
  - `{{ORG_NAME}}` → from the sheet
  - `{{FORM_URL}}` → from `.env`
- `BigHeader.png` and `ICPEPLogo.png` are embedded using CID
- Email subject: `"Verifying Your Organization's Contact Email | ICpEP.SE - PLM 2025"`

## Troubleshooting

| Issue                                      | Fix                                                                           |
| ------------------------------------------ | ----------------------------------------------------------------------------- |
| `credentials.json not found on deployment` | Use Render secret file mounting                                               |
| Email not sending                          | Make sure App Password is correct and "Less secure apps" is allowed           |
| `.env` still gets pushed                   | Use `.gitignore` + `git rm --cached .env`                                     |
| Logs not showing                           | Ensure `/logs` and `/logs/clear` routes are present and log array is exported |

## Deployment

You can deploy this project on **Render** or similar Node.js platforms.

- Set up `.env` as **Environment Variables**
- Add `credentials.json` as a **Secret File**
- Make sure to update any hardcoded paths for deployment compatibility
- Optionally configure a `start` script in `package.json`:

```json
"scripts": {
  "start": "node app.js"
}
```

## License

MIT License. Fork, adapt, or use freely with attribution.

## Credits

Developed by Charles Chang-il Jung  
Vice President Internal  
ICpEP.SE - PLM
