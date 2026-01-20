import { Modal, Table } from "react-bootstrap";

const PaymentHistoryModal = ({ show, onHide, invoice, payments }) => {
  if (!invoice) return null;

  // Running balance calculation
  let runningBalance = Number(invoice.total_amount) || 0;

  const paymentRows = payments.map((p) => {
    const amt = Number(p.amount);
    const balance = isNaN(amt) ? runningBalance : runningBalance - amt;
    runningBalance = balance;

    return {
      ...p,
      amount: isNaN(amt) ? 0 : amt,
      balance: balance,
    };
  });

  // Header totals
  const totalPaid = paymentRows.reduce((sum, p) => sum + p.amount, 0);
  const cappedPaid = Math.min(totalPaid, invoice.total_amount);
  const remaining = Math.max(invoice.total_amount - totalPaid, 0);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Payment History — Invoice #{invoice.invoice_number}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p><strong>Total Amount:</strong> ${invoice.total_amount}</p>
        <p><strong>Total Paid:</strong> ${cappedPaid.toFixed(2)}</p>
        <p><strong>Remaining:</strong> ${remaining.toFixed(2)}</p>

        <Table striped bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Date</th>
              <th>Payment</th>
              <th>Balance</th>
              <th>Method</th>
              <th>Note</th>
            </tr>
          </thead>

          <tbody>
            {/* Invoice creation row */}
            <tr>
              <td>—</td>
              <td>Invoice Created</td>
              <td>${invoice.total_amount}</td>
              <td>—</td>
              <td>—</td>
            </tr>

            {/* Payment rows */}
            {paymentRows.map((row) => (
              <tr key={row.id}>
                <td>{row.payment_date}</td>
                <td>${row.amount.toFixed(2)}</td>
                <td>${row.balance.toFixed(2)}</td>
                <td>{row.method}</td>
                <td>{row.note || "—"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};

export default PaymentHistoryModal;
