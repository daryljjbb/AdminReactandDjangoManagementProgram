import { useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import api from "../../api/axios";

const RevenueReport = () => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [results, setResults] = useState([]);

  const fetchReport = () => {
    api.get(`/reports/revenue/?year=${year}`)
      .then(res => setResults(res.data))
      .catch(err => console.error("Revenue report error:", err));
  };

  return (
    <div>
      <h5>Revenue by Month</h5>

      <div className="d-flex align-items-end gap-2 mb-3">
        <Form.Group>
          <Form.Label>Year</Form.Label>
          <Form.Control
            type="number"
            value={year}
            onChange={e => setYear(e.target.value)}
          />
        </Form.Group>
        <Button onClick={fetchReport}>
          Run Report
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Month</th>
            <th>Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan="2" className="text-center text-muted">
                No results
              </td>
            </tr>
          ) : (
            results.map((row, idx) => (
              <tr key={idx}>
                <td>{row.month}</td>
                <td>${row.total}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default RevenueReport;
