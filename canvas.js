const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");
let gridSize = 16;
const pixelSize = 32;
canvas.width = gridSize * pixelSize;
canvas.height = gridSize * pixelSize;

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
drawGrid();
let pixels = [];
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
}
drawGrid();
canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientReact();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const pixelX = Math.floor(mouseX / pixelSize);
    const pixelY = Math.floor(mouseY / pixelSize);

    console.log(pixelX, pixelY)
});
let hoveredPixel = null
canvas.addEventListener("mousemove", function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const pixelX = Math.floor(mouseX / pixelSize);
    const pixelY = Math.floor(mouseY / pixelSize);
    hoveredPixel = { x: pixelX, y: pixelY };
};
    renderCanvas();
});
function renderCanvas() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
for (let y = 0; y < gridSize; y++) {
    for(let x = 0; x < gridSize; y++) {
        const color = pixels[y][x];
        if (color) {
            ctx.fillStyle = color;
            ctx.fillRect( x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    }
}
}
if (hoveredPixel) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(hoveredPixel.x * pixelSize, hoveredPixel.y * pixelSize, pixelSize, pixelSize); 
}
drawGrid();
}