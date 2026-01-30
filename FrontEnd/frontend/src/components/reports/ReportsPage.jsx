import { useState } from "react";
import { Nav, Tab, Container } from "react-bootstrap";
import BirthdayReport from "./BirthdayReport";
import ExpiredPoliciesReport from "./ExpiredPoliciesReport";
import ExpiringSoonReport from "./ExpiringSoonReport";
import NoActivePoliciesReport from "./NoActivePoliciesReport";
import OverdueInvoicesReport from "./OverdueInvoicesReport";
import RevenueReport from "./RevenueReport";

const ReportsPage = () => {
  const [activeKey, setActiveKey] = useState("birthdays");

  return (
    <Container fluid className="mt-4">
      <h3>Reports</h3>

      <Tab.Container activeKey={activeKey} onSelect={k => setActiveKey(k)}>
        <Nav variant="tabs" className="mt-3">
          <Nav.Item>
            <Nav.Link eventKey="birthdays">Birthdays</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="expired">Expired Policies</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="expiring">Expiring Soon</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="no-active">No Active Policies</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="overdue">Overdue Invoices</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="revenue">Revenue</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="mt-3">
          <Tab.Pane eventKey="birthdays">
            <BirthdayReport />
          </Tab.Pane>
          <Tab.Pane eventKey="expired">
            <ExpiredPoliciesReport />
          </Tab.Pane>
          <Tab.Pane eventKey="expiring">
            <ExpiringSoonReport />
          </Tab.Pane>
          <Tab.Pane eventKey="no-active">
            <NoActivePoliciesReport />
          </Tab.Pane>
          <Tab.Pane eventKey="overdue">
            <OverdueInvoicesReport />
          </Tab.Pane>
          <Tab.Pane eventKey="revenue">
            <RevenueReport />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default ReportsPage;
