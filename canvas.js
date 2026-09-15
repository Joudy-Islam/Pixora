console.log("CANVAS JS IS RUNNING");
const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");
let gridSize = 8;
const pixelSize= 24;
canvas.width = gridSize * pixelSize;
canvas.height = gridSize * pixelSize;

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
let pixels = [];
const savedCanvases = {
    8: null,
    16: null,
    32: null,
    64: null
};

let hoveredPixel = null
let selectedColor = "#000000";
let isDrawing = false;

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

canvas.addEventListener("mousemove", function(event) {
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
    for(let x = 0; x < gridSize; x++) {
        const color = pixels[y][x];
        if (color) {
            ctx.fillStyle = color;
            ctx.fillRect( x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
}
}

if (hoveredPixel) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(hoveredPixel.x * pixelSize, hoveredPixel.y * pixelSize, pixelSize, pixelSize); 
}
drawGrid();
}
canvas.addEventListener("mouseleave", function() { 
    hoveredPixel = null;
    renderCanvas();
});

const gridSizeSelect = document.getElementById("gridSize");
gridSizeSelect.addEventListener("change", function(){
  savedCanvases[gridSize] = pixels.map(row => [...row]);
    gridSize = Number(this.value);
 canvas.width = gridSize * pixelSize;
 canvas.height = gridSize * pixelSize;
 if (savedCanvases[gridSize]) {
    pixels = savedCanvases[gridSize].map(row => [...row]); } 
    else {
     createPixelData();
    }
renderCanvas();
}); 

canvas.addEventListener("mousedown", function(event){
    isDrawing = true;
    drawPixel(event);
});
function drawPixel(event) {
     const rect = canvas.getBoundingClientRect();
     const mouseX = event.clientX - rect.left;
     const mouseY = event.clientY - rect.top;
     const pixelX = Math.floor (mouseX / pixelSize);
     const pixelY = Math.floor (mouseY / pixelSize);
     if (pixelX >= 0 && pixelX < gridSize && pixelY >= 0 && pixelY < gridSize) {
        pixels[pixelY][pixelX] = selectedColor;
        renderCanvas();
     }
}
canvas.addEventListener("mouseup", function(event) {
    isDrawing = false;
});
window.addEventListener("mouseup", function() {
    isDrawing = false;
});

