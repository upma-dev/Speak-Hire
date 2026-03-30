import { useEffect } from "react";

export const useCameraToggle = (streamRef, cameraOn) => {

useEffect(()=>{

if(!streamRef.current) return;

const track = streamRef.current.getVideoTracks()[0];

if(track){
track.enabled = cameraOn;
}

},[cameraOn]);

};