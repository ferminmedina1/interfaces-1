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
            ctx.strokeStyle = color;
            console.log(color);
    });


//evento para habilitar el lapiz

    document.getElementById("pencil").addEventListener("click", function(e){    //se clickea sobre el lapiz
        accionarLapiz();
    });

    document.getElementById("pencilThickness").addEventListener("change", function(e){
        accionarLapiz();
    });

    function accionarLapiz(){
        ctx.strokeStyle = color;    //se obtiene el color del lapiz
        let trazoLapiz = document.getElementById("pencilThickness").value;  //se obtine el valor desde el slider (falta arreglar)
        ctx.lineWidth = trazoLapiz;    
        iniciarLapiz();
    }


//evento del boton borrrar

    document.getElementById("eraser").addEventListener("click", function(e){
        accionarBorrador();
    });

    document.getElementById("eraserThickness").addEventListener("change", function(e){
        accionarBorrador();
    });

    function accionarBorrador(){
        ctx.strokeStyle = '#ffffff';
        let trazoBorrado = document.getElementById("eraserThickness").value;
        ctx.lineWidth = trazoBorrado;
        iniciarLapiz();
    }


//evento del slider de brillo

    document.querySelector("#brightness").addEventListener("click", function(e) {
       //hacer
    });


//evento para limpiar el canvas

    document.getElementById("reset").addEventListener("click", function(e){
        let response = confirm("Esta seguro que quiere eliminar su obra de arte?");
        if(response){
            canvas.width = 800;
            canvas.height = 500;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });

    document.getElementById("download").addEventListener("click", function(e){
        let link = document.createElement('a');
        link.download = 'canvas.png';
        link.href = document.getElementById('canvas').toDataURL()
        link.click();
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



    let imgInput = document.getElementById('myFile');
    imgInput.addEventListener('change', function(e) {
      if(e.target.files) {
        let imageFile = e.target.files[0]; //aca obtenemos el archivo
        var reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = function (e) {
          var myImage = new Image(); // Crea la imageb
          myImage.src = e.target.result; 
          myImage.onload = function() {
              canvas.width = myImage.width; // Assigns image's width to canvas
              canvas.height = myImage.height; // Assigns image's height to canvas
              ctx.drawImage(myImage, 0, 0);
          }
        }
      }
    });



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
        document.getElementById("filter-select").selectedIndex = 0;
    })


 //funcion para el filtro negativo

    function filterNegativo(){     
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        console.log(imageData)

        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                
                let r = getRed(imageData, x, y);
                r = 255 - r;
                let g = getGreen(imageData, x, y);
                g = 255 - g;
                let b = getBlue(imageData, x, y);
                b = 255 - b;
                let a = 255;
        
                setPixel(imageData, x, y, r, g, b, a);
            }
        }
        ctx.putImageData(imageData, 0, 0);
        
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