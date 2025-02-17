console.log("script is working");


var fig1 = document.getElementById("figure1");
console.log(fig1);


fig1.onmousedown = function(e) {
    var counter = 0;
    function moveAt(e) {
        fig1.style.transform = `translate(${counter}px, 0px)`;
        // fig1.style.transform = `translate(0px, ${counter}px)`;
        console.log(e.pageX);
        console.log(fig1);
    }
    fig1.style.position = "absolute";
    moveAt(e);
    // document.body.appendChild(fig1);

    // fig1.style.zIndex = 1000;


    document.onmousemove = function(e) {
        moveAt(e);
    }

    fig1.onmouseup = function() {
        document.onmousemove = null;
        fig1.onmouseup = null;
    }

}

// fig1.onmousedown = function(e) {
//     function moveAt(e) {
//         fig1.style.left = e.pageX - fig1.offsetWidth / 2 + "px";
//         fig1.style.top = e.pageY - fig1.offsetHeight / 2 + "px";
//     }
//     fig1.style.position = "absolute";
//     moveAt(e);
//     // document.body.appendChild(fig1);

//     // fig1.style.zIndex = 1000;


//     document.onmousemove = function(e) {
//         moveAt(e);
//     }

//     fig1.onmouseup = function() {
//         document.onmousemove = null;
//         fig1.onmouseup = null;
//     }

// }