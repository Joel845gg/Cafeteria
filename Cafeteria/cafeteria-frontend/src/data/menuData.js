export const categories = [
    { id: 1, nombre: 'Bebidas Calientes' },
    { id: 2, nombre: 'Bebidas Frías' },
    { id: 3, nombre: 'Especiales Sakura' },
    { id: 4, nombre: 'Desayunos' },
    { id: 5, nombre: 'Postres' }
];

export const menuItems = [
    // Bebidas Calientes
    { 
        id: 1, 
        nombre: 'Espresso Sakura', 
        descripcion: 'Café concentrado con esencia de cerezo y notas florales.', 
        precio: 3.50, 
        categoria_id: 1 
    },
    { 
        id: 2, 
        nombre: 'Matcha Latte', 
        descripcion: 'Matcha ceremonial batido con leche vaporizada y miel.', 
        precio: 4.75, 
        categoria_id: 1 
    },
    { 
        id: 3, 
        nombre: 'Hojicha Latte', 
        descripcion: 'Té verde tostado con leche cremosa y notas caramelizadas.', 
        precio: 4.25, 
        categoria_id: 1 
    },
    { 
        id: 4, 
        nombre: 'Genmaicha', 
        descripcion: 'Té verde con arroz tostado, estilo tradicional japonés.', 
        precio: 3.75, 
        categoria_id: 1 
    },
    
    // Bebidas Frías
    { 
        id: 5, 
        nombre: 'Iced Sakura Latte', 
        descripcion: 'Espresso con leche fría y jarabe de cerezo artesanal.', 
        precio: 4.50, 
        categoria_id: 2 
    },
    { 
        id: 6, 
        nombre: 'Cold Brew Uji', 
        descripcion: 'Cold brew suave con infusión de té matcha premium.', 
        precio: 4.00, 
        categoria_id: 2 
    },
    { 
        id: 7, 
        nombre: 'Sakura Soda', 
        descripcion: 'Soda artesanal con pétalos de cerezo y limón yuzu.', 
        precio: 3.50, 
        categoria_id: 2 
    },
    
    // Especiales Sakura
    { 
        id: 8, 
        nombre: 'Sakura Special Blend', 
        descripcion: 'Mezcla exclusiva con notas florales de cerezo y vainilla.', 
        precio: 5.00, 
        categoria_id: 3 
    },
    { 
        id: 9, 
        nombre: 'Kyoto Fog', 
        descripcion: 'London Fog con matcha, lavanda y leche de almendra.', 
        precio: 4.75, 
        categoria_id: 3 
    },
    
    // Desayunos
    { 
        id: 10, 
        nombre: 'Japanese Breakfast', 
        descripcion: 'Arroz, sopa miso, pescado grillé y vegetales de temporada.', 
        precio: 8.50, 
        categoria_id: 4 
    },
    { 
        id: 11, 
        nombre: 'Tamagoyaki Set', 
        descripcion: 'Tortilla japonesa dulce con arroz, sopa y encurtidos.', 
        precio: 7.50, 
        categoria_id: 4 
    },
    { 
        id: 12, 
        nombre: 'Onigiri Trio', 
        descripcion: 'Tres onigiris (salmón, umeboshi, atún) con té verde.', 
        precio: 6.50, 
        categoria_id: 4 
    },
    
    // Postres
    { 
        id: 13, 
        nombre: 'Dorayaki', 
        descripcion: 'Panqueques rellenos de anko (pasta de frijol rojo).', 
        precio: 4.50, 
        categoria_id: 5 
    },
    { 
        id: 14, 
        nombre: 'Matcha Tiramisú', 
        descripcion: 'Tiramisú con matcha, mascarpone y galletas sake.', 
        precio: 5.50, 
        categoria_id: 5 
    },
    { 
        id: 15, 
        nombre: 'Sakura Mochi', 
        descripcion: 'Mochi relleno de anko envuelto en hoja de cerezo salada.', 
        precio: 4.75, 
        categoria_id: 5 
    }
];