import { useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import api from "../../api/axios";

const OverdueInvoicesReport = () => {
  const [days, setDays] = useState("0");
  const [results, setResults] = useState([]);

  const fetchReport = () => {
    api.get(`/reports/overdue-invoices/?days=${days}`)
      .then(res => setResults(res.data))
      .catch(err => console.error("Overdue invoices report error:", err));
  };

  return (
    <div>
      <h5>Overdue Invoices</h5>

      <div className="d-flex align-items-end gap-2 mb-3">
        <Form.Group>
          <Form.Label>Overdue by at least (days)</Form.Label>
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
            <th>Due Date</th>
            <th>Amount</th>
            <th>Paid?</th>
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
            results.map(inv => (
              <tr key={inv.id}>
                <td>{inv.customer.first_name} {inv.customer.last_name}</td>
                <td>{inv.due_date}</td>
                <td>${inv.total_amount}</td>
                <td>{inv.is_paid ? "Yes" : "No"}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default OverdueInvoicesReport;
