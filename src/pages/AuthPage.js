import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AuthPage() {

  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    role: "VIEWER"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const register = async () => {
    try {
      setLoading(true);
      setError("");
      await API.post("/auth/register", user);
      alert("Account created successfully");
      setIsLogin(true);
    } catch (err) {
      setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.post("/auth/login", {
        username: user.username,
        password: user.password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);

      const role = res.data.role;

      if (role === "ADMIN") navigate("/admin");
      else if (role === "OPERATOR") navigate("/operator");
      else navigate("/viewer");

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
        {error && <p style={styles.error}>{error}</p>}

        {!isLogin && (
          <>
            <input style={styles.input} name="firstName" placeholder="First Name" onChange={handleChange} />
            <input style={styles.input} name="lastName" placeholder="Last Name" onChange={handleChange} />
            <input style={styles.input} name="email" placeholder="Email" onChange={handleChange} />
          </>
        )}

        <input style={styles.input} name="username" placeholder="Username" onChange={handleChange} />
        <input style={styles.input} name="password" type="password" placeholder="Password" onChange={handleChange} />

        {isLogin ? (
          <button style={styles.button} onClick={login} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        ) : (
          <button style={styles.button} onClick={register} disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        )}

        <p style={styles.switch}>
          {isLogin ? "New user?" : "Already have account?"}
          <span style={styles.link} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Register" : " Login"}
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
    width: "400px",
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
    textAlign: "center"
  },
  title: { marginBottom: "20px" },
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
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  switch: { marginTop: "15px" },
  link: { color: "blue", cursor: "pointer", fontWeight: "bold" },
  error: { color: "red" }
};

export default AuthPage;