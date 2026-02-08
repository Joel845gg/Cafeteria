import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Menu() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/menu`)
      .then(response => {
        setMenu(response.data);
      })
      .catch(error => {
        console.error('Error al obtener el menú:', error);
      });
  }, []);

  return (
    <div>
      <h1>Menú de la Cafetería</h1>
      <ul>
        {menu.map(item => (
          <li key={item.id}>{item.nombre} - ${item.precio}</li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;
