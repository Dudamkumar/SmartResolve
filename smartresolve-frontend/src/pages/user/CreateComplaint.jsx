import { useNavigate } from "react-router-dom";

import AppLayout from "../../components/layout/AppLayout";
import ComplaintForm from "../../components/complaints/ComplaintForm";

export default function CreateComplaint() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="page-container">

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Dashboard
        </button>

        <ComplaintForm
          onCreated={async () => {
            // Keep user on the form so they can
            // submit another complaint if needed.
          }}
        />

      </div>
    </AppLayout>
  );
}