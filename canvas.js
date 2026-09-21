console.log("CANVAS JS IS RUNNING");
const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");
let gridSize = 8;
const canvasSize = 500;
let pixelSize = canvasSize / gridSize;
canvas.width = canvasSize;
canvas.height = canvasSize;
function drawGrid() {
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    for (let x = 0; x <= gridSize; x++) {
        const position = x * pixelSize;
        ctx.beginPath();
        ctx.moveTo(position, 0);
        ctx.lineTo(position, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= gridSize; y++) {
        const position = y * pixelSize;
        ctx.beginPath();
        ctx.moveTo(0, position);
        ctx.lineTo(canvas.width, position);
        ctx.stroke();
    }
}


let hoveredPixel = null
let selectedColor = "#ffffff";
let isDrawing = false;
let pixels = []

function createPixelData() {
    pixels = [];
    for (let y = 0; y < gridSize; y++) {
        const row = [];
        for (let x = 0; x < gridSize; x++) {
            row.push(null);
        }
        pixels.push(row);
    }
}
createPixelData();

renderCanvas();

canvas.addEventListener("mousemove", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const pixelX = Math.floor(mouseX / pixelSize);
    const pixelY = Math.floor(mouseY / pixelSize);
    hoveredPixel = { x: pixelX, y: pixelY };
    if (isDrawing) {
        drawPixel(event)
    }
    else {
        renderCanvas();
    }
});
function renderCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const color = pixels[y][x];
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    }
    if (hoveredPixel) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(hoveredPixel.x * pixelSize, hoveredPixel.y * pixelSize, pixelSize, pixelSize);
    }
    drawGrid();
}
canvas.addEventListener("mouseleave", function () {
    hoveredPixel = null;
    renderCanvas();
});
function getDrawingBounds() {
    let minX = gridSize;
    let minY = gridSize;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (pixels[y][x] !== null) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);



            }
        }
    }
    if (maxX === -1) {
        return null;
    }
    return {
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX + 1,
        height: maxY - minY + 1
    }
}
const gridSizeSelect = document.getElementById("gridSize");
gridSizeSelect.addEventListener("change", function () {
    const newGridSize = Number(this.value);
    const success = changeGridSize(newGridSize);
    if (!success) {
        alert("Your drawing is too big for the selected grid size. Please choose a larger grid size.");
        this.value = gridSize;
    }
});

canvas.addEventListener("mousedown", function (event) {
    isDrawing = true;
    drawPixel(event);
});
function drawPixel(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const pixelX = Math.floor(mouseX / pixelSize);
    const pixelY = Math.floor(mouseY / pixelSize);
    if (pixelX >= 0 && pixelX < gridSize && pixelY >= 0 && pixelY < gridSize) {
        pixels[pixelY][pixelX] = selectedColor;
        renderCanvas();
    }
}
canvas.addEventListener("mouseup", function (event) {
    isDrawing = false;
});
window.addEventListener("mouseup", function () {
    isDrawing = false;
});
function changeGridSize(newSize) {
    const bounds = getDrawingBounds();
    if (!bounds) {
        gridSize = newSize;
        pixelSize = canvasSize / gridSize;
        createPixelData();
        renderCanvas();
        return true;
    }
    if (bounds.width > newSize || bounds.height > newSize) {
        return false;
    }
    const oldPixels = pixels;
    gridSize = newSize;
    pixelSize = canvasSize / gridSize
    createPixelData();
    const newStartX = Math.floor((newSize - bounds.width) / 2);
    const newStartY = Math.floor((newSize - bounds.height) / 2);
    for (let y = bounds.minY; y <= bounds.maxY; y++) {
        for (let x = bounds.minX; x <= bounds.maxX; x++) {
            const color = oldPixels[y][x];
            if (color !== null) {
                const newX = newStartX + (x - bounds.minX);
                const newY = newStartY + (y - bounds.minY);
                pixels[newY][newX] = color;
            }
        }
    }
    renderCanvas();
    return true;
}
const tools = ["pencil", "eraser", "fill", "picker"];

tools.forEach(tool => {
    const button = document.getElementById(tool);

    button.addEventListener("click", () => {
        tools.forEach(otherTool => {
            document.getElementById(otherTool).classList.remove("active");
        });

        button.classList.add("active");
    });
});
const colorSwatches = document.querySelectorAll(".color-swatch");
const currentColorBox = document.querySelector(".current-color");
const colorValueInput = document.getElementById("colorValue");
const hueSlider = document.getElementById("hueSlider");

function setSelectedColor(color) {
    selectedColor = color;

    if (currentColorBox) {
        currentColorBox.style.backgroundColor = color;
    }

    if (colorValueInput) {
        colorValueInput.value = color.toUpperCase();
    }

    colorSwatches.forEach(swatch => {
        swatch.classList.remove("selected");
    });

    colorSwatches.forEach(swatch => {
        if (swatch.dataset.color.toUpperCase() === color.toUpperCase()) {
            swatch.classList.add("selected");
        }
    });
}

colorSwatches.forEach(swatch => {
    swatch.addEventListener("click", function () {
        const color = this.dataset.color;
        setSelectedColor(color);
    });
});

hueSlider.addEventListener("input", function () {
    const hue = Number(this.value);
    const color = hslToHex(hue, 100, 50);
    setSelectedColor(color);
});

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);

    const f = n =>
        l - a * Math.max(
            -1,
            Math.min(k(n) - 3, Math.min(9 - k(n), 1))
        );

    const r = Math.round(255 * f(0));
    const g = Math.round(255 * f(8));
    const b = Math.round(255 * f(4));

    return "#" + [r, g, b]
        .map(x => x.toString(16).padStart(2, "0"))
        .join("");
}

setSelectedColor("black");