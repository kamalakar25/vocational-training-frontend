import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Reports.css"; // Custom CSS file

export default function Reports() {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [reportDetails, setReportDetails] = useState({
    title: "",
    description: "",
    date: "",
  });

  // Fetch trainers
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get("https://vocational-training-backend.onrender.com/users");
        const trainers = response.data.filter((user) => user.role === "trainer");
        setTrainers(trainers);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };
    fetchTrainers();
  }, []);

  // Handle Report Submission
  const handleAddReport = async () => {
    if (!reportDetails.title || !reportDetails.description || !reportDetails.date) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await axios.post("https://vocational-training-backend.onrender.com/reports", {
        email: selectedTrainer.email,
        report: reportDetails,
      });

      alert("Report added successfully!");
      setReportDetails({ title: "", description: "", date: "" });
      // Close the modal programmatically
      const modal = document.getElementById("addReportModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
    } catch (error) {
      console.error("Error adding report:", error);
      alert("Failed to add report.");
    }
  };

  return (
    <div>
      <h2>Trainer Reports</h2>
      <div className="trainer-cards">
        {trainers.map((trainer) => (
          <div key={trainer._id} className="trainer-card">
            <h3>{trainer.name}</h3>
            <p>Email: {trainer.email}</p>
            <p>Contact: {trainer.contact}</p>
            <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#addReportModal"
              onClick={() => setSelectedTrainer(trainer)}
            >
              Add Report
            </button>
          </div>
        ))}
      </div>

      {/* Bootstrap Modal */}
      <div
        className="modal fade"
        id="addReportModal"
        tabIndex="-1"
        aria-labelledby="addReportModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addReportModalLabel">
                Add Report for {selectedTrainer?.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="reportTitle" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="reportTitle"
                  value={reportDetails.title}
                  onChange={(e) =>
                    setReportDetails({ ...reportDetails, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="reportDescription" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="reportDescription"
                  rows="3"
                  value={reportDetails.description}
                  onChange={(e) =>
                    setReportDetails({
                      ...reportDetails,
                      description: e.target.value,
                    })
                  }
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="reportDate" className="form-label">
                  Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="reportDate"
                  value={reportDetails.date}
                  onChange={(e) =>
                    setReportDetails({ ...reportDetails, date: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddReport}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
