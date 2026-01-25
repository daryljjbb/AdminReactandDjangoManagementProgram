// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Table, Badge } from "react-bootstrap";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [globalStats, setGlobalStats] = useState(null);
  const [users, setUsers] = useState([]);

  

useEffect(() => {
  api.get("stats/")
    .then(res => setGlobalStats(res.data))
    .catch(() => toast.error("Failed to load dashboard stats"));
}, []);

  
  useEffect(() => {
  api.get("users/")
    .then(res => {
      console.log("Users API response:", res.data);
      setUsers(res.data.results);
    })
    .catch(err => console.error("Users API error:", err));
}, []);


  return (
    <div>
      <h2 className="text-danger">Admin Management Console</h2>
      <div className="alert alert-dark shadow-sm">
        <strong>System Overview:</strong> You are viewing data for all users.
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
           <div className="card p-4 shadow-sm">
              <h5><i className="bi bi-currency-dollar me-2"></i>Total System Revenue</h5>
              <h2 className="text-success">${globalStats?.total_revenue || 0}</h2>
           </div>
        </div>
        <div className="col-md-6">
           <div className="card p-4 shadow-sm">
              <h5><i className="bi bi-people-fill me-2"></i>Total System Customers</h5>
              <h2>{globalStats?.customer_count || 0}</h2>
           </div>
        </div>
      </div>
      
      {/* You could eventually add a table of all users here! */}
      <Table striped bordered hover responsive className="mt-4 shadow-sm">
      <thead>
        <tr>
          <th>User</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>
              <Badge bg={user.is_staff ? "info" : "secondary"}>
                {user.is_staff ? "Admin" : "User"}
              </Badge>
            </td>
            <td>
              <Badge bg={user.is_active ? "success" : "danger"}>
                {user.is_active ? "Active" : "Inactive"}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>

    </div>
  );
};

export default AdminDashboard;