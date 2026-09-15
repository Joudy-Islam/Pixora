const addFrameBtn= document.getElementById("add");
const frameInput = document.getElementById("frameinput");
const framesContainer = document.getElementById("container");
const  previewImage =document.getElementById("preview_image");
const emptyMessage = document.getElementById("empty_message");
let frames = [];
let currentFrame = 0;
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


