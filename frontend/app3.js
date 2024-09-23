// Verificación para el administrador en el dashboard
const verifyAdmin = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    alert('No estás autenticado');
    window.location.href = 'login.html';  // Redirigir si no hay token
    return;
  }

  const decodedToken = decodeToken(token);

  // Verificar si el rol es 'admin'
  if (decodedToken.role !== 'admin') {
    alert('No tienes permisos para acceder a esta página');
    window.location.href = 'login.html';  // Redirigir si no es administrador
  }
};

// Esta función se puede llamar al cargar la página de admin para asegurarse que solo administradores accedan
verifyAdmin();





// Función para obtener los registros de asistencia filtrados
const getAttendance = async (filter = {}) => {
  const token = localStorage.getItem('token');  // Obtener el token de autenticación

  let url = 'http://localhost:3000/api/attendance/all';  // Ruta base para obtener registros

  // Si hay filtros, agregarlos a la URL como parámetros
  const params = new URLSearchParams(filter);
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const attendanceRecords = await response.json();
      const tableBody = document.querySelector('#attendanceTable tbody');

      // Limpiar la tabla antes de agregar nuevos registros
      tableBody.innerHTML = '';

      // Agregar cada registro a la tabla
      attendanceRecords.forEach(record => {
        const row = document.createElement('tr');
        const usernameCell = document.createElement('td');
        const arrivalTimeCell = document.createElement('td');

        usernameCell.textContent = record.username;
        arrivalTimeCell.textContent = new Date(record.arrival_time).toLocaleString();

        row.appendChild(usernameCell);
        row.appendChild(arrivalTimeCell);
        tableBody.appendChild(row);
      });
    } else {
      alert('Error al obtener los registros de asistencia');
    }
  } catch (error) {
    console.error('Error al hacer la solicitud:', error);
  }
};

// Filtrar registros por empleado o fecha
const filterForm = document.getElementById('filterForm');
if (filterForm) {
  filterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const employeeName = document.getElementById('employeeName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const filter = {};

    if (employeeName) filter.username = employeeName;
    if (startDate) filter.startDate = startDate;
    if (endDate) filter.endDate = endDate;

    // Llamar a la función para obtener registros filtrados
    getAttendance(filter);
  });
}








// Agregar o actualizar empleados
const employeeForm = document.getElementById('employeeForm');
if (employeeForm) {
  employeeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const id = document.getElementById('employeeId').value;  // Asegúrate de tener un campo oculto o visible para el ID del empleado
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const response = await fetch('http://localhost:3000/api/auth/add-update-employee', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, username, password, role }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);  // Mostrar el mensaje de éxito
      employeeForm.reset();  // Limpiar el formulario después de enviar los datos
    } else {
      alert('Error al agregar/actualizar empleado: ' + data.error);
    }
  });
}





// Eliminar empleados
const deleteEmployeeForm = document.getElementById('deleteEmployeeForm');
if (deleteEmployeeForm) {
  deleteEmployeeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const employeeId = document.getElementById('deleteEmployeeId').value;

    const response = await fetch(`http://localhost:3000/api/auth/delete-employee/${employeeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (response.ok) {
      alert('Empleado eliminado exitosamente');
      deleteEmployeeForm.reset();  // Limpiar el formulario después de enviar los datos
    } else {
      alert('Error al eliminar empleado: ' + data.error);
    }
  });
}



// Llamar a la función para obtener los registros de asistencia al cargar la página
getAttendance();








// Función para cargar los empleados en la tabla
const loadEmployees = async () => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/employees', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const employees = await response.json();
      const tableBody = document.querySelector('#employeeTable tbody');

      // Limpiar la tabla antes de cargar los empleados
      tableBody.innerHTML = '';

      // Agregar cada empleado a la tabla
      employees.forEach(employee => {
        const row = document.createElement('tr');
        const usernameCell = document.createElement('td');
        const roleCell = document.createElement('td');
        const actionsCell = document.createElement('td');

        usernameCell.textContent = employee.username;
        roleCell.textContent = employee.role;

        // Botón para editar el empleado
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.onclick = () => loadEmployeeData(employee);  // Cargar datos en el formulario
        actionsCell.appendChild(editButton);

        row.appendChild(usernameCell);
        row.appendChild(roleCell);
        row.appendChild(actionsCell);
        tableBody.appendChild(row);
      });
    } else {
      alert('Error al obtener los empleados');
    }
  } catch (error) {
    console.error('Error al obtener empleados:', error);
  }
};

// Función para cargar los datos del empleado en el formulario
const loadEmployeeData = (employee) => {
  document.getElementById('employeeId').value = employee.id;  // Cargar el ID en un campo oculto
  document.getElementById('username').value = employee.username;  // Cargar el nombre de usuario
  document.getElementById('role').value = employee.role;  // Cargar el rol
};

// Cargar empleados al cargar la página
window.onload = () => {
  loadEmployees();  // Llamar a la función para cargar empleados al iniciar
};











