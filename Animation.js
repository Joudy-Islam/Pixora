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
let playInterval = null;



let FPS=10 ;
let lastFrameTime = 0;
function playLoop(TimesTamp){
    if (!running) return;
    if (timesTamp - lastFrameTime >= 1000 / FPS ){
        showFram(currentFrame);
        currentFrame++;
        if (currentFrame >= frames.length){ 
             currentFrame = 0;
            }
          lastFrameTime = TimesTamp ;
    }
    requestAnimationFrame(playLoop);
}

function fpsLoop(){
    if (!running) return;

    now=performance.now();
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
       clearInterval(playInterval);
       playInterval= null;
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
<span id="frame number>${index+1}</span>`;
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
    document.querySelectorAll(".frame").forEach( frame >= {
       frames.classList.remove("selected"),
    });
    document.querySelectorAll(".frame")[index].classList.add("selected");
} 
