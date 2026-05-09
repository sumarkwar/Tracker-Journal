const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmailOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP - Tracker Journal',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
        <h2 style="color: #534AB7;">Tracker Journal</h2>
        <p>Your OTP for password reset is:</p>
        <h1 style="color: #D4537E; font-size: 36px; letter-spacing: 8px;">${otp}</h1>
        <p>This OTP expires in <strong>10 minutes</strong>.</p>
        <p style="color: #888;">If you did not request this, please ignore this email.</p>
      </div>
    `
  });
};
const register = async (req, res) => {
  try {
    let { name, phone, email, password } = req.body;

    // Auto add +91 if no country code
    if (phone && !phone.startsWith('+')) {
      phone = '+91' + phone;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      phone,
      email: email || undefined,
      password: hashedPassword
    });

    res.status(201).json({
      message: 'Account created successfully',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  const login = async (req, res) => {
  try {
    let { identifier, password } = req.body;

    // Try to find user with multiple phone formats
    let user = null;

    if (!identifier.includes('@')) {
      // Try all possible formats
      const formats = [
        identifier,
        '+91' + identifier,
        '+91' + identifier.replace(/^0/, ''),
        identifier.replace(/^\+91/, ''),
        identifier.replace(/^91/, ''),
      ];

      for (const format of formats) {
        user = await User.findOne({ phone: format });
        if (user) break;
      }

      // Also try email just in case
      if (!user) {
        user = await User.findOne({ email: identifier });
      }
    } else {
      user = await User.findOne({ email: identifier });
      if (!user) {
        // Try phone too
        user = await User.findOne({ phone: identifier });
      }
    }

    if (!user) {
      return res.status(400).json({ message: 'User not found. Please check your number.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    res.json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

const sendOTP = async (req, res) => {
  try {
    let { identifier } = req.body;

    // Auto add +91 if phone number without country code
    if (identifier && !identifier.includes('@') && !identifier.startsWith('+')) {
      identifier = '+91' + identifier;
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = { code: otp, expiresAt };
    await user.save();

    await sendEmailOTP(user.email, otp);

    res.json({ message: 'OTP sent to your email address' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;

    const user = await User.findOne({
      $or: [{ phone: identifier }, { email: identifier }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.otp || user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otp.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, sendOTP, resetPassword };