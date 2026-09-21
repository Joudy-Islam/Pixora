const addFrameBtn= document.getElementById("add");
const deleteBtn= document.getElementById("delete");
const playBtn = document.getElementById("play");
const pauseBtn =document.getElementById("pause");
const frameInput = document.getElementById("frameinput");
const framesContainer = document.getElementById("container");
const  previewImage =document.getElementById("preview_image");
const emptyMessage = document.getElementById("empty_message");
let lastTime = performance.now();
let framecount= 0;
let fps=0;
let running = false;
let frames = [];
let currentFrame = 0;
let FPS=10 ;
let lastFrameTime = 0;

function playLoop(timestamp){
    if (!running) return;
    if (timestamp - lastFrameTime >= 1000 / FPS ){
        showFrame(currentFrame);
        currentFrame++;
        if (currentFrame>= frames.length){ 
             currentFrame = 0;
            }
          lastFrameTime = timestamp ;
    }
    requestAnimationFrame(playLoop);
}

function fpsLoop(){
    if (!running) return;

   let now=performance.now();
   framecount++;

    if (now - lastTime >= 1000){
          fps = framecount;
          framecount=0;
          lastTime=now;
          document.getElementById("fpscounter").textContent= `FPS ${fps}`;
          
    }    
    requestAnimationFrame(fpsLoop);    
}



// delete button
deleteBtn.addEventListener("click",function(){
         if(frames.length>0){
            frames.splice(currentFrame,1)
             
            if(frames.length>0){
                if (currentFrame >= frames.length){
                    currentFrame= frames.length -1;
                }
                showFrame(currentFrame);
            } else{
                previewImage.style.display="none";
                emptyMessage.style.display="block";
            }
            displayFrames();
         }
});

// play button 
playBtn.addEventListener("click", function(){
      if (!running && frames.length > 0){
        running= true ;
        requestAnimationFrame(playLoop);
        fpsLoop();
       }
});
//pause Button
pauseBtn.addEventListener("click", function(){
       running= false;
    
});
//Add button
addFrameBtn.addEventListener("click", function(){
       frameInput.click();
});
frameInput.addEventListener("change", function(){
    for (let file of frameInput.files){

        const imageURL= URL.createObjectURL(file);
        frames.push(imageURL)
    }
    displayFrames(); 

});
function displayFrames(){
framesContainer.innerHTML=" ";
frames.forEach(function(imageURL,index){
let frame= document.createElement("div");
frame.classList.add("frame");
frame.innerHTML= `<img src="${imageURL}" alt="frame${index+1}">
<span class="frame-number">${index+1}</span>`;
     frame.addEventListener("click",function(){
        showFrame(index);
   });
  framesContainer.appendChild(frame);
});
}

function showFrame(index){
    currentFrame=index;
    previewImage.src=frames[index];
    previewImage.style.display="block";
    emptyMessage.style.display="none";
    document.querySelectorAll(".frame").forEach( frame => {
       frame.classList.remove("selected");
    });
    document.querySelectorAll(".frame")[index].classList.add("selected");
}
exportBtn.addEventListener("click", async function () {

    if (frames.length === 0) {
        alert("Please add frames first!");
        return;
    }

    exportBtn.disabled = true;
    exportBtn.textContent = "Exporting...";

    try {

        // Load the first image
        const firstImage = await loadImage(frames[0]);

        // Create canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = firstImage.width;
        canvas.height = firstImage.height;

        // Create video stream
        const stream = canvas.captureStream(FPS);

        const recorder = new MediaRecorder(stream, {
            mimeType: "video/webm"
        });

        const chunks = [];

        recorder.ondataavailable = function (event) {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        recorder.onstop = function () {

            const blob = new Blob(chunks, {
                type: "video/webm"
            });

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "my-animation.webm";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);

            exportBtn.disabled = false;
            exportBtn.textContent = "Export";
        };

        // Start recording
        recorder.start();

        // Show every frame
        for (let i = 0; i < frames.length; i++) {

            const img = await loadImage(frames[i]);

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            ctx.drawImage(
                img,
                0,
                0,
                canvas.width,
                canvas.height
            );

            exportBtn.textContent =
                `Exporting ${i + 1}/${frames.length}`;

            // Wait according to FPS
            await new Promise(resolve =>
                setTimeout(resolve, 1000 / FPS)
            );
        }

        // Stop recording
        recorder.stop();

    } catch (error) {

        console.error(error);

        alert("Could not export the animation.");

        exportBtn.disabled = false;
        exportBtn.textContent = "Export";
    }
});


function loadImage(src) {

    return new Promise((resolve, reject) => {

        const img = new Image();

        img.onload = function () {
            resolve(img);
        };

        img.onerror = function () {
            reject(new Error("Image failed to load"));
        };

        img.src = src;
    });
}



exportBtn.addEventListener("click", function () {

    // Create a new canvas for export
    const exportCanvas = document.createElement("canvas");
    const exportCtx = exportCanvas.getContext("2d");

    // Make the exported image the same size as the grid
    exportCanvas.width = gridSize;
    exportCanvas.height = gridSize;

    // Transparent background
    exportCtx.clearRect(
        0,
        0,
        exportCanvas.width,
        exportCanvas.height
    );

    // Draw the pixel art
    for (let y = 0; y < gridSize; y++) {

        for (let x = 0; x < gridSize; x++) {

            const color = pixels[y][x];

            if (color !== null) {

                exportCtx.fillStyle = color;

                exportCtx.fillRect(
                    x,
                    y,
                    1,
                    1
                );
            }
        }
    }

    // Convert canvas to PNG
    exportCanvas.toBlob(function (blob) {

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "pixel-art.png";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    }, "image/png");
});
>>>>>>> main
