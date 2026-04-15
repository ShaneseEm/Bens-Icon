const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, 'public');
const bookingsFile = path.join(__dirname, 'bookings.json');

app.use(express.json());
app.use(express.static(publicPath));

app.post('/api/reservation', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide name, email, and message.' });
  }

  const booking = {
    id: Date.now(),
    name,
    email,
    message,
    createdAt: new Date().toISOString()
  };

  let bookings = [];

  if (fs.existsSync(bookingsFile)) {
    try {
      bookings = JSON.parse(fs.readFileSync(bookingsFile, 'utf8')) || [];
    } catch (error) {
      bookings = [];
    }
  }

  bookings.push(booking);
  fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2), 'utf8');

  return res.status(201).json({ success: true, booking });
});

app.use((req, res) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(publicPath, 'index.html'));
  }

  return res.status(404).json({ error: 'Resource not found' });
});

app.listen(PORT, () => {
  console.log(`Bensicon Hotel site running at http://localhost:${PORT}`);
});


module.exports = app;