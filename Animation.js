let frame = [];
function handleUpload(event){
const files = event.target.files
frames= [];

for (let i =0; i< files.length ; i++){
    const reader= new fileReader();
    reader.onload= function(e){
        frames.push(e.target.result);
        displayFrames();
    };
    reader.ReadAsDataURL(files[i]);
}

}
