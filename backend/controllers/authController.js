const { registerUser, loginUser } = require('../services/authService');
const pool = require('../config/db'); 
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const newUser = await registerUser(username, password, role);
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await loginUser(username, password);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Eliminar un empleado
const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);  // Eliminar el usuario por ID
    res.json({ message: 'Empleado eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({ error: 'Error al eliminar empleado' });
  }
};


// Crear o actualizar empleado
const addOrUpdateEmployee = async (req, res) => {
  const { id, username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (id) {
      // Actualizar empleado si existe un ID
      await pool.query(`
        UPDATE users 
        SET username = $1, password = $2, role = $3 
        WHERE id = $4
      `, [username, hashedPassword, role, id]);
      res.json({ message: 'Empleado actualizado exitosamente' });
    } else {
      // Crear nuevo empleado si no hay ID
      const newUser = await pool.query(`
        INSERT INTO users (username, password, role) 
        VALUES ($1, $2, $3) RETURNING id, username, role
      `, [username, hashedPassword, role]);
      res.status(201).json({ message: 'Empleado creado exitosamente', user: newUser.rows[0] });
    }
  } catch (error) {
    console.error('Error al crear/actualizar empleado:', error);
    res.status(500).json({ error: 'Error al crear/actualizar empleado' });
  }
};


// Obtener todos los empleados
const getAllEmployees = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, username, role 
      FROM users
      ORDER BY username ASC
    `);
    res.json(result.rows);  // Devolver los empleados
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
};



module.exports = { register, login, deleteEmployee, addOrUpdateEmployee, getAllEmployees};
