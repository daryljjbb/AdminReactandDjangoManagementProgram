import { useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import api from "../../api/axios";

const ExpiredPoliciesReport = () => {
  const [days, setDays] = useState("30");
  const [results, setResults] = useState([]);

  const fetchReport = () => {
    api.get(`/reports/expired-policies/?days=${days}`)
      .then(res => setResults(res.data))
      .catch(err => console.error("Expired policies report error:", err));
  };

  return (
    <div>
      <h5>Expired Policies</h5>

      <div className="d-flex align-items-end gap-2 mb-3">
        <Form.Group>
          <Form.Label>Expired in last (days)</Form.Label>
          <Form.Control
            type="number"
            value={days}
            onChange={e => setDays(e.target.value)}
          />
        </Form.Group>
        <Button onClick={fetchReport}>
          Run Report
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Policy Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No results
              </td>
            </tr>
          ) : (
            results.map(p => (
              <tr key={p.id}>
                <td>{p.customer.name}</td>
                <td>{p.policy_type}</td>
                <td>{p.effective_date}</td>
                <td>{p.expiration_date}</td>
                <td>{p.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ExpiredPoliciesReport;
