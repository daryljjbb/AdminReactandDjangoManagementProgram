import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import api from "../../api/axios";

const RenewalRemindersReport = () => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    api.get("/reports/renewal-reminders/")
      .then(res => setReminders(res.data))
      .catch(err => console.error("Renewal reminders error:", err));
  }, []);

  return (
    <div>
      <h5>Policy Renewal Reminders</h5>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Policy #</th>
            <th>Type</th>
            <th>Expiration</th>
            <th>Reminder Date</th>
          </tr>
        </thead>
        <tbody>
          {reminders.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No renewal reminders
              </td>
            </tr>
          ) : (
            reminders.map(r => (
              <tr key={r.id}>
                <td>{r.customer_name}</td>
                <td>{r.policy_number}</td>
                <td>{r.policy_type}</td>
                <td>{r.expiration_date}</td>
                <td>{r.reminder_date}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default RenewalRemindersReport;
