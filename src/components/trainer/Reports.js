import React, { useEffect, useState } from "react";
import axios from "axios";
import './ReportsDisplay.css'; // Include your CSS file for custom styling

export default function ReportsDisplay() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("email");  // Retrieve the email from local storage

    if (!email) {
      setError("No email found in local storage.");
      setLoading(false);
      return;
    }

    const fetchReports = async () => {
      try {
        const response = await axios.get(`https://vocational-training-backend.onrender.com/reports/${email}`);
        setReports(response.data.reports);
      } catch (err) {
        setError("Failed to fetch reports.");
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="reports-containers">
      <h2 className="reports-title" style={{ color:"rgba(227, 104, 10, 0.93)" }}>My Reports</h2>
      {reports.length > 0 ? (
        <div className="reports-grid">
          {reports.map((report, index) => (
            <div key={index} className="report-card custom-card-animation">
              <h4 className="report-title">{report.title}</h4>
              <p className="report-description">{report.description}</p>
              <p className="report-date"><strong>Date:</strong> {report.date}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No reports have been added yet.</p>
      )}
    </div>
  );
}
