import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(Buffer.from(process.env.GOOGLE_SERVICE_KEY_BASE64!, 'base64').toString('utf-8')),
  scopes: [process.env.GOOGLE_SPREADSHEETS_API as string],
});

export const sheetsApi = google.sheets({ version: 'v4', auth });