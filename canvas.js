console.log("CANVAS JS IS RUNNING");
const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");
let gridSize = 8;
const canvasSize = 350;
let zoom = 1;
let pixelSize = (canvasSize / gridSize)
canvas.width = canvasSize;
canvas.height = canvasSize;

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
let showGrid = true;
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
    undoStack.push({
        pixels: JSON.parse(JSON.stringify(pixels)),
        gridSize: gridSize
    });
    redoStack = [];
}
function undo() {
    if (undoStack.length === 0) {
        return;
    }
    redoStack.push({
        pixels : JSON.parse(JSON.stringify(pixels)),
        gridSize: gridSize
    });
    const previousState = undoStack.pop();
    pixels = JSON.parse(JSON.stringify(previousState.pixels));
    gridSize = previousState.gridSize;
    pixelSize = canvasSize / gridSize;
    gridSizeSelect.value = gridSize
    renderCanvas();
}
function redo() {
    if (redoStack.length === 0) {
        return;
    }
    undoStack.push({
        pixels: JSON.parse(JSON.stringify(pixels)),
        gridSize: gridSize });
        const nextState = redoStack.pop();
    pixels = JSON.parse(JSON.stringify(nextState.pixels));
    gridSize = nextState.gridSize;
    pixelSize = canvasSize /gridSize;
    gridSizeSelect.value = gridSize;

    renderCanvas();
}
const undoButton = document.getElementById("undoButton");
const redoButton = document.getElementById("redoButton");
const gridToggle = document.getElementById("gridToggle");
undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);
gridToggle.addEventListener("click", function() {
    showGrid = !showGrid
    if (showGrid) {
        gridToggle.textContent = "Hide Grid";
    }
    else {
    gridToggle.textContent = "Show Grid";
    }
    renderCanvas();
    });

renderCanvas();


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
if (showGrid) {
    drawGrid();
}
}

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

function drawPixel(event) {

    const pixel = getPixelFromMouse(event);

    if (!pixel) {
        return;
    }

    const pixelX = pixel.x;
    const pixelY = pixel.y;

    if (selectedTool === "fill") {
        saveState();
        fillArea(pixelX, pixelY);
        return;
    }

    if (selectedTool === "pencil") {
        pixels[pixelY][pixelX] = selectedColor;
    }

    if (selectedTool === "eraser") {
        pixels[pixelY][pixelX] = null;
    }

    if (selectedTool === "picker") {

        const pickedColor = pixels[pixelY][pixelX];

        if (pickedColor !== null) {
            selectedColor = pickedColor;
            selectedTool = "pencil";
        }

        return;
    }

    renderCanvas();
}
canvas.addEventListener("mouseup", function(event) {
    isDrawing = false;
});
function changeGridSize(newSize) {
    const bounds = getDrawingBounds();
    if (bounds && (bounds.width > newSize || bounds.height > newSize)) {
        return false;
    }
    saveState();
    const oldPixels = pixels;
    gridSize = newSize;
    pixelSize = canvasSize / gridSize;
    createPixelData();
    if (bounds) {
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
    }
    renderCanvas();
    return true;
}
const pencilTool = document.getElementById("pencilTool");
const eraserTool = document.getElementById("eraserTool");
const fillTool = document.getElementById("fillTool");
const colorPickerTool = document.getElementById("colorPickerTool")
const clearCanvasButton = document.getElementById("clearCanvas");
pencilTool.addEventListener("click", function() {
    selectedTool = "pencil";
});
eraserTool.addEventListener("click", function() {
    selectedTool = "eraser";
});
fillTool.addEventListener("click", function() {
selectedTool = "fill";
});
colorPickerTool.addEventListener("click", function() {
    selectedTool = "picker";
});
function clearCanvas() {
    saveState();
    createPixelData();
    renderCanvas();
}
function updateZoom() {
    const zoomSurface = document.querySelector(".canvas-zoom-surface");
    zoomSurface.style.width = `${canvasSize * zoom}px`;
    zoomSurface.style.height = `${canvasSize * zoom}px`;
    canvas.style.transform = `scale(${zoom})`;
    zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
}
function fillArea(startX, startY) {
    const targetColor = pixels[startY][startX];
    if(targetColor === selectedColor) {
        return;
    }
    const queue = [[startX, startY]];
    while (queue.length > 0) {
        const [x,y] = queue.shift();
        if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
            continue;
        }
        if(pixels[y][x] !== targetColor) {
            continue;
        }
        pixels[y][x] = selectedColor;
        queue.push([x + 1, y]);
        queue.push([x - 1, y]);
        queue.push([x,y + 1]);
        queue.push([x,y - 1]);
    }
    renderCanvas();
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
clearCanvasButton.addEventListener("click", function() {
    const confirmed = confirm("Are you sure you want to clear the canvas?");
    if (confirmed) {
        clearCanvas();
    }
});
updateZoom();
function getPixelFromMouse(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) / zoom;
    const mouseY = (event.clientY - rect.top) / zoom;
    const pixelX = Math.floor(mouseX / pixelSize);
    const pixelY = Math.floor(mouseY / pixelSize);
    if (
        pixelX < 0 ||
        pixelX >= gridSize ||
        pixelY < 0 ||
        pixelY >= gridSize
    ) {
        return null;
    }
    return { x: pixelX, y: pixelY };
}
canvas.addEventListener("pointerdown", function(event) {
    if (selectedTool === "fill") {
        drawPixel(event);
        return;
    }
    saveState();
    isDrawing = true;
    canvas.setPointerCapture(event.pointerId);
    drawPixel(event);
});
canvas.addEventListener("pointermove", function(event) {
    const pixel = getPixelFromMouse(event);

    if (pixel) {
        hoveredPixel = pixel;
    } else {
        hoveredPixel = null;
    }
    if (isDrawing) {
        drawPixel(event);
    } else {
        renderCanvas();
    }
});
canvas.addEventListener("pointerup", function(event) {
    isDrawing = false;

    if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
    }
});
canvas.addEventListener("pointercancel", function(event) {
    isDrawing = false;
    if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
    }
});
canvas.addEventListener("pointerleave", function() {

    if (!isDrawing) {
        hoveredPixel = null;
        renderCanvas();
    }

});
