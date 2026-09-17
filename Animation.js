const addFrameBtn= document.getElementById("add");
const deleteBtn= document.getElementById("delete");
const playBtn = document.getElementById("play");
const pauseBtn =document.getElementById("pause");
const frameInput = document.getElementById("frameinput");
const framesContainer = document.getElementById("container");
const  previewImage =document.getElementById("preview_image");
const emptyMessage = document.getElementById("empty_message");
let frames = [];
let currentFrame = 0;
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
frame.innerHTML= ` <img src="${imageURL}" alt="frame${index+1}">
<span id="frame number>${index+1}</span>`;
     frame.addEventListener("click",function(){
        showFrame(index);
   });
  framesContainer.appendChild(frame);
});
}

function showFrame(index){
    current=index;
    previewImage.src=frames[index];
    previewImage.style.display="block";
    emptyMessage.style.display="none";
    document.querySelectorAll(".frame").forEach(function (frame){
        frame.classList.remove("selected");
    });
    document.querySelectorAll(".frame")[index].classList.add("selected");
}



