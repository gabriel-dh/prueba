const verifyEmploye = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('No estás autenticado');
      window.location.href = 'login.html';  // Redirigir si no hay token
      return;
    }
  
    const decodedToken = decodeToken(token);
  
    // Verificar si el rol es 'employee'
    if (decodedToken.role !== 'employee'  ) {
      alert('No tienes permisos para acceder a esta página');
      window.location.href = 'login.html';  // Redirigir si no es empleado
    }
  };
  
  // Esta función se puede llamar al cargar la página de employe para asegurarse que solo empleados accedan
  verifyEmploye();

  // Función para obtener los registros de llegada del empleado autenticado
const getMyAttendance = async () => {
    const token = localStorage.getItem('token');  // Obtener el token del localStorage
  
    try {
      const response = await fetch('http://localhost:3000/api/attendance/my-attendance', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const attendanceRecords = await response.json();
        const tableBody = document.querySelector('#attendanceTable tbody');
  
        // Limpiar tabla antes de agregar los registros
        tableBody.innerHTML = '';
  
        // Agregar cada registro a la tabla
        attendanceRecords.forEach(record => {
          const row = document.createElement('tr');
          const arrivalTimeCell = document.createElement('td');
          
          arrivalTimeCell.textContent = new Date(record.arrival_time).toLocaleString();
          console.log(record);
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
  
  // Llamar a la función cuando cargue el dashboard del empleado
  getMyAttendance();
  
  