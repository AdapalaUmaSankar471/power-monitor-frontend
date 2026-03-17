import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {

const navigate = useNavigate();

const [user, setUser] = useState({
firstName: "",
lastName: "",
username: "",
email: "",
password: ""
});

const [error, setError] = useState("");

const handleChange = (e) => {

setUser({
...user,
[e.target.name]: e.target.value
});

};

const register = async () => {

if(!user.firstName || !user.lastName || !user.username || !user.email || !user.password){
setError("Please fill all fields");
return;
}

try {

await axios.post("http://localhost:8080/auth/register", {
firstName: user.firstName,
lastName: user.lastName,
username: user.username,
email: user.email,
password: user.password,
role: "VIEWER"
});

alert("✅ Account created successfully");

navigate("/");   // Redirect to home/login page

} catch (err) {

console.error(err);
setError("❌ Registration failed");

}

};

return (

<div style={styles.container}>

<div style={styles.card}>

<h2>Create Account</h2>

{error && <p style={styles.error}>{error}</p>}

<input
name="firstName"
placeholder="First Name"
style={styles.input}
value={user.firstName}
onChange={handleChange}
/>

<input
name="lastName"
placeholder="Last Name"
style={styles.input}
value={user.lastName}
onChange={handleChange}
/>

<input
name="username"
placeholder="Username"
style={styles.input}
value={user.username}
onChange={handleChange}
/>

<input
name="email"
placeholder="Email"
style={styles.input}
value={user.email}
onChange={handleChange}
/>

<input
name="password"
type="password"
placeholder="Password"
style={styles.input}
value={user.password}
onChange={handleChange}
/>

<button style={styles.button} onClick={register}>
Register
</button>

<p style={styles.loginLink}>
Already have an account?
<span onClick={() => navigate("/login")} style={styles.link}>
 Login
</span>
</p>

</div>

</div>

);

}

const styles = {

container: {
height: "100vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
background: "#050510"
},

card: {
width: "350px",
background: "#ffffff",
padding: "40px",
borderRadius: "10px",
textAlign: "center",
boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
},

input: {
width: "100%",
padding: "12px",
marginBottom: "15px",
borderRadius: "6px",
border: "1px solid #ccc"
},

button: {
width: "100%",
padding: "12px",
background: "#28a745",
color: "white",
border: "none",
borderRadius: "6px",
cursor: "pointer"
},

error: {
color: "red",
marginBottom: "10px"
},

loginLink: {
marginTop: "15px"
},

link: {
color: "blue",
cursor: "pointer",
marginLeft: "5px",
fontWeight: "bold"
}

};

export default Register;