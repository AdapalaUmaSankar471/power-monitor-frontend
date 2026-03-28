// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// function Login(){

// const navigate = useNavigate();

// const [username,setUsername] = useState("");
// const [password,setPassword] = useState("");
// const [error,setError] = useState("");
// const [loading,setLoading] = useState(false);

// const login = async () => {

// try{

// setLoading(true);
// setError("");

// const res = await API.post("/auth/login",{
// username,
// password
// });

// console.log("Full API Response:", res);
// console.log("Response Data:", res.data);
// console.log("Token:", res.data.token);
// // Save auth data
// localStorage.setItem("token",res.data.token);
// localStorage.setItem("role",res.data.role);
// localStorage.setItem("username",res.data.username);

// const role = res.data.role;

// // Role-based navigation
// if(role === "ADMIN"){
// navigate("/admin");
// }
// else if(role === "OPERATOR"){
// navigate("/operator");
// }
// else{
// navigate("/viewer");
// }

// }catch(err){

// setError("❌ Invalid username or password");

// }finally{
// setLoading(false);
// }

// };

// return(

// <div style={styles.container}>

// <div style={styles.card}>

// <h1 style={styles.title}>⚡ Smart Power Monitor</h1>
// <p style={styles.subtitle}>Login to your dashboard</p>

// {error && <p style={styles.error}>{error}</p>}

// <input
// style={styles.input}
// placeholder="Username"
// value={username}
// onChange={(e)=>setUsername(e.target.value)}
// />

// <input
// style={styles.input}
// type="password"
// placeholder="Password"
// value={password}
// onChange={(e)=>setPassword(e.target.value)}
// />

// <button style={styles.button} onClick={login} disabled={loading}>
// {loading ? "Logging in..." : "Login"}
// </button>

// <p style={styles.register}>
// New user?
// <span style={styles.link} onClick={()=>navigate("/register")}>
//  Create Account
// </span>
// </p>

// </div>

// </div>

// );

// }

// const styles={

// container:{
// height:"100vh",
// display:"flex",
// justifyContent:"center",
// alignItems:"center",
// background:"#050510"
// },

// card:{
// width:"360px",
// background:"#ffffff",
// padding:"40px",
// borderRadius:"12px",
// textAlign:"center",
// boxShadow:"0 10px 40px rgba(0,0,0,0.3)"
// },

// title:{
// marginBottom:"5px"
// },

// subtitle:{
// color:"gray",
// marginBottom:"20px"
// },

// input:{
// width:"100%",
// padding:"12px",
// marginBottom:"15px",
// borderRadius:"6px",
// border:"1px solid #ccc"
// },

// button:{
// width:"100%",
// padding:"12px",
// background:"#2563eb",
// color:"white",
// border:"none",
// borderRadius:"6px",
// cursor:"pointer"
// },

// error:{
// color:"red",
// marginBottom:"10px"
// },

// register:{
// marginTop:"15px"
// },

// link:{
// color:"blue",
// cursor:"pointer",
// fontWeight:"bold",
// marginLeft:"5px"
// }

// };

// export default Login;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login", {
        username,
        password
      });

      console.log("Full API Response:", res);
      console.log("Response Data:", res.data);

      const token = res.data.token;
      const role = res.data.role;

      // ✅ Store properly
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", res.data.username);

      console.log("Stored Role:", role);

      // ✅ FIXED NAVIGATION
      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "OPERATOR") {
        navigate("/operator");
      } else if (role === "VIEWER") {
        navigate("/viewer");
      } else if (role === "USER") {
        navigate("/user");   // 🔥 IMPORTANT FIX
      } else {
        navigate("/login");
      }

    } catch (err) {
      setError("❌ Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>⚡ Smart Power Monitor</h1>
        <p style={styles.subtitle}>Login to your dashboard</p>

        {error && <p style={styles.error}>{error}</p>}

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.register}>
          New user?
          <span style={styles.link} onClick={() => navigate("/register")}>
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = { /* keep same */ };

export default Login;