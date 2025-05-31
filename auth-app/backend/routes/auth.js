// Auth route using Student MongoDB model
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ msg: 'Please fill all fields.' });

  try {
    let student = await Student.findOne({ username });
    if (student)
      return res.status(400).json({ msg: 'User already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    student = new Student({ username, password: hashedPassword });
    await student.save();
    res.status(201).json({ msg: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const student = await Student.findOne({ username });
    if (!student)
      return res.status(400).json({ msg: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch)
      return res.status(400).json({ msg: 'Invalid credentials.' });

    // Sign JWT token (add secret to .env in real projects)
    const token = jwt.sign({ username: student.username }, 'supersecretkey', {
      expiresIn: '1h',
    });
    res.json({ token, username: student.username });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
