// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Table, Badge } from "react-bootstrap";
import {
  LineChart, Line
} from "recharts";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";


const AdminDashboard = () => {
  const [globalStats, setGlobalStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [customerGrowth, setCustomerGrowth] = useState([]);


  useEffect(() => {
    api.get("stats/").then(res => setGlobalStats(res.data));
    api.get("users/").then(res => setUsers(res.data.results || res.data)); // handle pagination
    api.get("dashboard/monthly-revenue/").then(res => setMonthlyRevenue(res.data));
  }, []);

  useEffect(() => {
  api.get("dashboard/customer-growth/")
    .then(res => setCustomerGrowth(res.data))
    .catch(err => console.error("Customer growth error:", err));
    console.log("Customer Growth Data:", customerGrowth);
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

      {/* Monthly Revenue Chart */}
      <div className="mt-5">
        <h4>Monthly Revenue Trend</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#28a745" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Customer Growth Chart */}
      <div className="mt-5">
        <h4>Customer Growth Trend</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={customerGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="customers" fill="#0d6efd" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Users Table */}
      <Table striped bordered hover responsive className="mt-5 shadow-sm">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email || "—"}</td>
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
