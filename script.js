let slots_parts = new Map();
slots_parts.set("1", '<circle class="figure" cx="100" cy="200" r="50" fill="darkgoldenrod"></circle>');
slots_parts.set("2", '<rect class="figure" x="100" y="200" width="100" height="100" fill="darkgoldenrod"></rect>');
slots_parts.set("3", '<path class="figure" d="M 100 200 h 100 l -50 -100 z" fill="darkgoldenrod"></path>');
slots_parts.set("4", '<path class="figure" d="M 100 200 h 100 l 40 10 l 40 -10 v 80 l -40 -10 l -40 10 h -100 z" fill="darkgoldenrod"></path>');

// let parts = document.getElementsByClassName("figure");
// reloadParts(parts);
reloadParts();

let svg_zone = document.getElementById("zone");

function movable(elem) {

    elem.addEventListener("mousedown", function(e) {
        let regex = /-?\d{1,}/g; //выделяет число

        let oldClientX = e.clientX;
        let oldClientY = e.clientY;
        

        if (elem.style.translate == "") {
            oldX = 0;
            oldY = 0;
        } else {
            oldX = elem.style.translate.match(regex)[0]
            oldY = elem.style.translate.match(regex)[1]
        }


        function moveAt(e) {

            let offsetX = oldClientX - e.clientX;
            let offsetY = oldClientY - e.clientY;



            elem.style.translate = `${oldX-offsetX}px ${oldY-offsetY}px`

        }

        document.onmousemove = function(e) {
            moveAt(e);
        }

        document.onmouseup = function() {
            document.onmousemove = null;
            elem.onmouseup = null;
            
        }
        
    });

}

//дает возоможность выделять объект
let chosen_part;
function choosable(elem) {
    elem.addEventListener("mousedown", function() {

        if (chosen_part) {
            chosen_part.style.stroke = null;
        }

        chosen_part = elem;
        elem.style.stroke = "aquamarine";
        elem.style.strokeWidth = "2";

        




        //заполнение угла наклона и скейлинга
        let regex = /\d{1,}/g; //выделяет число

        if (chosen_part.style.scale) {
            scaleBar.value = chosen_part.style.scale;
            scaleProgress.value = chosen_part.style.scale;
        } else {    
            scaleBar.value = 1;
            scaleProgress.value = 1;
        }

        if (chosen_part.style.rotate) {
            angleBar.value = chosen_part.style.rotate.match(regex);
            angleProgress.value = chosen_part.style.rotate.match(regex);
        } else {    
            angleBar.value = 0;
            angleProgress.value = 0;
        }


    });
}

//убирает выделение с фигуры
function stopChoosing(elem) {
    if (elem) {
        elem.style.stroke = null;
    }
}

//добавляет eventListener'ы к фигурам
function reloadParts() {
    let elems = document.getElementsByClassName("figure");
    for (let i=0; i<elems.length; i++) {
        
        let elem = elems[i];

        // elem.addEventListener("mousedown", movable(elem));
        movable(elem);
        choosable(elem);
    }
}




let slots = document.getElementsByClassName("slot");
// создание фигур на экране
for (let i=0; i<slots.length; i++) {
    let slot = slots[i];

    slot.addEventListener("click", function(e) {
        if (chosen_part) {
            chosen_part.style.stroke = null;
        }    

        let regex = /\d{1,}/g; //выделяет число

        let slot_id = slot.getAttribute("id").match(regex)[0];
        
        svg_zone.innerHTML += slots_parts.get(slot_id);
        // created_part = svg_zone.lastChild;

        reloadParts(); 
                       

    });
};






//ползунок скейлинга следит за текстовым показателем и наоборот
let scaleBar = document.getElementById("scale-bar");
let scaleProgress = document.getElementById("scale-progress");

scaleBar.addEventListener("input", function() {
    scaleProgress.value = scaleBar.value;

    if (chosen_part) {
        chosen_part.style.scale = scaleBar.value;
    }
});

scaleProgress.addEventListener("input", function() {
    scaleBar.value = scaleProgress.value;
    if (chosen_part) {
        chosen_part.style.scale = scaleProgress.value;
    }
});

//ползунок угла наклона следит за текстовым показателем и наоборот
let angleBar = document.getElementById("angle-bar");
let angleProgress = document.getElementById("angle-progress");

angleBar.addEventListener("input", function() {
    angleProgress.value = angleBar.value;
    if (chosen_part) {
        chosen_part.style.rotate = angleBar.value+"deg";
    }
});

angleProgress.addEventListener("input", function() {
    angleBar.value = angleProgress.value;
        if (chosen_part) {
        chosen_part.style.rotate = angleProgress.value+"deg";
    }
});




// изменение цвета
let colorB = document.getElementById("color-b");
colorB.addEventListener("click", function(e) {
    let color;
    if (chosen_part) {
        color = prompt("Выберите цвет (css название, hex)");
        chosen_part.style.fill = color;
    }

});


//удаление элементов
document.addEventListener("keydown", function(e) {
    if (e.code == "Delete" && chosen_part) {
        svg_zone.removeChild(chosen_part);
    }
});

//копирование элементов
let copiedPart;
document.addEventListener("keydown", function(e) {
    
    if (e.ctrlKey && e.code == "KeyC" && chosen_part) {
        copiedPart = chosen_part.cloneNode(true);
    }
    
});

//вставка элементов
document.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.code == "KeyV" && copiedPart) {
        if (chosen_part) {
            chosen_part.style.stroke = null;
        }  

        svg_zone.appendChild(copiedPart);
        copiedPart = copiedPart.cloneNode(true);
    
        reloadParts(); 
        
        
    }
    
});


//добавление градиента
let gradientB = document.getElementById("gradient-b");

gradientB.addEventListener("click", function() {
    let defsGradients = document.getElementById("gradients");
    let counter = defsGradients.children.length+1;
    let gradientId = `gradient-${counter}`;
    
    

    let color1 = prompt("Выберите первый цвет (css название, hex)")
    let color2 = prompt("Выберите второй цвет (css название, hex)");

    let gradient = document.createElement("linearGradient");
    gradient.setAttribute("id", gradientId)

    let stop1 = document.createElement("stop")
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", color1);

    let stop2 = document.createElement("stop")
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", color2);

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    

    defsGradients.appendChild(gradient);

    if (chosen_part) {
        chosen_part.style.fill = `url(#${gradientId})`;
    }

    stopChoosing(chosen_part);
    svg_zone.innerHTML += "";
    reloadParts();
})