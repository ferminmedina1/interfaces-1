"use strict";

//evento para cargar la pagina

document.addEventListener('DOMContentLoaded', loadPage);

function loadPage () {
    
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');   
    habilitarFiltros();
    
    document.querySelector("#restBrightness").addEventListener("click", function(e) {
        filterBrillo(-3);
    });
    
    document.querySelector("#plusBrightness").addEventListener("click", function(e) {
        filterBrillo(3);
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
                    filterSepia(imageData)
                } 

                if (botones[i].value == "blur"){
                    filterBlur(imageData);
                }
            
            })
        }
    }


//funcion para filtro blur

    function filterBlur(imageData) {

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                let r=0, g=0, b=0;
                
                if  ((x + 1 < canvas.width) && (x - 1 >= 0) && (y + 1 < canvas.height) && (y - 1 >= 0)) {      
                                                                                                            //se obtienen los valores de los vecinos
                    r = getRed(imageData,x-1,y+1) + getRed(imageData,x - 1, y + 1) + getRed(imageData,x, y + 1) +  getRed(imageData,x + 1, y + 1) + getRed(imageData,x - 1, y)+getRed(imageData,x, y)+ getRed(imageData,x+1, y) + getRed(imageData,x-1, y-1) + getRed(imageData,x, y-1) +getRed(imageData,x+1, y-1);
                    g = getGreen(imageData,x-1,y+1) + getGreen(imageData,x - 1, y + 1) + getGreen(imageData,x, y + 1) +  getGreen(imageData,x + 1, y + 1) + getGreen(imageData,x - 1, y)+getGreen(imageData,x, y)+ getGreen(imageData,x+1, y) + getGreen(imageData,x-1, y-1) + getGreen(imageData,x, y-1) +getGreen(imageData,x+1, y-1);
                    b = getBlue(imageData,x-1,y+1) + getBlue(imageData,x - 1, y + 1) + getBlue(imageData,x, y + 1) +  getBlue(imageData,x + 1, y + 1) + getBlue(imageData,x - 1, y)+getBlue(imageData,x, y)+ getBlue(imageData,x+1, y) + getBlue(imageData,x-1, y-1) + getBlue(imageData,x, y-1) +getBlue(imageData,x+1, y-1);
                   
                    setPixel(imageData, x, y, r/10, g/10, b/10, 255);   //se los divide por 10 porque es la cantidad de vecinos
                }
            }
        }
        ctx.putImageData(imageData,0,0);
    }

//funcion para el filtro negativo

    function filterNegativo(imageData){     

        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                
                let r = getRed(imageData, x, y);    //se obtienen los valores del pixel
                r = 255 - r;                        //se invierte el valor
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
                
                let r = getRed(imageData, x, y);        //se obtienen los valores del pixel
                let g = getGreen(imageData, x, y);
                let b = getBlue(imageData, x, y);
                let a = 255;
                let hsv = rgbToHsv (r, g, b);       //se obtiene un json con los valores en hsv
                hsv.s += 5;                         //al valor de saturacion se le suma 5
                let jsonRGB = HSVtoRGB(hsv)         //se obtienen los valores en rgb
                r = jsonRGB.r                       //las letiables se vuelven lo q devuelve el jsonrgb
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

        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                
                let r = getRed(imageData, x, y);
                let g = getGreen(imageData, x, y);
                let b = getBlue(imageData, x, y);
                let a = 255;
                let hsv = rgbToHsv (r, g, b);
                hsv.v += brillo;                //se aumenta o se reduce el valor del brillo (se pasa por parametro)
                let jsonRGB = HSVtoRGB(hsv)
                r = jsonRGB.r
                g = jsonRGB.g
                b = jsonRGB.b
                setPixel(imageData, x, y, r, g, b, a);
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }


//funcion para filtro de sepia

    function filterSepia(imageData){

        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                
                let valueR = getRed(imageData, x, y);       //se obtienen los valores
                let valueG = getGreen(imageData, x, y);
                let valueB = getBlue(imageData, x, y);
                let a = 255;
                let r = 0.38 * (valueR + valueG + valueB)    //se suman los valores de r, g, b y se multiplican por ese valor para poder lograr el "sepia"
                let g = 0.33 * (valueR + valueG + valueB)
                let b = 0.28 * (valueR + valueG + valueB)
                setPixel(imageData, x, y, r, g, b, a);      //se setean los colores
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

//funcion para filtro de binarizacion
    function filterBinarizacion(imageData){

        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                let r = getRed(imageData, x, y);        //obtenemos los el valor del pixel
                let g = getGreen(imageData, x, y);
                let b = getBlue(imageData, x, y);
                let a = 255;
                let gray =  (0.299 * r + 0.587 * g + 0.114 * b)    //se multiplican los valores obtenidos por esos valores

                if ( gray > 120 ){  //si el gris es mayor a 120 pinta los pixeles de blanco
                    r = 255;
                    g = 255;
                    b = 255;
                }
                else{       //sino los pinta de negro
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

        let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn; //se crean letiables
        rabs = r / 255; //las letiables se vuelven los colores / 255
        gabs = g / 255;
        babs = b / 255;
        v = Math.max(rabs, gabs, babs); //devuelve el mayor
        diff = v - Math.min(rabs, gabs, babs);  //el mayor menos el menor
        diffc = c => (v - c) / 6 / diff + 1 / 2;    
        percentRoundFn = num => Math.round(num * 100) / 100;

        if (diff == 0) {    //si es igual a cero
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
        return {                            //retorna un objeto con los nuevos valores
            h: Math.round(h * 360),
            s: percentRoundFn(s * 100),
            v: percentRoundFn(v * 100)
        };
    }


//funcion para pasar de HSV a RGB

    function HSVtoRGB(hsv) {

        let rgb = { };  //crea un json vacio
        let h = Math.round(hsv.h);      //redondea los valores
        let s = Math.round(hsv.s * 255 / 100);      
        let v = Math.round(hsv.v * 255 / 100);

            if (s == 0) {       //si es = a cero
                rgb.r = rgb.g = rgb.b = v;  
            } 
            else {
                let t1 = v;
                let t2 = (255 - s) * v / 255;
                let t3 = (t1 - t2) * (h % 60) / 60;

                if (h == 360) 
                    h = 0;

                    if (h < 60) 
                        { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3 }
                    else if 
                        (h < 120) { rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3 }
                    else if 
                        (h < 180) { rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3 }
                    else if 
                        (h < 240) { rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3 }
                    else if 
                        (h < 300) { rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3 }
                    else if 
                        (h < 360) { rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3 }
                    else 
                        { rgb.r = 0; rgb.g = 0; rgb.b = 0 }
            }

        return { r: Math.round(rgb.r),  //retorna un json
                 g: Math.round(rgb.g),
                 b: Math.round(rgb.b)
                };
    }

//funcion para pintar los pixeles

    function setPixel(imageData, x, y, r, g, b, a){   
                                                        //se van aplicando los valores en cada celda
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