import { useEffect, useState } from "react";
import api from "../api/axios";
import { Row, Col, Card } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({ 
    total_revenue: 0, 
    unpaid_count: 0, 
    paid_count: 0,     // <--- Add this
    overdue_count: 0,  // <--- Add this
    customer_count: 0 
  });
  const [data, setData] = useState([]);
  const COLORS = ['#FFBB28', '#00C49F', '#FF8042']; // Pending, Paid, Overdue

useEffect(() => {
    // 1. Get the card numbers (Revenue, Unpaid, Customers)
    api.get("stats/")
      .then(res => {
        setStats(res.data);
      })
      .catch(err => console.error("Error fetching stats:", err));

    // 2. Get the chart data
    api.get("reports/")
      .then(res => {
        setData(res.data.chart_data);
      })
      .catch(err => console.error("Error fetching chart data:", err));
  }, []);


  return (
    <div>
      <h2 className="mb-4">Your Dashboard</h2>
      <Row>
        <Col md={4}>
          <Card className="text-center shadow-sm border-0 bg-primary text-white p-3">
            <Card.Title>Total Revenue</Card.Title>
            <h3>${stats.total_revenue}</h3>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm border-0 bg-warning text-dark p-3">
            <Card.Title>Unpaid Invoices</Card.Title>
            <h3>{stats.unpaid_count}</h3>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm border-0 bg-info text-white p-3">
            <Card.Title>My Customers</Card.Title>
            <h3>{stats.customer_count}</h3>
          </Card>
        </Col>
      </Row>
       <div className="mt-4 p-4 bg-white shadow-sm rounded">
            <h5>Revenue Trend</h5>
            <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                     <Pie
                        data={[
                            { name: 'Pending', value: stats.unpaid_count },
                            { name: 'Paid', value: stats.paid_count },    // Now this has a value!
                            { name: 'Overdue', value: stats.overdue_count } // Add this for a 3rd slice
                        ]}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {/* This maps colors to the slices in order */}
                        <Cell fill={COLORS[0]} /> {/* Pending */}
                        <Cell fill={COLORS[1]} /> {/* Paid */}
                        <Cell fill={COLORS[2]} /> {/* Overdue */}
                    </Pie>
                    <Legend />
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;