// Creamos elementos y modificamos css con Jquery
$("#encabezado").prepend(`<h2 class="display-4 mt-4" id="tituloGrande">Lista de Salones y Servicios</h2>
<p class="lead" id="tituloChico">Reservá los mejores salones de La Plata con los mejores servicios a tu disposición!</p>`);
$("#tituloGrande").css("font-size", "48px");
$("#tituloChico").css("font-size", "26px");
$("#gonnetEventos").css("font-size", "36px");
$("h1").css("font-size", "26px");
$("span").css("font-size","26px");

class Carrito {

    //Añadir producto al carrito
    comprarProducto(e){
        e.preventDefault();
        //Delegado para agregar al carrito
        if(e.target.classList.contains('agregar-carrito')){
            const producto = e.target.parentElement.parentElement;
            //Enviamos el producto seleccionado para tomar sus datos
            this.leerDatosProducto(producto);
        }
    }

    //Leer datos del producto
    leerDatosProducto(producto){
        const infoProducto = {
            imagen : producto.querySelector('img').src,
            titulo: producto.querySelector('h4').textContent,
            precio: producto.querySelector('.precio span').textContent,
            id: producto.querySelector('a').getAttribute('data-id'),
            cantidad: 1
        }
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (productoLS){
            if(productoLS.id === infoProducto.id){
                productosLS = productoLS.id;
            }
        });

        if(productosLS === infoProducto.id){
            Swal.fire({
                type: 'info',
                title: 'Oops...',
                text: 'El producto ya está agregado',
                showConfirmButton: false,
                timer: 1000
            })
            //console.log("Producto ya agregado")
        }
        else {
            this.insertarCarrito(infoProducto);
        }
        
    }

    //muestra producto seleccionado en carrito
    insertarCarrito(producto){
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${producto.imagen}" width=100>
            </td>
            <td>${producto.titulo}</td>
            <td>${producto.precio}</td>
            <td>
                <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
            </td>
        `;
        listaProductos.appendChild(row);
        this.guardarProductosLocalStorage(producto);

    }

    //Eliminar el producto del carrito en el DOM
    eliminarProducto(e){
        e.preventDefault();
        let producto, productoID;
        if(e.target.classList.contains('borrar-producto')){
            e.target.parentElement.parentElement.remove();
            producto = e.target.parentElement.parentElement;
            productoID = producto.querySelector('a').getAttribute('data-id');
        }
        this.eliminarProductoLocalStorage(productoID);
        this.calcularTotal();

    }

    //Elimina todos los productos
    vaciarCarrito(e){
        e.preventDefault();
        while(listaProductos.firstChild){
            listaProductos.removeChild(listaProductos.firstChild);
        }
        this.vaciarLocalStorage();

        return false;
    }

    //Almacenar en el LS
    guardarProductosLocalStorage(producto){
        let productos;
        //Toma valor de un arreglo con datos del LS
        productos = this.obtenerProductosLocalStorage();
        //Agregar el producto al carrito
        productos.push(producto);
        //Agregamos al LS
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    //Comprobar que hay elementos en el LS
    obtenerProductosLocalStorage(){
        let productoLS;

        //Comprobar si hay algo en LS
        if(localStorage.getItem('productos') === null){
            productoLS = [];
        }
        else {
            productoLS = JSON.parse(localStorage.getItem('productos'));
        }
        return productoLS;
    }

    //Mostrar los productos guardados en el LS
    leerLocalStorage(){
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (producto){
            //Construir plantilla
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${producto.imagen}" width=100>
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>
                    <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
                </td>
            `;
            listaProductos.appendChild(row);
        });
    }

    //Mostrar los productos guardados en el LS en compra.html
    leerLocalStorageCompra(){
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (producto){
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${producto.imagen}" width=100>
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>
                    <input type="number" class="form-control cantidad" min="1" value=${producto.cantidad}>
                </td>
                <td id='subtotales'>${producto.precio * producto.cantidad}</td>
                <td>
                    <a href="#" class="borrar-producto fas fa-times-circle" style="font-size:30px" data-id="${producto.id}"></a>
                </td>
            `;
            listaCompra.appendChild(row);
        });
    }

    //Eliminar producto por ID del LS
    eliminarProductoLocalStorage(productoID){
        let productosLS;
        //Obtenemos el arreglo de productos
        productosLS = this.obtenerProductosLocalStorage();
        //Comparar el id del producto borrado con LS
        productosLS.forEach(function(productoLS, index){
            if(productoLS.id === productoID){
                productosLS.splice(index, 1);
            }
        });

        //Añadimos el arreglo actual al LS
        localStorage.setItem('productos', JSON.stringify(productosLS));
    }

    //Eliminar todos los datos del LS
    vaciarLocalStorage(){
        localStorage.clear();
    }

    //Procesar pedido
    procesarPedido(e){
        e.preventDefault();

        if(this.obtenerProductosLocalStorage().length === 0){
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'El carrito está vacío, agrega algún producto',
                showConfirmButton: false,
                timer: 2000
            })
            //console.log("El carrito está vacío");
        }
        else {
            location.href = "compra.html";
        }
    }

    //Calcular montos
    calcularTotal(){
        let productosLS;
        let total = 0, iva = 0, subtotal = 0;
        productosLS = this.obtenerProductosLocalStorage();
        for(let i = 0; i < productosLS.length; i++){
            let element = Number(productosLS[i].precio * productosLS[i].cantidad);
            total = total + element;
            
        }
        
        iva = Number(total * 0.21).toFixed(2);
        subtotal = Number(total-iva).toFixed(2);

        document.getElementById('subtotal').innerHTML = "$ " + subtotal;
        document.getElementById('iva').innerHTML = "$ " + iva;
        document.getElementById('total').value = "$ " + total.toFixed(2);
    }

    obtenerEvento(e) {
        e.preventDefault();
        let id, cantidad, producto, productosLS;
        if (e.target.classList.contains('cantidad')) {
            producto = e.target.parentElement.parentElement;
            id = producto.querySelector('a').getAttribute('data-id');
            cantidad = producto.querySelector('input').value;
            let actualizarMontos = document.querySelectorAll('#subtotales');
            productosLS = this.obtenerProductosLocalStorage();
            productosLS.forEach(function (productoLS, index) {
                if (productoLS.id === id) {
                    productoLS.cantidad = cantidad;                    
                    actualizarMontos[index].innerHTML = Number(cantidad * productosLS[index].precio);
                }    
            });
            localStorage.setItem('productos', JSON.stringify(productosLS));
            
        }
        else {
            console.log("click afuera");
        }
    }
}

$("#mapa").mouseover(function () {
    console.log(`Consultó el mapa`);
});

const iFooter = document.querySelector("footer");
const eventoFooter = `mouseover`;
iFooter.addEventListener(eventoFooter, avisoFooter);
function avisoFooter() {
    console.log(`El cliente hizo un ${eventoFooter} sobre nuestras redes y contactos`);
};

// Aviso de eventos con keyboard en forms

const eventoNombre = `change`;
const nombre = document.querySelector("#nombre");
nombre.addEventListener(eventoNombre, avisoNombre);
function avisoNombre(e) {
    console.log("El nombre del cliente es: " + e.target.value);
};

const eventoTelefono = `change`
const telefono = document.querySelector("#telefono");
telefono.addEventListener(eventoTelefono, avisoTelefono);
function avisoTelefono(e) {
    Number(console.log("El teléfono del cliente es: " + e.target.value));
};

const eventoMail = `change`
const mail = document.querySelector("#mail");
mail.addEventListener(eventoMail, avisoMail);
function avisoMail(e) {
    let mail = console.log("El e-mail del cliente es: " + e.target.value);
};

const eventoConsulta = `change`
const consulta = document.querySelector("#consulta");
consulta.addEventListener(eventoConsulta, avisoConsulta);
function avisoConsulta(e) {
    let consultaRes = console.log("La consulta del cliente es: " + e.target.value);

};


// Yapa de LS

localStorage.setItem(`nombreProfe`, `Carolina Lemes`);
localStorage.setItem(`profesora`, true);
localStorage.setItem(`nota de la entrega`, 10);
localStorage.setItem(`Aprové!`, false);

let nombre1 = localStorage.getItem(`nombreProfe`);
let profe1 = (localStorage.getItem(`tutor`)) == `true`;
let nota = Number(localStorage.getItem(`nota de la entrega`));
let pregunta = (localStorage.getItem(`tutor`)) == `false`;
console.log(`Tu nombre es: ` + nombre1);
console.log(`Es Carlona Lemes la profesora?: ` + profe1);
console.log(`¿Qué nota me puso en la entrega?: ` + nota);

localStorage.removeItem(`Aprové!`);

const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://community-open-weather-map.p.rapidapi.com/weather?q=La%20Plata&lat=LaPlata&lon=LaPlata&callback=test&id=2172797&lang=null&units=metric&mode=xml",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
		"x-rapidapi-key": "SIGN-UP-FOR-KEY"
	}
};

$.ajax(settings).done(function (response) {
	console.log(response);
});