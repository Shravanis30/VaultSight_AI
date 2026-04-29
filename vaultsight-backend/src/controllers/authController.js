const User = require('../models/User');
const LoginLog = require('../models/LoginLog');
const { createAlert } = require('../services/alertService');
const jwt = require('jsonwebtoken');
const { SYSTEM_ADMIN_ID, SYSTEM_SOC_ID } = require('../middleware/auth');

const login = async (req, res, next) => {
  try {
    const { username, password, location } = req.body;

    // Check Hardcoded Admin
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ id: 'ADMIN_SESSION', role: 'admin' }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });
      return res.status(200).json({
        success: true,
        data: { 
          token, 
          role: 'admin', 
          user: { _id: SYSTEM_ADMIN_ID, name: 'System Admin', username: 'admin', role: 'admin' } 
        }
      });
    }

    // Check Hardcoded SOC
    if (username === process.env.SOC_USERNAME && password === process.env.SOC_PASSWORD) {
      const token = jwt.sign({ id: 'SOC_SESSION', role: 'soc' }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });
      return res.status(200).json({
        success: true,
        data: { 
          token, 
          role: 'soc', 
          user: { _id: SYSTEM_SOC_ID, name: 'SOC Lead', username: 'soc', role: 'soc' } 
        }
      });
    }


    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, error: 'Account is blocked by bank' });
    }

    if (user.isLocked) {
      return res.status(403).json({ success: false, error: `Account is locked: ${user.lockReason}` });
    }

    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      user.loginAttempts += 1;
      await user.save();

      await LoginLog.create({
        username,
        userId: user._id,
        status: 'FAILED',
        failureReason: 'Invalid password',
        ipAddress: req.ip
      });

      if (user.loginAttempts >= 5) {
        user.isLocked = true;
        user.lockReason = 'Too many failed login attempts';
        user.lockedAt = new Date();
        await user.save();
        await createAlert('ACCOUNT_LOCKED', 'CRITICAL', 'Locked due to 5+ failed attempts', user._id);
      }

      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Success
    user.loginAttempts = 0;
    user.lastLoginAt = new Date();
    user.lastLoginIp = req.ip;
    user.lastLoginDevice = req.headers['user-agent'];
    user.lastLoginLocation = location || 'Unknown';
    await user.save();

    await LoginLog.create({
      username,
      userId: user._id,
      status: 'SUCCESS',
      ipAddress: req.ip,
      device: user.lastLoginDevice,
      location: location || 'Unknown'
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(200).json({
      success: true,
      data: {
        token,
        user: user.toSafeObject(),
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  const userData = req.user.toSafeObject ? req.user.toSafeObject() : req.user;
  res.status(200).json({ success: true, data: userData });
};

module.exports = { login, getMe };
