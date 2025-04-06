const playGroundSize = 512;
const stepSize = 16;
let playGround = new Array(3);
for (let i = 0; i < playGround.length; i++) {
  playGround[i] = new Array(3).fill(0);
}
let PlayGroundSvg = document.getElementById("svgPlayGround");

const winnerText = document.getElementById("winner-text");
const restartButton = document.getElementById("restart-button");

// cross - крестики, circle - нолики
let activePlayer = "cross";

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
        if (activePlayer == "cross" && playGround[i][j] == 0) {
          const crossSize = boxSize / 1.5;
          const crossX =
            j * boxSize + stepSize * (j + 1) + (boxSize - crossSize) / 2;
          const crossY =
            i * boxSize + stepSize * (i + 1) + (boxSize - crossSize) / 2;
          const crossSvg = createCross(crossX, crossY, crossSize);
          playGround[i][j] = "cross";
          PlayGroundSvg.appendChild(crossSvg);
          activePlayer = "circle";
          winnerText.innerHTML = "o";
        } else if (activePlayer == "circle" && playGround[i][j] == 0) {
          const circleX = j * boxSize + boxSize / 2 + stepSize * (j + 1);
          const circleY = i * boxSize + boxSize / 2 + stepSize * (i + 1);
          const circleSvg = createCircle(circleX, circleY, boxSize / 3);
          playGround[i][j] = "circle";
          PlayGroundSvg.appendChild(circleSvg);
          activePlayer = "cross";
          winnerText.innerHTML = "x";
        }
        const winner = checkWin(0, 0);
        if (winner === "cross") {
          winnerText.innerHTML = "Крестики победили!";
          restartButton.style.display = "flex";
        } else if (winner === "circle") {
          winnerText.innerHTML = "Нолики победили!";
          restartButton.style.display = "flex";
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

//ищет выигрышную комбинацию в поле 3x3, начиная с x, y
function checkWin(x, y) {
  if (
    playGround[y][x] == playGround[y][x + 1] &&
    playGround[y][x + 1] == playGround[y][x + 2] &&
    playGround[y][x] != 0
  ) {
    return playGround[y][x];
  } else if (
    playGround[y + 1][x] == playGround[y + 1][x + 1] &&
    playGround[y + 1][x + 1] == playGround[y + 1][x + 2] &&
    playGround[y + 1][x] != 0
  ) {
    return playGround[y + 1][x];
  } else if (
    playGround[y + 2][x] == playGround[y + 2][x + 1] &&
    playGround[y + 2][x + 1] == playGround[y + 2][x + 2] &&
    playGround[y + 2][x] != 0
  ) {
    return playGround[y + 2][x];
  } else if (
    playGround[y][x] == playGround[y + 1][x] &&
    playGround[y + 1][x] == playGround[y + 2][x] &&
    playGround[y][x] != 0
  ) {
    return playGround[y][x];
  } else if (
    playGround[y][x + 1] == playGround[y + 1][x + 1] &&
    playGround[y + 1][x + 1] == playGround[y + 2][x + 1] &&
    playGround[y][x + 1] != 0
  ) {
    return playGround[y][x + 1];
  } else if (
    playGround[y][x + 2] == playGround[y + 1][x + 2] &&
    playGround[y + 1][x + 2] == playGround[y + 2][x + 2] &&
    playGround[y][x + 2] != 0
  ) {
    return playGround[y][x + 2];
  } else if (
    playGround[y][x] == playGround[y + 1][x + 1] &&
    playGround[y + 1][x + 1] == playGround[y + 2][x + 2] &&
    playGround[y][x] != 0
  ) {
    return playGround[y][x];
  } else if (
    playGround[y][x + 2] == playGround[y + 1][x + 1] &&
    playGround[y + 1][x + 1] == playGround[y + 2][x] &&
    playGround[y][x + 2] != 0
  ) {
    return playGround[y][x + 2];
  } else {
    return 0;
  }
}

restartButton.addEventListener("click", function () {
  playGround = new Array(3);
  for (let i = 0; i < playGround.length; i++) {
    playGround[i] = new Array(3).fill(0);
  }
  activePlayer = "cross";
  winnerText.innerHTML = "x";
  drawPlayGround();
});

drawPlayGround();
