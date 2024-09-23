const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Función para registrar un nuevo usuario
const registerUser = async (username, password, role) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);  // Encriptar la contraseña
    const newUser = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, role]
    );
    return newUser.rows[0];
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    throw new Error('Error al registrar usuario');
  }
};

// Función para el inicio de sesión
const loginUser = async (username, password) => {
  try {
    // Buscar el usuario por nombre de usuario
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (!user.rows.length) throw new Error('Usuario no encontrado');

    // Comparar la contraseña proporcionada con la almacenada
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) throw new Error('Contraseña incorrecta');

    // Crear el token JWT con un tiempo de expiración
    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }  // El token expira en 1 hora
    );
    
    return token;
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    throw new Error('Error al iniciar sesión');
  }
};

// Función para verificar el token (middleware)
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Acceso denegado' });

  try {
    const verified = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);  // Verificar el token JWT
    req.user = verified;  // Agregar el usuario decodificado al request
    next();  // Continuar al siguiente middleware o controlador
  } catch (error) {
    res.status(400).json({ message: 'Token no válido' });
  }
};

module.exports = { registerUser, loginUser, verifyToken };
