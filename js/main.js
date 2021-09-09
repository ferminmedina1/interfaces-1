"use strict";

//evento para cargar la pagina

document.addEventListener('DOMContentLoaded', loadPage);

function loadPage () {
    
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');   
    let color = document.getElementById("color-picker").value;  //traer el valor desde la paleta de colores
    let dibujando = false;
    habilitarFiltros();

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


//evento del slider de brillo

   document.querySelector("#restBrightness").addEventListener("click", function(e) {
       filterBrillo(-3);
    });

    document.querySelector("#plusBrightness").addEventListener("click", function(e) {
        filterBrillo(3);
     });
 

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
        var reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = function (e) {
          var myImage = new Image(); // Crea la imageb
          myImage.src = e.target.result; 
          myImage.onload = function() {
              canvas.width = myImage.width; // Assigns image's width to canvas
              canvas.height = myImage.height; // Assigns image's height to canvas
              ctx.drawImage(myImage, 0, 0);
              accionarLapiz();
          }
        }
      }
    });



//evento para seleccionar el filtro

function habilitarFiltros(){

    let botones = document.querySelectorAll("button");  //se obtienen los botones

    for(let i=0; i < botones.length; i++) {   //se recorre el arreglo de botones

        botones[i].addEventListener("click", function(){    //si se hace click se crea el evento
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            if (botones[i].value == "negativo"){   //si el filtro seleccionado es..
                filterNegativo(imageData);   
            }

            if (botones[i].value == "saturacion"){
                filterSaturacion(imageData);
            }

            if (botones[i].value == "binarizacion"){
                filterBinarizacion(imageData)
            }

            if (botones[i].value == "sepia"){
                //hacer
            } 

            if (botones[i].value == "blur"){
                filterBlur(imageData);
            }
        
        })

    }
}


function filterBlur(imagen) {
    let matrizFiltro = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];
    return apFiltro(imagen);
}

//funcion para el filtro negativo

function filterNegativo(imageData){     
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


//funcion de para filtro de saturacion

function filterSaturacion(imageData){
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            
            let r = getRed(imageData, x, y);
            let g = getGreen(imageData, x, y);
            let b = getBlue(imageData, x, y);
            let a = 255;
            let hsv = rgbToHsv (r, g, b);
            hsv.s += 5;
            let jsonRGB = HSVtoRGB(hsv)
            r = jsonRGB.r
            g = jsonRGB.g
            b = jsonRGB.b
            setPixel(imageData, x, y, r, g, b, a);
        }
    }
    ctx.putImageData(imageData, 0, 0);

}


//funcion para filtro de brillo

function filterBrillo(brillo){

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log(brillo);
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            
            let r = getRed(imageData, x, y);
            let g = getGreen(imageData, x, y);
            let b = getBlue(imageData, x, y);
            let a = 255;
            let hsv = rgbToHsv (r, g, b);
            hsv.v += brillo;
            let jsonRGB = HSVtoRGB(hsv)
            r = jsonRGB.r
            g = jsonRGB.g
            b = jsonRGB.b
            setPixel(imageData, x, y, r, g, b, a);
        }
    }
    ctx.putImageData(imageData, 0, 0);

}


//funcion para filtro de binarizacion

function filterBinarizacion(imageData){
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            
            let r = getRed(imageData, x, y);
            let g = getGreen(imageData, x, y);
            let b = getBlue(imageData, x, y);
            let a = 255;
            let gray =  (0.299 * r + 0.587 * g + 0.114 * b)
            if ( gray > 120 ){
                r = 255;
                g = 255;
                b = 255;
            }
            else{
                r = 0;
                g = 0;
                b = 0;
            }
            setPixel(imageData, x, y, r, g, b, a);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

//funcion para pasar de rgb a hsb

function rgbToHsv (r, g, b) {

    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: percentRoundFn(s * 100),
        v: percentRoundFn(v * 100)
    };
}


//funcion para pasar de HSV a RGB

function HSVtoRGB(hsv) {

var rgb = { };
var h = Math.round(hsv.h);
var s = Math.round(hsv.s * 255 / 100);
var v = Math.round(hsv.v * 255 / 100);

    if (s == 0) {

    rgb.r = rgb.g = rgb.b = v;
    } else {
    var t1 = v;
    var t2 = (255 - s) * v / 255;
    var t3 = (t1 - t2) * (h % 60) / 60;

        if (h == 360) h = 0;

            if (h < 60) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3 }
            else if (h < 120) { rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3 }
            else if (h < 180) { rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3 }
            else if (h < 240) { rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3 }
            else if (h < 300) { rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3 }
            else if (h < 360) { rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3 }
            else { rgb.r = 0; rgb.g = 0; rgb.b = 0 }
    }

return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) };
}

function apFiltro(imageData) {

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            let r=0, g=0, b=0;
            if  ((x + 1 < canvas.width) && (x - 1 >= 0) && (y + 1 < canvas.height) && (y - 1 >= 0)) {           
                r = getRed(imageData,x-1,y+1) + getRed(imageData,x - 1, y + 1) + getRed(imageData,x, y + 1) +  getRed(imageData,x + 1, y + 1) + getRed(imageData,x - 1, y)+getRed(imageData,x, y)+ getRed(imageData,x+1, y) + getRed(imageData,x-1, y-1) + getRed(imageData,x, y-1) +getRed(imageData,x+1, y-1);
                g = getGreen(imageData,x-1,y+1) + getGreen(imageData,x - 1, y + 1) + getGreen(imageData,x, y + 1) +  getGreen(imageData,x + 1, y + 1) + getGreen(imageData,x - 1, y)+getGreen(imageData,x, y)+ getGreen(imageData,x+1, y) + getGreen(imageData,x-1, y-1) + getGreen(imageData,x, y-1) +getGreen(imageData,x+1, y-1);
                b = getBlue(imageData,x-1,y+1) + getBlue(imageData,x - 1, y + 1) + getBlue(imageData,x, y + 1) +  getBlue(imageData,x + 1, y + 1) + getBlue(imageData,x - 1, y)+getBlue(imageData,x, y)+ getBlue(imageData,x+1, y) + getBlue(imageData,x-1, y-1) + getBlue(imageData,x, y-1) +getBlue(imageData,x+1, y-1);
                setPixel(imageData,x, y,r/9,g/9,b/9,255);
            }
        }
    }
    ctx.putImageData(imageData,0,0);
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