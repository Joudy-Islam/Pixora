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
    
}
}