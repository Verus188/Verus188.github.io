let slots_parts = new Map();
slots_parts.set("1", '<circle class="figure" cx="100" cy="200" r="50" fill="darkgoldenrod"></circle>');
slots_parts.set("2", '<rect class="figure" x="100" y="200" width="100" height="100" fill="darkgoldenrod"></rect>');
slots_parts.set("3", '<path class="figure" d="M 100 200 h 100 l -50 -100 z" fill="darkgoldenrod"></path>');
slots_parts.set("4", '<path class="figure" d="M 100 200 h 100 l 40 10 l 40 -10 v 80 l -40 -10 l -40 10 h -100 z" fill="darkgoldenrod"></path>');

let figs = document.getElementsByClassName("figure");
letElemsMove(figs);

let svg_zone = document.getElementById("zone");


function moveAble(elem) {

    elem.addEventListener("mousedown", function(e) {
        let reg = /-?\d{1,}/g;

        let oldClientX = e.clientX;
        let oldClientY = e.clientY;
        

        if (elem.style.translate == "") {
            oldX = 0;
            oldY = 0;
        } else {
            oldX = elem.style.translate.match(reg)[0]
            oldY = elem.style.translate.match(reg)[1]
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

function letElemsMove(elems) {
    for (let i=0; i<elems.length; i++) {
        let elem = elems[i];

        elem.addEventListener("mousedown", moveAble(elem));
    }
}

let slots = document.getElementsByClassName("slot");

for (let i=0; i<slots.length; i++) {
    let slot = slots[i];

    slot.addEventListener("click", function(e) {
        let regex = /\d{1,}/g;

        let slot_id = slot.getAttribute("id").match(regex)[0];
        
        svg_zone.innerHTML += slots_parts.get(slot_id);
        created_part = svg_zone.lastChild;

        let figs = document.getElementsByClassName("figure");
        letElemsMove(figs);                

    });
};
