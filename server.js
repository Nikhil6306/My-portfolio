// ─────────────────────────────────────────────
//  Contact Form Backend Server
//  Run: node server.js
//  Data saves to: contacts.json
// ─────────────────────────────────────────────

const http    = require('http');
const fs      = require('fs');
const path    = require('path');

const PORT        = 3000;
const DATA_FILE   = path.join(__dirname, 'contacts.json');

// ── Helper: Read existing contacts ──────────────
function readContacts() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// ── Helper: Write contacts to JSON ──────────────
function writeContacts(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ── Helper: Email Validation ─────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// ── Helper: Send JSON response ───────────────────
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',           // Allow browser requests
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// ── Main Server ──────────────────────────────────
const server = http.createServer((req, res) => {

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // ── POST /submit — Save form data ──────────────
  if (req.method === 'POST' && req.url === '/submit') {
    let body = '';

    req.on('data', chunk => { body += chunk.toString(); });

    req.on('end', () => {
      try {
        const { name, email, subject, message } = JSON.parse(body);

        // ── Server-side Validation ──────────────
        if (!name || name.trim().length < 2) {
          return sendJSON(res, 400, { success: false, message: 'Name kam se kam 2 characters ka hona chahiye.' });
        }
        if (!email || !isValidEmail(email.trim())) {
          return sendJSON(res, 400, { success: false, message: 'Valid email address daalo.' });
        }
        if (!subject || subject.trim().length < 3) {
          return sendJSON(res, 400, { success: false, message: 'Subject kam se kam 3 characters ka hona chahiye.' });
        }
        if (!message || message.trim().length < 10) {
          return sendJSON(res, 400, { success: false, message: 'Message kam se kam 10 characters ka hona chahiye.' });
        }

        // ── Build entry ─────────────────────────
        const entry = {
          id:        Date.now(),
          name:      name.trim(),
          email:     email.trim().toLowerCase(),
          subject:   subject.trim(),
          message:   message.trim(),
          submitted_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        };

        // ── Save to contacts.json ────────────────
        const contacts = readContacts();
        contacts.push(entry);
        writeContacts(contacts);

        console.log(`✅ New submission saved! [${entry.submitted_at}] From: ${entry.email}`);

        return sendJSON(res, 200, {
          success: true,
          message: 'Form data successfully save ho gaya!',
          entry
        });

      } catch (err) {
        console.error('❌ Error:', err.message);
        return sendJSON(res, 500, { success: false, message: 'Server error. Please dobara try karo.' });
      }
    });

  // ── GET /contacts — View all saved contacts ─────
  } else if (req.method === 'GET' && req.url === '/contacts') {
    const contacts = readContacts();
    return sendJSON(res, 200, {
      success: true,
      total: contacts.length,
      contacts
    });

  // ── 404 ──────────────────────────────────────────
  } else {
    return sendJSON(res, 404, { success: false, message: 'Route not found.' });
  }
});

server.listen(PORT, () => {
  console.log('');
  console.log('🚀 Contact Form Server chal raha hai!');
  console.log(`📡 Server URL  : http://localhost:${PORT}`);
  console.log(`📋 Contacts    : http://localhost:${PORT}/contacts`);
  console.log(`💾 Data File   : contacts.json`);
  console.log('');
  console.log('Server band karne ke liye: Ctrl + C');
  console.log('─────────────────────────────────────');
});





// ---- express terminal code------

const express = require('express');
const app = express();
const PORT = 3000;

// स्टैटिक फाइल्स सर्व करने के लिए (HTML/CSS/JS)
app.use(express.static('public'));  // public फोल्डर बनाएं अपनी फाइल्स के लिए

app.get('/api', (req, res) => {
  res.json({ message: 'Portfolio Server Running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
