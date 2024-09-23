const express = require('express');
const { registerArrival, getAllAttendance, getEmployeeAttendance, getFilteredAttendance} = require('../controllers/attendanceController');
const { verifyToken } = require('../services/authService');
const router = express.Router();

// Ruta para registrar la llegada (Empleado)
router.post('/', verifyToken, registerArrival);

// Ruta para obtener todos los registros (Administrador)
router.get('/', verifyToken, getAllAttendance);

// Ruta protegida para obtener todos los registros de asistencia
router.get('/all', verifyToken, getFilteredAttendance);

// Ruta para obtener todos los registros propios (Empleado)
router.get('/my-attendance', verifyToken, getEmployeeAttendance);



module.exports = router;
