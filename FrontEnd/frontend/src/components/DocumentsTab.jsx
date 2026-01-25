import { useEffect, useState } from "react";
import api from "../api/axios";
import { Table, Button, Spinner } from "react-bootstrap";
import UploadDocumentModal from "./UploadDocumentModal";
import { toast } from "react-hot-toast";

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

  const [deleteId, setDeleteId] = useState(null);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
    toast("Are you sure you want to delete this document?", {
        icon: "⚠️",
    });
    };


const confirmDelete = () => {
  const toastId = toast.loading("Deleting document...");

  api.delete(`documents/${deleteId}/`)
    .then(() => {
      toast.success("Document deleted successfully!", { id: toastId });
      fetchDocuments();
      setShowDeleteConfirm(false);
    })
    .catch(err => {
      console.error("Delete error:", err);
      toast.error("Failed to delete document.", { id: toastId });
    });
};



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
                    <a href={doc.file_url} target="_blank" rel="noreferrer" className="me-3">
                        View
                    </a>

                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                    >
                        Delete
                    </Button>
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
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
        <div className="modal-backdrop fade show"></div>
        )}

        <div
        className={`modal fade ${showDeleteConfirm ? "show d-block" : ""}`}
        tabIndex="-1"
        >
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                type="button"
                className="btn-close"
                onClick={() => setShowDeleteConfirm(false)}
                ></button>
            </div>
            <div className="modal-body">
                <p>Are you sure you want to delete this document?</p>
            </div>
            <div className="modal-footer">
                <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
                </Button>
                <Button variant="danger" onClick={confirmDelete}>
                Delete
                </Button>
            </div>
            </div>
        </div>
        </div>

    </div>
  );
};

export default DocumentsTab;
