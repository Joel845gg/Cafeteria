import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Menu() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/menu')
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