import { useState } from "react";
import axios from "axios";

function AuthPage(){

const [isLogin,setIsLogin] = useState(true);

const [user,setUser] = useState({
firstName:"",
lastName:"",
username:"",
email:"",
password:"",
role:"VIEWER"
});

const [error,setError] = useState("");

const handleChange = (e) => {

setUser({...user,[e.target.name]:e.target.value});

};

const register = async () => {

try{

await axios.post("http://localhost:8080/auth/register",user);

alert("Account created successfully");

setIsLogin(true);

}catch(err){

setError("Registration failed");

}

};

const login = async () => {

try{

const res = await axios.post("http://localhost:8080/auth/login",{
username:user.username,
password:user.password
});

localStorage.setItem("token",res.data.token);
localStorage.setItem("role",res.data.role);

if(res.data.role==="ADMIN")
window.location="/admin";

else if(res.data.role==="OPERATOR")
window.location="/operator";

else
window.location="/viewer";

}catch(err){

setError("Invalid username or password");

}

};

return(

<div style={styles.container}>

<div style={styles.card}>

<h1 style={styles.title}>⚡ Smart Power Monitor</h1>

{error && <p style={styles.error}>{error}</p>}

{!isLogin && (

<>

<input
style={styles.input}
name="firstName"
placeholder="First Name"
onChange={handleChange}
/>

<input
style={styles.input}
name="lastName"
placeholder="Last Name"
onChange={handleChange}
/>

<input
style={styles.input}
name="email"
placeholder="Email"
onChange={handleChange}
/>

</>

)}

<input
style={styles.input}
name="username"
placeholder="Username"
onChange={handleChange}
/>

<input
style={styles.input}
name="password"
type="password"
placeholder="Password"
onChange={handleChange}
/>

{isLogin ?

<button style={styles.button} onClick={login}>
Login
</button>

:

<button style={styles.button} onClick={register}>
Create Account
</button>

}

<p style={styles.switch}>

{isLogin ? "New user?" : "Already have account?"}

<span
style={styles.link}
onClick={()=>setIsLogin(!isLogin)}
>

{isLogin ? " Register" : " Login"}

</span>

</p>

</div>

</div>

);

}

const styles = {

container:{
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:"#050510"
},

card:{
width:"400px",
background:"white",
padding:"40px",
borderRadius:"12px",
boxShadow:"0 10px 40px rgba(0,0,0,0.3)",
textAlign:"center"
},

title:{
marginBottom:"20px"
},

input:{
width:"100%",
padding:"12px",
marginBottom:"15px",
borderRadius:"6px",
border:"1px solid #ccc"
},

button:{
width:"100%",
padding:"12px",
background:"#007bff",
color:"white",
border:"none",
borderRadius:"6px",
cursor:"pointer"
},

switch:{
marginTop:"15px"
},

link:{
color:"blue",
cursor:"pointer",
fontWeight:"bold"
},

error:{
color:"red"
}

};

export default AuthPage;