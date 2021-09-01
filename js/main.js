"use strict";

document.addEventListener('DOMContentLoaded', loadPage);

function loadPage () {

    document.querySelector("#brightness").addEventListener("click", function(e) {
        document.querySelector("#slider").classList.toggle("on-slider");
        menu.classList.toggle("desplegarNav");
    });

}