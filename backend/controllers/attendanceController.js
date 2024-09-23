const pool = require('../config/db');

// Registrar la llegada de un empleado
const registerArrival = async (req, res) => {
  try {
    const userId = req.user.id;  // Suponiendo que el usuario autenticado viene en `req.user`
    await pool.query('INSERT INTO attendance (user_id) VALUES ($1)', [userId]);
    res.status(201).json({ message: 'Llegada registrada' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error al registrar la llegada' });
  }
};

// Obtener todos los registros (solo para administradores)
const getAllAttendance = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT users.username, attendance.arrival_time
      FROM attendance
      JOIN users ON attendance.user_id = users.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
};

const getEmployeeAttendance = async (req, res) => {
  try {

    const userId = req.user.id;  // Obtener el ID del usuario autenticado desde el token
    const result = await pool.query(
      'SELECT * FROM attendance WHERE user_id = $1 ORDER BY arrival_time DESC',
      [userId]
    );
    res.json(result.rows);  // Devolver solo los registros del empleado autenticado
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).json({ error: 'Error al obtener los registros de asistencia' });
  }
};





// Obtener registros de asistencia con filtro opcional por empleado y rango de fechas
const getFilteredAttendance = async (req, res) => {
  const { username, startDate, endDate } = req.query;  // Recibir los filtros de la solicitud

  let query = `
    SELECT users.username, attendance.arrival_time 
    FROM attendance
    JOIN users ON attendance.user_id = users.id
    WHERE 1=1`;  // Usamos WHERE 1=1 para poder agregar condiciones opcionales

  const queryParams = [];
  let paramIndex = 1;  // Usaremos un índice dinámico para los parámetros

  // Filtro por nombre de empleado
  if (username) {
    query += ` AND users.username = $${paramIndex}`;  // Agregar un parámetro dinámico
    queryParams.push(username);
    paramIndex++;
  }

  // Filtro por rango de fechas
  if (startDate) {
    query += ` AND attendance.arrival_time >= $${paramIndex}`;
    queryParams.push(startDate);
    paramIndex++;
  }

  if (endDate) {
    query += ` AND attendance.arrival_time <= $${paramIndex}`;
    queryParams.push(endDate);
  }

  query += ' ORDER BY attendance.arrival_time DESC';

  try {
    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).json({ error: 'Error al obtener los registros de asistencia' });
  }
};


module.exports = { registerArrival, getAllAttendance, getEmployeeAttendance, getFilteredAttendance };
