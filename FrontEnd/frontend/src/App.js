import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Customers from "./pages/Customers"; // Assuming you have this
import CustomerDetailPage from "./pages/CustomerDetailPage.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Registration";
import ReportsPage from "./components/reports/ReportsPage.jsx";
import useAuth from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";

function App() {
  const { isAuthenticated, loading } = useAuth();
  const { isAdmin } = useAuth();


  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES (No Layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES (With Sidebar/Navbar Layout) */}
        <Route 
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          {/* These render inside the <Outlet /> of Layout */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/reports" element={<ReportsPage />} />

          
           {/* ADMIN ONLY PAGE */}
          <Route 
             path="/admin-dashboard" 
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/dashboard" />} 
          />

          {/* Redirect base / to /invoices */}
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;

