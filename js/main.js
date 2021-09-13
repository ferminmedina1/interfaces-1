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

    canvas.addEventListener("mouseleave", function(e){ //si se va del canvas deja de dibujar!
        dibujando = false;
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
 

//evento para limpiar el canvas

    document.getElementById("reset").addEventListener("click", function(e){
        let response = confirm("Esta seguro que quiere eliminar su obra de arte?");
        if(response){
            canvas.width = 800;
            canvas.height = 500;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            accionarLapiz();
        }
    });


//evento para descargar imagen

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

//cargar imagen
    let imgInput = document.getElementById('myFile');

    imgInput.addEventListener('change', function(e) {
        if(e.target.files) {
            let imageFile = e.target.files[0]; //aca obtenemos el archivo
            let reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onloadend = function (e) {
                let myImage = new Image(); // Crea la imagen
                myImage.src = e.target.result; 
                myImage.onload = function() {
                        if(myImage.width <= 1920 && myImage.height <= 1080){
                        canvas.width = myImage.width; // Assigns image's width to canvas
                        canvas.height = myImage.height; // Assigns image's height to canvas
                        ctx.drawImage(myImage, 0, 0);
                        accionarLapiz();
                        }
                        else{
                            alert("Porfavor, eliga una imagen con una proporción igual o menor a 1920x1080.");
                        }
                }
            }
        }
        imgInput.value = '';
    });

}