import { useEffect } from "react";

export const useTimer = (started,setElapsedTime) => {

useEffect(()=>{

if(!started) return;

const interval = setInterval(()=>{
setElapsedTime(prev=>prev+1);
},1000);

return()=>clearInterval(interval);

},[started]);

};