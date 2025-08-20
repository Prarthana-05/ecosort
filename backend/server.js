// backend/server.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cleanupRoutes = require('./routes/cleanupRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const wasteCenterRoutes = require('./routes/wasteCenterRoutes');
const path = require('path');
require('dotenv').config();
const cors = require("cors");

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/ecosort', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
const wasteRoutes = require('./routes/wasteRoutes');
const frontendPath = path.join(__dirname, '../frontend/public');
app.use(express.static(frontendPath));
app.use('/api/admin', adminRoutes);
app.use('/api/user', wasteRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/events', cleanupRoutes);
app.use('/api/user', userRoutes);

app.use('/api/centers', wasteCenterRoutes);
// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use('/api/auth', authRoutes);


app.use('/qr', express.static(path.join(__dirname, 'public/qr')));


app.use(cors({
  origin: [
    
    "https://prarthanaa-portfolio.netlify.app",
    "https://ecosortt.netlify.app/"
  ],
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true // if you plan to send cookies or authorization headers
}));
// server.js


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
