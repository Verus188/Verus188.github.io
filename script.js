console.log("script is working");


let fig = document.getElementById("figure");

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