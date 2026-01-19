import NavigationBar from "./Navbar";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Outlet } from "react-router-dom"; // Add this
import useAuth from "../hooks/useAuth";

export default function Layout() {
    const { isAdmin } = useAuth();
  return (
    <>
      <NavigationBar />
      <Container fluid>
        <Row>
          {/* SIDEBAR */}
          <Col md={2} className="bg-light vh-100 p-3 shadow-sm d-none d-md-block">
            <Nav className="flex-column">
                <LinkContainer to="/dashboard">
                    <Nav.Link>Dashboard</Nav.Link>
                </LinkContainer>
                
                <LinkContainer to="/customers">
                    <Nav.Link>Customers</Nav.Link>
                </LinkContainer>


                {/* ✅ ONLY SHOW TO ADMINS */}
                {isAdmin && (
                    <>
                    <hr />
                    <h6 className="px-3 text-muted">Management</h6>
                    <LinkContainer to="/admin-dashboard">
                        <Nav.Link className="text-danger">Admin Dashboard</Nav.Link>
                    </LinkContainer>
                    </>
                )}
            </Nav>
          </Col>

          {/* MAIN CONTENT AREA */}
          <Col md={10} className="p-4">
            {/* This is where your Invoices or Customers pages will appear */}
            <Outlet /> 
          </Col>
        </Row>
      </Container>
    </>
  );
}