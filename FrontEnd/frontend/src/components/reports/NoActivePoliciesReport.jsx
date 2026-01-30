import { useState } from "react";
import { Button, Table } from "react-bootstrap";
import api from "../../api/axios";

const NoActivePoliciesReport = () => {
  const [results, setResults] = useState([]);

  const fetchReport = () => {
    api.get(`/reports/no-active-policies/`)
      .then(res => setResults(res.data))
      .catch(err => console.error("No active policies report error:", err));
  };

  return (
    <div>
      <h5>Customers With No Active Policies</h5>

      <div className="mb-3">
        <Button onClick={fetchReport}>
          Run Report
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>DOB</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                No results
              </td>
            </tr>
          ) : (
            results.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.date_of_birth}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default NoActivePoliciesReport;
