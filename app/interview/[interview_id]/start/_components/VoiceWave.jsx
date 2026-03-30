"use client";

export default function VoiceWave({active,color="blue"}){

const colorClass=color==="green"?"bg-green-400":"bg-blue-400";

return(

<div className="flex items-end gap-[3px] h-8 mt-2">

{[...Array(10)].map((_,i)=>(
<div
key={i}
className={`w-[4px] rounded-full ${
active ? `${colorClass} animate-pulse` : "bg-gray-500/30"
}`}
style={{height:`${Math.random()*20+10}px`}}
/>
))}

</div>

);

}