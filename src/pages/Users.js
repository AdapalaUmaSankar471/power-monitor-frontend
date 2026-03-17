import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

function Users() {

const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);

// ============================
// Load Users
// ============================

const loadUsers = async () => {
try {
const res = await API.get("/users/all");
setUsers(res.data);
} catch (err) {
console.error("Error loading users:", err);
} finally {
setLoading(false);
}
};

// ============================
// Delete User
// ============================

const deleteUser = async (id) => {

const confirmDelete = window.confirm("Are you sure you want to delete this user?");

if (!confirmDelete) return;

try {
await API.delete(`/users/delete/${id}`);
loadUsers();
} catch (err) {
console.error("Error deleting user:", err);
}
};

// ============================

useEffect(() => {
loadUsers();
}, []);

// ============================

return (

<div style={{ display: "flex" }}>

<Sidebar />

<div style={containerStyle}>

<h1>👥 User Management</h1>

{loading ? (

<p>Loading users...</p>

) : (

<table style={tableStyle}>

<thead style={theadStyle}>
<tr>
<th>ID</th>
<th>Username</th>
<th>Role</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{users.map(user => (

<tr key={user.id} style={rowStyle}>

<td>{user.id}</td>
<td>{user.username}</td>
<td>{user.role}</td>

<td>
<button
style={deleteBtn}
onClick={() => deleteUser(user.id)}
>
Delete
</button>
</td>

</tr>

))}

</tbody>

</table>

)}

</div>

</div>

);

}

// ============================
// Styles
// ============================

const containerStyle = {
marginLeft: "240px",
padding: "30px",
width: "100%",
background: "#f4f6f8",
minHeight: "100vh"
};

const tableStyle = {
width: "100%",
borderCollapse: "collapse",
background: "#fff",
boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
borderRadius: "10px",
overflow: "hidden"
};

const theadStyle = {
background: "#111827",
color: "white"
};

const rowStyle = {
textAlign: "center",
borderBottom: "1px solid #eee"
};

const deleteBtn = {
padding: "6px 12px",
background: "#ef4444",
color: "white",
border: "none",
borderRadius: "5px",
cursor: "pointer"
};

export default Users;