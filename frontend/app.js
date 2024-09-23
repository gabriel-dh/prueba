// Función para decodificar el token JWT
const decodeToken = (token) => {
  if (!token) return null;
  const payloadBase64 = token.split('.')[1];
  return JSON.parse(atob(payloadBase64));  // Decodificar el payload del JWT
};

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      
      // Decodificar el token para verificar el rol y redirigir
      const decodedToken = decodeToken(data.token);
      
      if (decodedToken.role === 'admin') {
        window.location.href = 'admin_dashboard.html';  // Redirigir al dashboard de admin
      } else if (decodedToken.role === 'employee') {
        window.location.href = 'dashboard.html';  // Redirigir al dashboard del empleado
      } else {
        alert('Rol desconocido, contacta al administrador');
      }
    } else {
      alert('Error: ' + data.error);
    }
  });
}

// Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, role }),
    });

    const data = await response.json();
    if (response.ok) {
      window.location.href = 'login.html';
    } else {
      alert('Error: ' + data.error);
    }
  });
}

// Registrar llegada (Empleado)
const recordArrivalBtn = document.getElementById('recordArrival');
if (recordArrivalBtn) {
  recordArrivalBtn.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      alert('Llegada registrada con éxito');
      // Actualizar la tabla de registros (empleado)
      // Aquí puedes implementar el código para mostrar los registros del empleado
    } else {
      alert('Error al registrar la llegada');
    }
  });
}









