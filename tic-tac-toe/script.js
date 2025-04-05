const playGroundSize = 512;
const stepSize = 16;
const playGround = new Array(3);
for (let i = 0; i < playGround.length; i++) {
  playGround[i] = new Array(3).fill(0);
}
let PlayGroundSvg = document.getElementById("svgPlayGround");

// 0 - крестики, 1 - нолики
let activePlayer = 0;

const boxSize =
  (playGroundSize - (playGround.length + 1) * stepSize) / playGround.length;

function drawPlayGround() {
  const mainRect = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  mainRect.setAttribute("x", "0");
  mainRect.setAttribute("y", "0");
  mainRect.setAttribute("width", playGroundSize);
  mainRect.setAttribute("height", playGroundSize);
  mainRect.setAttribute("fill", "orange");
  PlayGroundSvg.appendChild(mainRect);

  for (let i = 0; i < playGround.length; i++) {
    for (let j = 0; j < playGround.length; j++) {
      const gameRect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      gameRect.setAttribute("x", boxSize * j + stepSize * (j + 1));
      gameRect.setAttribute("y", boxSize * i + stepSize * (i + 1));
      gameRect.setAttribute("width", boxSize + "px");
      gameRect.setAttribute("height", boxSize + "px");
      gameRect.setAttribute("fill", "black");
      PlayGroundSvg.appendChild(gameRect);

      gameRect.addEventListener("click", function () {
        if (!activePlayer) {
          const crossSize = boxSize / 1.5;
          const crossX =
            j * boxSize + stepSize * (j + 1) + (boxSize - crossSize) / 2;
          const crossY =
            i * boxSize + stepSize * (i + 1) + (boxSize - crossSize) / 2;
          const crossSvg = createCross(crossX, crossY, crossSize);
          PlayGroundSvg.appendChild(crossSvg);
          activePlayer = 1;
        } else {
          const circleX = j * boxSize + boxSize / 2 + stepSize * (j + 1);
          const circleY = i * boxSize + boxSize / 2 + stepSize * (i + 1);
          const circleSvg = createCircle(circleX, circleY, boxSize / 3);
          PlayGroundSvg.appendChild(circleSvg);
          activePlayer = 0;
        }
      });
    }
  }
}

function createCross(x, y, size, strokeColor = "red") {
  const cross = document.createElementNS("http://www.w3.org/2000/svg", "path");
  cross.setAttribute(
    "d",
    `M${x},${y} L${size + x},${size + y} M${size + x},${y} L${x},${size + y}`
  );
  cross.setAttribute("stroke-width", "10");
  cross.setAttribute("stroke", strokeColor);

  return cross;
}

function createCircle(x, y, r, strokeColor = "green") {
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circle.setAttribute("cx", `${x}px`);
  circle.setAttribute("cy", `${y}px`);
  circle.setAttribute("fill", "transparent");
  circle.setAttribute("stroke-width", "10");
  circle.setAttribute("r", r);
  circle.setAttribute("stroke", strokeColor);

  return circle;
}

drawPlayGround();
