// MenuItem.js - Versión mejorada con badges opcionales
import React from 'react';
import './MenuItem.css';

function MenuItem({ item, onAddToCart }) {
    // Obtener imagen según el tipo de producto
    const getItemImage = (nombre) => {
        // Bebidas calientes
        if (nombre.includes('Chai Latte')) return 'https://imag.bonviveur.com/chai-latte.jpg';
        if (nombre.includes('Chocolate Caliente')) return 'https://images.cookforyourlife.org/wp-content/uploads/2015/08/high_protein_hot_chocolate.jpg';
        if (nombre.includes('Espresso Sakura')) return 'https://thumbs.dreamstime.com/b/caf%C3%A9-taza-arte-de-con-leche-flores-cerezo-rosa-primavera-est%C3%A9tica-la-ma%C3%B1ana-bebida-cafe%C3%ADna-relajarse-una-est%C3%A1-rodeada-que-372235036.jpg';
        if (nombre.includes('Genmaicha')) return 'https://replantea.es/cdn/shop/articles/Te_Genmaicha.jpg?v=1629390281';
        if (nombre.includes('Hojicha Latte')) return 'https://www.splenda.com/wp-content/uploads/2023/05/Iced-Creamy-Matcha-website-1078-scaled.jpg';
        if (nombre.includes('Latte')) return 'https://richingmatcha.com/wp-content/uploads/2025/01/17-1.jpg';
        if (nombre.includes('Latte Tradicional')) return 'https://es.everydaydose.com/cdn/shop/articles/Matcha_and_Milk.webp?v=1735565996';
        if (nombre.includes('Té de Hierbas Relajante')) return 'https://www.churreriascibeles.es/wp-content/uploads/2023/04/Dise%C3%B1o-sin-t%C3%ADtulo-1.png';
        
        // Bebidas frías
        if (nombre.includes('Chai Latte Frío')) return 'https://cafesgranell.es/modules/ph_simpleblog/covers/39.png';
        if (nombre.includes('Sakura Té Frío')) return 'https://img.puntodete.com/stupload/stblog/1/198/120/198120large.jpg';
        if (nombre.includes('Té Frío')) return 'https://www.latiendadelbarman.com/wp-content/uploads/2024/06/LTDB-06-Te-Frio.webp';

        // Desayunos
        if (nombre.includes('American Breakfast')) return 'https://scontent.fltx4-1.fna.fbcdn.net/v/t1.6435-9/44506947_2293175937362559_1012539270176440320_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHP2NscweVgdImn8ukvXG3UCEJmB6PJMxcIQmYHo8kzFz1O_T2sMJEiwYjyXsMymvIsQgOhfXg0H3TGcppUwxjD&_nc_ohc=IvsL1_ckfnkQ7kNvwHtO_0o&_nc_oc=Admfy5MkEZ7rcNIJIoZctppNR8HJ79ZtG6piJCWDR8nxiBe2mVf-Xze3WrkRaCxAfVY&_nc_zt=23&_nc_ht=scontent.fltx4-1.fna&_nc_gid=GrIZLOU8Ueo2Kwp_RuBDtQ&oh=00_AfoA5D0sWLV_lIAYc39Gn7IwKwvggW1i25Dau7e6kQrkmQ&oe=6993B8F2';
        if (nombre.includes('Avocado Toast')) return 'https://res.cloudinary.com/pabloem/f_auto,c_limit,w_3840,q_auto/v1629462044/IMG_20210209_121018_heqsgk.jpg';
        if (nombre.includes('Classic Breakfast')) return 'https://us.123rf.com/450wm/gorov108/gorov1081604/gorov108160400394/55290417-breakfast-with-scrambled-eggs-toast-and-jam-in-cafe.jpg';
        if (nombre.includes('Morning Boost')) return 'https://www.piloncilloyvainilla.com/wp-content/uploads/2016/01/Acai-smoothie-bowls.piloncilloyvainilla.com-3.jpg';
        if (nombre.includes('Omelette')) return 'https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000779%2Fv5%2Frect.jpeg';
        if (nombre.includes('Sweet Breakfast')) return 'https://tiendasmartbrands.com/cdn/shop/articles/Tostadas_francesas_con_frutas.jpg?v=1729535264';
        if (nombre.includes('Sweet Morning')) return 'https://equilibratesv.com/wp-content/uploads/2018/06/Pancakes-14-1200x715.jpg';
        if (nombre.includes('Sweet Morning Stacks (Vegan)')) return 'https://lacampagnola.com/uploads/recipes/5dd7d7685851b.jpg';
        if (nombre.includes('Vegan Nut & Banana Toast')) return 'https://gourmet.iprospect.cl/wp-content/uploads/2023/12/PAN-CON-MANTE.jpg';


        // Postres
        if (nombre.includes('Blondie de Caf')) return 'https://www.casaluker.com/wp-content/uploads/2023/10/Easy-Traybake-Chocolate-Chip-Blondies.jpg';
        if (nombre.includes('Brownie con Helado y Crema')) return 'https://www.clarin.com/2015/03/20/S1-cIDZRXe_1200x0.jpg';
        if (nombre.includes('Cheesecake de la Casa')) return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL6jNJdO1InPusP7w5M1Ujq011dgHPQZ2f2g&s';
        if (nombre.includes('Pan de Banano')) return 'https://cookingwithdog.com/wp-content/uploads/2017/03/banana-bread-00-1024x576.jpg';
        if (nombre.includes('Pie de Manzana')) return 'https://comedera.com/wp-content/uploads/sites/9/2015/02/receta-de-pie-de-manzana.jpg';
        if (nombre.includes('Tiramisú')) return 'https://www.recetasnestle.com.ec/sites/default/files/srh_recipes/7f45d6f8807ebc775928651a3398dce9.png';

        // Sandwiches
        if (nombre.includes('Katsu Sando')) return 'https://www.vvsupremo.com/wp-content/uploads/2015/11/900X570_Grilled-Cheese-Sandwich.jpg';
        if (nombre.includes('Sándwich de la Casa')) return 'https://i.ytimg.com/vi/asZVuQk1nJ0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDWj0SUrKPUIRcEGbkdCeZP3sfPsg';
        if (nombre.includes('Sándwich de Pollo')) return 'https://images.aws.nestle.recipes/original/4f7d2cef57bfb6c209fa64494de20a1d_sanduche-de-pollo-y-champinones.jpg';
        if (nombre.includes('Sándwich de Queso')) return 'https://www.lechedeflorida.com/file/267/grilled-cheese-web.png';
        if (nombre.includes('Sándwich Pesto')) return 'https://rms-media-prod.generalmills.com/6111752c-cf53-491d-82e7-bae2e343f08f.jpg';
        if (nombre.includes('Tamago Sando')) return 'https://www.andy-cooks.com/cdn/shop/articles/20240613011505-andy-20cooks-20-20tamago-20egg-20sando.jpg?v=1718518606';
        if (nombre.includes('Teriyaki Chicken Sando')) return 'https://kikkomanusa.com/foodservice/wp-content/uploads/sites/2/2022/02/Chef-Stein_Honey_Teriya-Q_Katsu_Sando_Hero.jpg';

        //Picaditas
        if (nombre.includes('Extra Papas Fritas')) return 'https://reservalamakina.com/wp-content/uploads/2021/05/Papas-Fritas.jpg';
        if (nombre.includes('Nachos con Queso')) return 'https://i.pinimg.com/736x/10/b7/07/10b7076561649cf63c0b4c7f281760db.jpg';
        if (nombre.includes('Nachos Mixtos')) return 'https://cdn0.uncomo.com/es/posts/5/1/9/como_hacer_nachos_con_carne_picada_39915_orig.jpg';
        if (nombre.includes('Papas Fritas')) return 'https://tomaleche.com/wp-content/uploads/sites/2/2021/06/GettyImages-921916164-scaled.jpg';
        if (nombre.includes('Postre')) return 'https://ejemplo.com/postre.jpg';
        
        // Bowls
        if (nombre.includes('Açaí Bowl')) return 'https://blog.pucheromix.com/wp-content/uploads/2023/11/acai-bowl.jpg';
        if (nombre.includes('Bowl de Avena')) return 'https://cdn3.myrealfood.app/recipes%2F7cxj1iA82h2733nKJVIg%2Fmain_0_1727904679981.jpg?alt=media&token=06276f5c-8b12-421a-a69d-e329ec6d4f74';
        if (nombre.includes('Smoothie Bowl')) return 'https://images.immediate.co.uk/production/volatile/sites/30/2022/12/Smoothie-bowl-16df176.jpg?quality=90&resize=500,454';

        // Cafe
        if (nombre.includes('Americano')) return 'https://i.blogs.es/139e0f/cafe-americano2/840_560.jpeg';
        if (nombre.includes('Cappuccino')) return 'https://www.cuisinart.com/dw/image/v2/ABAF_PRD/on/demandware.static/-/Sites-us-cuisinart-sfra-Library/default/dw30047d66/images/recipe-Images/cappuccino1-recipe.jpg?sw=1200&sh=1200&sm=fit';
        if (nombre.includes('Doppio')) return 'https://lamafia.es/wp-content/uploads/2019/08/espresso-doppio.png';
        if (nombre.includes('Espresso')) return 'https://barista-espresso.es/cdn/shop/articles/espresso-101-lar-dig-grunderna-i-espresso-962632_1024x1024.webp?v=1718937966';
        if (nombre.includes('Flat White')) return 'https://www.lavazzausa.com/es/recipes-and-coffee-hacks/como-hacer-cafe-flat-white/_jcr_content/root/cust/customcontainer/image.coreimg.jpeg/1747815664322/d-m-how-to-slot-1-large%402.jpeg';
        if (nombre.includes('Macchiato')) return 'https://images.ctfassets.net/v601h1fyjgba/6cbjpHEL7rgkICqBJ7870c/287cdae30aeea24586efe350ebe3cadd/Macchiato_COMP.jpg';
        if (nombre.includes('Mocaccino')) return 'https://www.dersut.it/media/79/fd/7c/1707226091/mocaccino-come%20prepararlo%20in%20casa.png?ts=1707408515';
        if (nombre.includes('Signature Cappuccino')) return 'https://cdn.shopify.com/s/files/1/0093/2537/9669/files/shutterstock_1037995357_2048x2048.jpg?v=1593037563';

        // Aguas
        if (nombre.includes('Agua con gas')) return 'https://solandecabras.es/wp-content/uploads/2025/07/ingredientes-agua-con-gas-scaled.jpg';
        if (nombre.includes('Agua sin gas')) return 'https://img.freepik.com/fotos-premium/agua-fresca-gas-sobre-fondo-gris-burbujas-agua-vertiendo-agua-botella-plastico-vaso_349584-29.jpg';
        if (nombre.includes('Coca-Cola')) return 'https://media.istockphoto.com/id/487787108/es/foto/can-of-coca-cola-sobre-hielo.jpg?s=612x612&w=0&k=20&c=P9lW89YLz4kdzrvj4TItEAS10J_wDAq3fAd21vVdk-c=';
        if (nombre.includes('Fanta')) return 'https://marketing-interactive-assets.b-cdn.net/images/sg/content-images/tiktok/fanta_old_logo_refresh.jpg';
        if (nombre.includes('Fioravanti')) return 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiC094qHKl-4VNazEEqytPkbE05O-FvW67NPmQX5xUWr1IkB-bdrESB8yl34wWm639Y9qCLjmP75Z0t9B9iVNM_Zagn18cD6blqP12XS931m49jS_hh49IZb-ccWu4py6j2XlptHZluWrx6/s1600/fioravanti1.jpg';
        if (nombre.includes('Sprite')) return 'https://t3.ftcdn.net/jpg/02/86/26/86/360_F_286268644_FJxZ9RW8bXWWiaZgKajwnwEZ61ynkfOp.jpg';

        // Jugos
        if (nombre.includes('Jugo de Frutilla')) return 'https://www.recetasnestle.com.ec/sites/default/files/styles/cropped_recipe_card_new/public/srh_recipes/8e8772c834252d703304daa64fa52ee1.jpg.webp?itok=aq6w6szr';
        if (nombre.includes('Jugo de Mora')) return 'https://i.pinimg.com/736x/f3/14/c8/f314c86ef1705fbe0b1c63c8d71e7e8e.jpg';
        if (nombre.includes('Jugo de Naranja')) return 'https://recetasdecocina.elmundo.es/wp-content/uploads/2024/02/zumo-naranja.jpg';
        if (nombre.includes('Limonada Imperial')) return 'https://img.eldiario.ec/upload/2026/01/17161D524C43456D14140F55554947771F171718534241721D11-2000x1125.jpg';
        if (nombre.includes('Limonada Rosada')) return 'https://instituto.splenda.la/wp-content/uploads/2024/03/limonada-rosa.jpg';

        // Crepes
        if (nombre.includes('Crepé Arequipe y Queso')) return 'https://www.elespectador.com/resizer/zgHPhqgu95HeXR4uRLliOCe3oxw=/arc-anglerfish-arc2-prod-elespectador/public/5FV4P2YRGND5PEIACRLHZXUC7Q.jpg';
        if (nombre.includes('Crepé Veggie')) return 'https://theveganhopper.com/wp-content/uploads/2021/01/Crepes-veganos.png';
        if (nombre.includes('Crispy Kiss Crepe')) return 'https://res.cloudinary.com/jerrick/image/upload/c_scale,f_jpg,q_auto/633860152df1160020838c8e.jpg';
        if (nombre.includes('Veggie Waffle')) return 'https://assets.epicurious.com/photos/59482871183afa60aeb90b32/6:4/w_1600%2Cc_limit/Sweet%2520Potato%2520Waffle%252006192017.jpg';
        if (nombre.includes('Waffle de Arequipe con Helado')) return 'https://media-cdn.tripadvisor.com/media/photo-s/05/d1/cc/67/waffle-de-arequipe-con.jpg';
        if (nombre.includes('Waffle de Frutos del Bosque')) return 'https://www.unileverfoodsolutions.com.mx/dam/global-ufs/mcos/NOLA/calcmenu/recipes/MX-recipes/In-Development/FULL-WAFFLES.png';
        if (nombre.includes('Waffle de Mantequilla y Miel')) return 'https://img.freepik.com/fotos-premium/waffle-mantequilla-miel_1339-10993.jpg';
        if (nombre.includes('Waffle de Nutella y Banano')) return 'https://media-cdn.tripadvisor.com/media/photo-s/12/0b/46/24/un-delicioso-waffle-de.jpg';
        
        // Adicionales
        if (nombre.includes('Caramelo')) return 'https://cdn.recetasderechupete.com/wp-content/uploads/2020/05/Salsa-caramelo-salado-toffee.jpg';
        if (nombre.includes('Chocolate')) return 'https://i.ytimg.com/vi/8pQLPqIIB_o/maxresdefault.jpg';
        if (nombre.includes('Crema')) return 'https://laalemanacomidas.com.ar/wp-content/uploads/2020/04/crema-chantilly-light2.jpg';
        if (nombre.includes('Fruta Picada')) return 'https://t3.ftcdn.net/jpg/00/88/34/74/360_F_88347497_UIbtGCNpBvyP7xsk7tyeygaUq7U0ARWV.jpg';
        if (nombre.includes('Helado')) return 'https://i.pinimg.com/736x/85/a3/34/85a33408b07113139bc3238d48255de7.jpg';
        if (nombre.includes('Huevo')) return 'https://tofuu.getjusto.com/orioneat-local/resized2/jRcQrhqquPBpCAp7K-2400-x.webp';
        if (nombre.includes('Jarabe')) return 'https://www.farmaciagamo.com/media/magefan_blog/2023/jarabe-tos-seca-tos-mocos.jpg';
        if (nombre.includes('Leche de Almendras')) return 'https://deliciaskitchen.b-cdn.net/wp-content/uploads/2015/07/leche-de-almendras.jpg';
        if (nombre.includes('Queso')) return 'https://www.annarecetasfaciles.com/files/img_5118-scaled.jpg';
        if (nombre.includes('Tocino')) return 'https://img.freepik.com/fotos-premium/porcion-tocino-frito_846485-13463.jpg';

        // Si no hay coincidencia, imagen por defecto
        return 'https://ejemplo.com/default.jpg';
    };

    // Función para formatear precio seguro
    const formatPrice = (price) => {
        const priceNumber = typeof price === 'number' ? price : parseFloat(price);
        return (priceNumber || 0).toFixed(2);
    };

    // Determinar si es nuevo (ejemplo: agregado en los últimos 7 días)
    const esNuevo = item.fecha_creacion ? 
        (new Date() - new Date(item.fecha_creacion)) < (7 * 24 * 60 * 60 * 1000) : 
        false;

    // Determinar si es popular (ejemplo: si tiene muchas ventas)
    const esPopular = item.ventas ? item.ventas > 50 : false;

    return (
        <div className="menu-item-card">
            {/* Badges opcionales */}
            {esNuevo && <div className="new-badge">NUEVO</div>}
            {esPopular && <div className="popular-badge">POPULAR</div>}
            
            {/* Cambiar div por img */}
            <div className="item-image-container">
                <img 
                    src={getItemImage(item.nombre)} 
                    alt={item.nombre}
                    className="item-image"
                    onError={(e) => {
                        // Si la imagen falla, mostrar un placeholder
                        e.target.src = 'https://ejemplo.com/placeholder.jpg';
                    }}
                />
            </div>
            
            <div className="item-content">
                <div className="item-header">
                    <h3 className="item-name">{item.nombre}</h3>
                    <div className="price-badge">${formatPrice(item.precio)}</div>
                </div>
                
                <p className="item-description">{item.descripcion}</p>
                
                <button 
                    className="cart-add-btn"
                    onClick={onAddToCart}
                >
                    <span className="cart-icon">🛒</span>
                    Agregar al carrito
                </button>
            </div>
        </div>
    );
}

export default MenuItem;