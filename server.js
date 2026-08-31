require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/')));

// Database setup (SQLite)
const db = new sqlite3.Database('./leads.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fname TEXT NOT NULL,
            lname TEXT NOT NULL,
            school TEXT NOT NULL,
            email TEXT NOT NULL,
            role TEXT NOT NULL,
            message TEXT,
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your email provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit', (req, res) => {
    const { fname, lname, school, email, role, message } = req.body;
    
    // Simple validation
    if (!fname || !lname || !school || !email || !role) {
        return res.status(400).send('Missing required fields');
    }

    const sql = `INSERT INTO leads (fname, lname, school, email, role, message) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [fname, lname, school, email, role, message], function(err) {
        if (err) {
            console.error('Error inserting data:', err.message);
            return res.status(500).send('Internal Server Error');
        }
        console.log(`A new lead has been inserted with rowid ${this.lastID}`);

        // Send Email Notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'mayurbhati519@gmail.com',
            subject: `New Consultation Request from ${fname} ${lname} (${school})`,
            text: `
You have received a new consultation request!

Details:
Name: ${fname} ${lname}
School: ${school}
Role: ${role}
Email: ${email}

Message:
${message || 'No message provided.'}
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                // We still redirect because the lead was saved successfully
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        // Redirect to success page
        res.redirect('/success.html');
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
