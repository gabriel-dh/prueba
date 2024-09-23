const express = require('express');
const { register, login, deleteEmployee, addOrUpdateEmployee, getAllEmployees} = require('../controllers/authController');
const { verifyToken } = require('../services/authService');
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para agregar o actualizar empleados
router.post('/add-update-employee', verifyToken, addOrUpdateEmployee);

// Eliminar un empleado
router.delete('/delete-employee/:id', verifyToken, deleteEmployee);

// Ruta para obtener todos los empleados
router.get('/employees', verifyToken, getAllEmployees);


module.exports = router;
