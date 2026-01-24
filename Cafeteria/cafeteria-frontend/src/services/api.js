const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Función para crear un pedido
export const createOrder = async (orderData) => {
    try {
        console.log('Enviando pedido a:', `${API_URL}/pedidos`);
        console.log('Datos enviados:', JSON.stringify(orderData, null, 2));

        const response = await fetch(`${API_URL}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        console.log('Status de respuesta:', response.status);
        
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        
        if (!response.ok) {
            throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
        }

        return data;
    } catch (error) {
        console.error('Error en createOrder:', error);
        throw error;
    }
};

// Otras funciones de API...
export const getProducts = async () => {
    const response = await fetch(`${API_URL}/productos`);
    return response.json();
};

export const getCategories = async () => {
    const response = await fetch(`${API_URL}/categorias`);
    return response.json();
};