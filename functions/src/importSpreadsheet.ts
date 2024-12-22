import * as admin from 'firebase-admin';
import { google } from 'googleapis';
import type { Parish } from './types/Parish';

// Helper function to ensure dates are strings
const toISOString = () => new Date().toISOString();

export const importFromSpreadsheet = async (spreadsheetUrl: string) => {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    credentials: {
      client_email: process.env.GOOGLE_MAPS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_MAPS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = extractSpreadsheetId(spreadsheetUrl);

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'A2:J' // Adjust based on your spreadsheet structure
  });

  const rows = response.data.values || [];
  const parishesRef = admin.database().ref('parishes');
  let importCount = 0;

  for (const row of rows) {
    const [name, street, city, province, country, phone, email, leaderName, lat, lng] = row;

    
    const parish: Partial<Parish> = {
      name,
      address: {
        street,
        city,
        province,
        country,
        postalCode: ''
      },
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      phone,
      email,
      leaderName,
      openingHours: {},
      photos: [],
      createdAt: toISOString(),
      updatedAt: toISOString(),
      importSource: 'manual',
      sourceId: `spreadsheet_${Date.now()}_${importCount}`
    };

    await parishesRef.push(parish);
    importCount++;
  }

  return {
    count: importCount,
    message: `Successfully imported ${importCount} parishes from spreadsheet`
  };
};

const extractSpreadsheetId = (url: string): string => {
  const matches = url.match(/\/d\/([-\w]+)/);
  if (!matches?.[1]) {
    throw new Error('Invalid spreadsheet URL');
  }
  return matches[1];
};
