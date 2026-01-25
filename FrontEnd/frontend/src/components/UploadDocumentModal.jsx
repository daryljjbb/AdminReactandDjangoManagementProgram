import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../api/axios";

const UploadDocumentModal = ({ show, onHide, customerId, onUploaded }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("customer", customerId);

    await api.post("documents/", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    onUploaded();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Upload Document</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group>
          <Form.Label>Select File</Form.Label>
          <Form.Control
            type="file"
            onChange={e => setFile(e.target.files[0])}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleUpload}>Upload</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadDocumentModal;
