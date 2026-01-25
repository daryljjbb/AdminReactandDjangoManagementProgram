import { useEffect, useState } from "react";
import api from "../api/axios";
import { Table, Button, Spinner } from "react-bootstrap";
import UploadDocumentModal from "./UploadDocumentModal";

const DocumentsTab = ({ customerId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  // Reusable fetch function
  const fetchDocuments = () => {
    setLoading(true);

    api.get(`documents/?customer=${customerId}`)
      .then(res => {
        const data = res.data;

        // DRF paginated response
        if (data && Array.isArray(data.results)) {
          setDocuments(data.results);
        }
        // Raw array fallback
        else if (Array.isArray(data)) {
          setDocuments(data);
        }
        // Unexpected shape
        else {
          console.error("Unexpected documents response:", data);
          setDocuments([]);
        }
      })
      .catch(err => {
        console.error("Document fetch error:", err);
        setDocuments([]);
      })
      .finally(() => setLoading(false));
  };

  // Load on mount + when customer changes
  useEffect(() => {
    fetchDocuments();
  }, [customerId]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Customer Documents</h5>
        <Button onClick={() => setShowUpload(true)}>Upload Document</Button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Uploaded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  No documents uploaded yet
                </td>
              </tr>
            ) : (
              documents.map(doc => (
                <tr key={doc.id}>
                  <td>{doc.file_name}</td>
                  <td>{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                  <td>
                    <a href={doc.file_url} target="_blank" rel="noreferrer">
                      View
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      <UploadDocumentModal
        show={showUpload}
        onHide={() => setShowUpload(false)}
        customerId={customerId}
        onUploaded={fetchDocuments} // refresh after upload
      />
    </div>
  );
};

export default DocumentsTab;
