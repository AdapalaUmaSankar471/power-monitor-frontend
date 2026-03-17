import {useState} from "react";
import axios from "axios";

function AddDevice(){

const [name,setName]=useState("");
const [power,setPower]=useState("");

const addDevice=async()=>{

await axios.post("http://localhost:8080/devices/add",{
name:name,
powerRating:power,
status:false
})

alert("Device Added");

}

return(

<div>

<h2>Add Device</h2>

<input placeholder="Device Name"
onChange={(e)=>setName(e.target.value)}/>

<input placeholder="Power Rating"
onChange={(e)=>setPower(e.target.value)}/>

<button onClick={addDevice}>
Add Device
</button>

</div>

)

}

export default AddDevice;