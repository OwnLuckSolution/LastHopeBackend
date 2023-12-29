const express = require('express');
const session = require('express-session');
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const passport = require('passport')
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./connectDB');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
require('./passport.js');


const app = express();


app.use(session({
    secret: 'lottery-app',
    resave: false,
    saveUninitialized: false,
  }));

connectDB();

app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/admin',adminRoutes);
app.use('/user',userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
