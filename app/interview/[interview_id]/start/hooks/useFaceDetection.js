useEffect(()=>{
if(!started) return;

const interval=setInterval(async()=>{

const detections=await faceapi.detectAllFaces(
videoRef.current,
new faceapi.TinyFaceDetectorOptions()
);

...
},3000);

return()=>clearInterval(interval);

},[started]);