// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Table, Badge } from "react-bootstrap";

const AdminDashboard = () => {
  const [globalStats, setGlobalStats] = useState(null);

  useEffect(() => {
    api.get("stats/").then(res => setGlobalStats(res.data));
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
              <h5>Total System Revenue</h5>
              <h2 className="text-success">${globalStats?.total_revenue || 0}</h2>
           </div>
        </div>
        <div className="col-md-6">
           <div className="card p-4 shadow-sm">
              <h5>Total System Customers</h5>
              <h2>{globalStats?.customer_count || 0}</h2>
           </div>
        </div>
      </div>
      
      {/* You could eventually add a table of all users here! */}
    </div>
  );
};

export default AdminDashboard;