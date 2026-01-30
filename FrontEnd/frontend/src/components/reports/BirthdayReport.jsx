import { useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import api from "../../api/axios";

const BirthdayReport = () => {
  const [month, setMonth] = useState("");
  const [results, setResults] = useState([]);

  const fetchReport = () => {
    if (!month) return;
    api.get(`/reports/birthdays/?month=${month}`)
      .then(res => setResults(res.data))
      .catch(err => console.error("Birthday report error:", err));
  };

  return (
    <div>
      <h5>Customer Birthdays</h5>

      <div className="d-flex align-items-end gap-2 mb-3">
        <Form.Group>
          <Form.Label>Month</Form.Label>
          <Form.Select value={month} onChange={e => setMonth(e.target.value)}>
            <option value="">Select month</option>
            {[...Array(12)].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button onClick={fetchReport} disabled={!month}>
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

export default BirthdayReport;
