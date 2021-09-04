"use strict";

//evento para cargar la pagina

document.addEventListener('DOMContentLoaded', loadPage);

function loadPage () {
    
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');   
    let color = document.getElementById("color-picker").value;  //traer el valor desde la paleta de colores
    let dibujando = false;


//evento para obtener el color

    document.getElementById("color-picker").addEventListener("change", function (e){
            color = document.getElementById("color-picker").value;
            console.log(color);
    });


//evento para habilitar el lapiz

    document.getElementById("pencil").addEventListener("click", function(e){    //se clickea sobre el lapiz
            
        document.querySelector("#sliderPencil").classList.toggle("on-slider");  //depega el slider

        ctx.strokeStyle = color;    //se obtiene el color del lapiz
        let trazoLapiz = document.getElementById("pencilThickness").value;  //se obtine el valor desde el slider (falta arreglar)
        ctx.lineWidth = trazoLapiz;    
        iniciarLapiz()
    });


//evento del boton borrrar

    document.getElementById("eraser").addEventListener("click", function(e){

        document.querySelector("#sliderEraser").classList.toggle("on-slider");  //depega el slider

        ctx.strokeStyle = '#ffffff';
        let trazoBorrado = document.getElementById("eraserThickness").value;  //se obtine el valor desde el slider (falta arreglar)
        ctx.lineWidth = trazoBorrado;
        iniciarLapiz()
        dibujar(e);
    });


//evento del slider de brillo

    document.querySelector("#brightness").addEventListener("click", function(e) {
        document.querySelector("#slider").classList.toggle("on-slider");
        menu.classList.toggle("desplegarNav");
    });


//evento para limpiar el canvas

    document.getElementById("reset").addEventListener("click", function(e){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });


//funcion para obtener los movimientos del puntero

    function iniciarLapiz(){  

        canvas.addEventListener('mousedown', function(e){    //cuando se comienza a mover el mouse 
            ctx.beginPath();
            dibujando = true;  
        })
    
        canvas.addEventListener('mousemove', dibujar)   //mientras se esta moviendo, llama a dibujar()

        canvas.addEventListener('mouseup', function(e){     //cuando termina de moverse
            ctx.closePath();
            dibujando = false;
        })
    }


//esta funcion sirve tanto para dibujar como para borrar

    function dibujar(e){

        if (dibujando == true){

            ctx.lineCap = "round";
            ctx.lineTo(e.offsetX, e.offsetY);   // ubicamos para dibujar en el primer punto
            ctx.stroke();
            ctx.moveTo(e.offsetX, e.offsetY);   

        }
    }
    

/////////////////////////////////////////////////REVISAR///////////////////////////////////////////////////////  

//imagen precargada, arreglar para cuando se quiere cargar desde la pagina

function loadImage (image){
    ctx.drawImage(image, 0, 0);
}

let image1 = new Image();
image1.src = "../img/imagenDePrueba.jpg"
image1.onload = function(){
    loadImage(this)
}


//evento para seleccionar el filtro

    document.getElementById("filter-select").addEventListener("click", function(){

    
        let filtro = document.getElementById("filter-select").value;

        
        if (filtro == "negativo"){   //si el filtro seleccionado es..

            filterNegativo();   
        }

        if (filtro == "saturacion"){
            //hacer
        } 

        if (filtro == "sepia"){
            //hacer
        } 

        if (filtro == "blur"){
            //hacer
        }

        if (filtro == "binarizacion"){
            //hacer
        }

    })


 //funcion para el filtro negativo

    function filterNegativo(){     

        let imageData = ctx.createImageData(canvas.width, canvas.height);
        console.log(imageData)

        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                
                let r = getRed(imageData, x, y);
                let g = getGreen(imageData, x, y);
                let b = getBlue(imageData, x, y);
                let a = 255;
        
                setPixel(imageData, x, y, r, g, b, a);
            }
        }
        ctx.putImageData(imageData, 0, 0)
        
    }


//funcion para pintar los pixeles

    function setPixel(imageData, x, y, r, g, b, a){
                
        let index = ( x + y * imageData.width) * 4;
        imageData.data[index + 0] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = a;
    }


//funcion para obtener R
    function getRed(imageData, x, y){

        let index = ( x + y * imageData.width) * 4;
        return imageData.data[index + 0];
    }


//funcion para obtener G
    function getGreen(imageData, x, y){

        let index = ( x + y * imageData.width) * 4;
        return imageData.data[index + 1];
    }


//funcion para obtener B
    function getBlue(imageData, x, y){

        let index = ( x + y * imageData.width) * 4;
        return imageData.data[index + 2];
    }
}