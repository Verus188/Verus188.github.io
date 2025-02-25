let figs = document.getElementsByClassName("figure");

letFiguresMove(figs);

let create_button = document.getElementById("b1");
let svg_zone = document.getElementById("zone");
create_button.onclick = function(e) {


    // svg_zone.appendChild(fig);
    svg_zone.innerHTML += '<path class="figure" d="M 400 350 h 100 l 40 10 l 40 -10 v 80 l -40 -10 l -40 10 h -100 z" fill="gold"></path>'
    
    figs = document.getElementsByClassName("figure");
    letFiguresMove(figs);
    


    
}

function moveAble(fig) {

    fig.addEventListener("mousedown", function(e) {
        let reg = /-?\d{1,}/g;

        let oldClientX = e.clientX;
        let oldClientY = e.clientY;
        

        if (fig.style.translate == "") {
            oldX = 0;
            oldY = 0;
        } else {
            oldX = fig.style.translate.match(reg)[0]
            oldY = fig.style.translate.match(reg)[1]
        }


        function moveAt(e) {

            let offsetX = oldClientX - e.clientX;
            let offsetY = oldClientY - e.clientY;



            fig.style.translate = `${oldX-offsetX}px ${oldY-offsetY}px`

        }

        document.onmousemove = function(e) {
            moveAt(e);
        }

        document.onmouseup = function() {
            document.onmousemove = null;
            fig.onmouseup = null;
            
        }
        
    });

}

function letFiguresMove(figs) {
    for (let i=0; i<figs.length; i++) {
        let fig = figs[i];

        fig.addEventListener("mousedown", moveAble(fig));
    }
}