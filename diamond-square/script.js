let sizeScale = 6;
let size = 2 ** sizeScale + 1;
const minHeight = 0;
const maxHeight = 9;
let roughness = 10;
let smoothness = 6;
seed = randInt(0, 999999999999999);

let map = new Array(size);

//Заполнение карты высот нулями
for (let i = 0; i < size; i++) {
  map[i] = new Array(size).fill(0);
}

function createNewMap() {
  seededRandom = new SeededRandom(seed);
  size = 2 ** sizeScale + 1;
  areaSize = 520 / size;
  map = new Array(size);

  for (let i = 0; i < size; i++) {
    map[i] = new Array(size).fill(0);
  }

  map[0][0] = seededRandom.random(minHeight, maxHeight);
  map[0][size - 1] = seededRandom.random(minHeight, maxHeight);
  map[size - 1][0] = seededRandom.random(minHeight, maxHeight);
  map[size - 1][size - 1] = seededRandom.random(minHeight, maxHeight);
}

function randInt(limit1, limit2) {
  if (arguments.length === 1) {
    return Math.trunc(Math.random() * limit1);
  } else if (arguments.length === 2) {
    return Math.trunc(Math.random() * (limit2 - limit1) + limit1);
  } else {
    return 0;
  }
}

class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }
  // Линейный конгруэнтный генератор
  next() {
    this.seed = (this.seed * 1664525 + 1013904223) & 0xffffffff;
    return (this.seed >>> 0) / 4294967296; // Нормализация к диапазону [0, 1)
  }
  // Генерация случайного числа в диапазоне [min, max)
  random(min = 0, max = 1) {
    return min + (max - min) * this.next();
  }
}
let seededRandom = new SeededRandom(seed);

//вывод всего массива в консоль
function logArray() {
  for (let i = 0; i < size; i++) {
    let res = "";
    for (let j = 0; j < size; j++) {
      res += map[i][j] + " ";
    }
    console.log(i + ": " + res);
  }
}

//стартовые высоты
map[0][0] = seededRandom.random(minHeight, maxHeight);
map[0][size - 1] = seededRandom.random(minHeight, maxHeight);
map[size - 1][0] = seededRandom.random(minHeight, maxHeight);
map[size - 1][size - 1] = seededRandom.random(minHeight, maxHeight);

//размер svg клетки
let areaSize = 520 / size;

let svgZone = document.getElementById("svg_zone");

function drawMap() {
  svgZone.innerHTML = "";
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let area = getArea(map[i][j]);
      area.setAttributeNS(null, "x", j * areaSize);
      area.setAttributeNS(null, "y", i * areaSize);
      svgZone.appendChild(area);
    }
  }
}

function setBrightnessBorder(brightness, min = 0, max = 100) {
  if (brightness < min) {
    brightness = min;
  }
  if (brightness > max) {
    brightness = max;
  }
  return brightness;
}

// возвращает объект клетки карты с цветом
function getArea(height) {
  let area = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  let brightness;
  area.setAttributeNS(null, "width", areaSize);
  area.setAttributeNS(null, "height", areaSize);
  if (height <= 2) {
    brightness = setBrightnessBorder(height + 30, 15);
    area.setAttributeNS(null, "fill", `hsl(200, 100%, ${brightness}%)`);
    return area;
  }

  if (height <= 5) {
    brightness = setBrightnessBorder(height + 30, 45);
    area.setAttributeNS(null, "fill", `hsl(53, 100%, ${brightness}%)`);
    return area;
  }

  if (height > 5) {
    brightness = setBrightnessBorder(height + 30, 10, 50);
    area.setAttributeNS(null, "fill", `hsl(120, 100%, ${brightness}%)`);
    return area;
  } else {
    area.setAttributeNS(null, "fill", "black");
    return area;
  }
}

//находит точку вне массива
function getMapPoint(cur, offset) {
  if (cur + offset >= size) {
    return cur + offset - size;
  } else if (cur + offset < 0) {
    return size + (cur + offset);
  } else {
    return cur + offset;
  }
}

function square(x, y, blockSize) {
  const x0y0 = map[y][x];
  const x0y1 = map[getMapPoint(y, blockSize)][x];
  const x1y0 = map[y][getMapPoint(x, blockSize)];
  const x1y1 = map[getMapPoint(y, blockSize)][getMapPoint(x, blockSize)];
  const midPoint = Math.trunc(
    (x0y0 + x0y1 + x1y0 + x1y1) / 4 +
      seededRandom.random(-roughness * blockSize, roughness * blockSize)
  );
  map[Math.round(y + blockSize / 2) - 1][Math.round(x + blockSize / 2) - 1] = 8;
}

function diamond(x, y, blockSize) {
  const halfBlockSize = (blockSize - 1) / 2;
  const above = map[getMapPoint(y, -halfBlockSize)][x];
  const bottom = map[getMapPoint(y, halfBlockSize)][x];
  const left = map[y][getMapPoint(x, -halfBlockSize)];
  const right = map[y][getMapPoint(x, halfBlockSize)];
  const midPoint = Math.trunc(
    (above + bottom + left + right) / 4 +
      seededRandom.random(-roughness * blockSize, roughness * blockSize)
  );
  map[y][x] = midPoint;
}

function diamondSquare() {
  let blockSize = size;
  while (blockSize >= 3) {
    for (let y = 0; y < Math.trunc(size / (blockSize - 1)); y++) {
      for (let x = 0; x < Math.trunc(size / (blockSize - 1)); x++) {
        square(x * (blockSize - 1), y * (blockSize - 1), blockSize);
        diamond(
          x * (blockSize - 1) + (blockSize - 1) / 2,
          y * (blockSize - 1),
          blockSize
        );
        diamond(
          x * (blockSize - 1) + (blockSize - 1) / 2,
          y * (blockSize - 1) + (blockSize - 1),
          blockSize
        );
        diamond(
          x * (blockSize - 1),
          y * (blockSize - 1) + (blockSize - 1) / 2,
          blockSize
        );
        diamond(
          x * (blockSize - 1) + (blockSize - 1),
          y * (blockSize - 1) + (blockSize - 1) / 2,
          blockSize
        );
      }
    }
    blockSize = Math.round(blockSize / 2);
  }
}

//сглаживает карту высот n раз
function smoothMap(n) {
  if (n <= 0) {
    return;
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const above = map[getMapPoint(y, -1)][x];
      const bottom = map[getMapPoint(y, 1)][x];
      const left = map[y][getMapPoint(x, -1)];
      const right = map[y][getMapPoint(x, 1)];
      const leftAbove = map[getMapPoint(y, -1)][getMapPoint(x, -1)];
      const rightAbove = map[getMapPoint(y, -1)][getMapPoint(x, 1)];
      const leftBottom = map[getMapPoint(y, 1)][getMapPoint(x, -1)];
      const rightBottom = map[getMapPoint(y, 1)][getMapPoint(x, 1)];

      const midPoint = Math.trunc(
        (above +
          bottom +
          left +
          right +
          leftAbove +
          rightAbove +
          leftBottom +
          rightBottom) /
          8
      );
      map[y][x] = midPoint;
    }
  }
  smoothMap(--n);
}

function reGenerateMap() {
  createNewMap();
  diamondSquare();
  smoothMap(smoothness);
  drawMap();
}

let generateB = document.getElementById("generate-b");

generateB.addEventListener("click", function () {
  reGenerateMap();
});

let sizeRange = document.getElementById("size-range");
let sizeText = document.getElementById("size-text");
sizeRange.addEventListener("input", function () {
  sizeText.value = sizeRange.value;
  sizeScale = sizeRange.value;
  reGenerateMap();
});
sizeText.addEventListener("input", function () {
  sizeRange.value = sizeText.value;
  sizeScale = sizeRange.value;
  reGenerateMap();
});

let roughnessRange = document.getElementById("roughness-range");
let roughnessText = document.getElementById("roughness-text");
roughnessRange.addEventListener("input", function () {
  roughnessText.value = roughnessRange.value;
  roughness = roughnessRange.value;
  reGenerateMap();
});
roughnessText.addEventListener("input", function () {
  roughnessRange.value = roughnessText.value;
  roughness = roughnessRange.value;
  reGenerateMap();
});

let smoothnessRange = document.getElementById("smoothness-range");
let smoothnessText = document.getElementById("smoothness-text");
smoothnessRange.addEventListener("input", function () {
  smoothnessText.value = smoothnessRange.value;
  smoothness = smoothnessRange.value;
  reGenerateMap();
});
smoothnessText.addEventListener("input", function () {
  smoothnessRange.value = smoothnessText.value;
  smoothness = smoothnessRange.value;
  reGenerateMap();
});

const randomSeedButton = document.getElementById("random-seed-b");
let seedText = document.getElementById("seed-text");
randomSeedButton.addEventListener("click", function () {
  seed = randInt(0, 999999999999999);
  seedText.value = seed;
  reGenerateMap();
});

seedText.addEventListener("input", function () {
  seed = seedText.value;
  reGenerateMap();
});

seedText.value = seed;
sizeRange.value = sizeScale;
sizeText.value = sizeScale;
roughnessRange.value = roughness;
roughnessText.value = roughness;
smoothnessRange.value = smoothness;
smoothnessText.value = smoothness;

diamondSquare();
smoothMap(smoothness);
drawMap();

// logArray();
