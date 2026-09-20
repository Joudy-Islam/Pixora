console.log("CANVAS JS IS RUNNING");
const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");
let gridSize = 8;
const canvasSize = 350;
let zoom = 1;
let pixelSize = (canvasSize / gridSize)
canvas.width = canvasSize;
canvas.height = canvasSize;
const basePixelSize = 43.75;

const zoomInButton = document.getElementById("zoomIn");
const zoomOutButton = document.getElementById("zoomOut");
const zoomLevel = document.getElementById("zoomLevel");
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
let selectedColor = "#000000";
let isDrawing = false;
let selectedTool = "pencil";
let pixels = [];
let undoStack = [];
let redoStack = [];

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
function saveState() {
    undoStack.push(JSON.stringify(pixels));
    redoStack = [];
}
function undo() {
    if (undoStack.length === 0) {
        return;
    }
    redoStack.push(JSON.stringify(pixels));
    pixels = JSON.parse(undoStack.pop());
    renderCanvas();
}
function redo() {
    if (redoStack.length === 0) {
        return;
    }
    undoStack.push(JSON.stringify(pixels));
    pixels = JSON.parse(redoStack.pop());

    renderCanvas();
}
const undoButton = document.getElementById("undoButton");
const redoButton = document.getElementById("redoButton");
undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);
renderCanvas();
redoStack = [];

canvas.addEventListener("mousemove", function(event) {
const rect = canvas.getBoundingClientRect();

const mouseX = (event.clientX - rect.left) / zoom;
const mouseY = (event.clientY - rect.top) / zoom;
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
gridSizeSelect.addEventListener("change", function(){
    const newGridSize = Number(this.value);
    const success = changeGridSize(newGridSize);
    if (!success) {
        alert("Your drawing is too big for the selected grid size. Please choose a larger grid size.");
        this.value = gridSize;
    }
}); 

canvas.addEventListener("mousedown", function(event){
    savaState();
    isDrawing = true;
    drawPixel(event);
});
function drawPixel(event) {
const rect = canvas.getBoundingClientRect();
const mouseX = (event.clientX - rect.left);
const mouseY = (event.clientY - rect.top);
     const pixelX = Math.floor (mouseX / pixelSize);
     const pixelY = Math.floor (mouseY / pixelSize);
     if (pixelX >= 0 && pixelX < gridSize && pixelY >= 0 && pixelY < gridSize) {
        if (selectedTool === "pencil") {pixels[pixelY][pixelX] = selectedColor;}
        if (selectedTool === "eraser") {pixels[pixelY][pixelX] = null;}
            renderCanvas();
     }
}
canvas.addEventListener("mouseup", function(event) {
    isDrawing = false;
});
window.addEventListener("mouseup", function() {
    isDrawing = false;
});
function changeGridSize(newSize) {
    const bounds = getDrawingBounds();
    if (!bounds) {
        gridSize = newSize;
        pixelSize = (canvasSize / gridSize);
        canvas.width = gridSize * pixelSize;
        canvas.height = gridSize * pixelSize;
        createPixelData();
        renderCanvas();
        return true;
    }
    if (bounds.width > newSize || bounds.height > newSize) {
        return false;
    }
    const oldPixels = pixels;
    gridSize = newSize;
    pixelSize = canvasSize / gridSize;
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
const pencilTool = document.getElementById("pencilTool");
const eraserTool = document.getElementById("eraserTool");
pencilTool.addEventListener("click", function() {
    selectedTool = "pencil";
});
eraserTool.addEventListener("click", function() {
    selectedTool = "eraser";
});
function updateCanvasSize() {
    pixelSize = (canvasSize / gridSize);
    canvas.width = gridSize * pixelSize;
    canvas.height = gridSize * pixelSize;
}
function updateZoom() {
    zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
    canvas.style.width = `${canvasSize * zoom}px`;
    canvas.style.height = `${canvasSize * zoom}px`;
}
zoomInButton.addEventListener("click", function() {
    
    if (zoom < 4) {
        zoom += 0.25
        updateZoom();
        
    }
});
zoomOutButton.addEventListener("click", function() {
    if (zoom > 0.25) {
        zoom -= 0.25;
        updateZoom();
    }
})