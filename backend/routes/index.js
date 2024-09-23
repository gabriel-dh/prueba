const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const attendanceRoutes = require('./attendanceRoutes');

router.use('/auth', authRoutes);
router.use('/attendance', attendanceRoutes);

module.exports = router;
