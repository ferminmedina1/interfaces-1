"use strict";

document.addEventListener('DOMContentLoaded', loadPage);

function loadPage () {
    
    document.querySelector("#brightness").addEventListener("click", function(e) {
        document.querySelector("#slider").classList.toggle("on-slider");
        menu.classList.toggle("desplegarNav");
    });
    
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');
    let rect = canvas.getBoundingClientRect(); //obtiene la posicion del canvas
    let x = 0, y =0;
    let dibujando = false;
    let color = document.getElementById("color-picker").value;
    let eraser = false;
    
    document.getElementById("color-picker").addEventListener("change", function (e){
            color = document.getElementById("color-picker").value;
        console.log(color);
    });
    
    canvas.addEventListener('mousedown', function(e){
       x = e.clientX  - rect.left; //left porque hablamos de la x
       y = e.clientY - rect.top;
       //"e.clientX" devuelve la poscion en x respecto la pantalla 
       // "e.clientX" devuelve la poscion en x respecto al canvas
       dibujando = true;
    });
    
    canvas.addEventListener('mousemove', function(e){
        if(dibujando == true){
            dibujar(x, y, e.clientX - rect.left, e.clientY - rect.top);
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
    });
    
    canvas.addEventListener('mouseup', function(e){
        if(dibujando == true){
            dibujar(x, y, e.clientX - rect.left, e.clientY - rect.top);
            x = 0;
            y = 0;
            dibujando = false;
        }
    });
    
    function dibujar(x1,y1,x2,y2){
        ctx.beginPath();
        if(eraser != true) //si esta la opcion de borrador prendida se pinta de blanco
            ctx.strokeStyle = color;
        else{
            ctx.strokeStyle = '#ffffff';
        }
        ctx.lineWidth = 5;
        ctx.moveTo(x1,y1);// ubicamos para dibujar en el primer punto
        ctx.lineTo(x2,y2);// creamos una linea al segundo punto
        ctx.stroke();//definimos la lines
        ctx.closePath();
    }
    
    document.getElementById("pencil").addEventListener("click", function(e){
        eraser = false;
        ctx.strokeStyle = color;
    });

    document.getElementById("eraser").addEventListener("click", function(e){
        eraser = true;
    });

    document.getElementById("reset").addEventListener("click", function(e){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}