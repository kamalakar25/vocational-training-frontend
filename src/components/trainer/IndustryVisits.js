import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/industryVisit.css";

const IndustryVisitLogs = () => {
  const [visitLogs, setVisitLogs] = useState([]);
  const [formValues, setFormValues] = useState({
    date: "",
    location: "",
    participants: "",
    purpose: "",
    outcome: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});

  // Retrieve email from localStorage
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchVisitLogs = async () => {
      try {
        const response = await axios.get(`https://vocational-training-backend.onrender.com/api/visitLogs/${email}`);
        if (response.status === 200) {
          setVisitLogs(response.data);
        }
      } catch (error) {
        console.error("Error fetching visit logs:", error);
      }
    };

    fetchVisitLogs();
  }, [email]);

  
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`https://vocational-training-backend.onrender.com/api/visitLogs/${id}`);
      if (response.status === 200) {
        setVisitLogs((prevLogs) => prevLogs.filter((log) => log._id !== id));
      }
    } catch (error) {
      console.error("Error deleting visit log:", error);
      alert("Failed to delete visit log. Please try again.");
    }
  };


  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

 // Form Validations
 const validateForm = () => {
  const newErrors = {};
  const today = new Date();
  const oneMonthLater = new Date(today);
  const oneYearLater = new Date(today);

  oneMonthLater.setMonth(today.getMonth() + 1); // Set one month ahead
  oneYearLater.setFullYear(today.getFullYear() + 1); // Set one year ahead

  const selectedDate = new Date(formValues.date);

  if (!formValues.date) {
    newErrors.date = "Date is required.";
  } else if (selectedDate < today) {
    newErrors.date = "Date cannot be in the past.";
  } else if (selectedDate > oneYearLater) {
    newErrors.date = "Date cannot be scheduled more than one year in advance.";
  } else if (selectedDate > oneMonthLater) {
    newErrors.date = "Date must be scheduled within a month span.";
  }

  if (!formValues.location.trim()) {
    newErrors.location = "Location is required.";
  }

  if (!formValues.participants.trim()) {
    newErrors.participants = "Participants field is required.";
  } else if (!/^\d+\s.+/.test(formValues.participants)) {
    newErrors.participants =
      "Participants should include a number followed by a description (e.g., '20 students').";
  }

  if (!formValues.purpose.trim()) {
    newErrors.purpose = "Purpose is required.";
  }

  if (!formValues.outcome.trim()) {
    newErrors.outcome = "Outcome is required.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0; // Return true if no errors
};


  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    const visitLog = { ...formValues }; // Prepare visit log object

    try {
      const response = await axios.post("https://vocational-training-backend.onrender.com/api/visitLogs", { email, visitLog });
      if (response.status === 201) {
        setVisitLogs((prevLogs) => [...prevLogs, visitLog]); // Append new log
        setFormValues({ date: "", location: "", participants: "", purpose: "", outcome: "" });
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error adding visit log:", error);
      alert("Failed to add visit log. Please try again.");
    }
  };




  return (
    <div className="industry-visit-logs">
      <h1>Industry Visit Logs</h1>
      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Form" : "Add New Visit"}
      </button>

      
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formValues.date}
              onChange={handleInputChange}
              className={`form-control ${errors.date ? "is-invalid" : ""}`}
              required
            />
            {errors.date && <div className="invalid-feedback">{errors.date}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formValues.location}
              onChange={handleInputChange}
              className={`form-control ${errors.location ? "is-invalid" : ""}`}
              required
            />
            {errors.location && <div className="invalid-feedback">{errors.location}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="participants">Participants:</label>
            <input
              type="text"
              id="participants"
              name="participants"
              value={formValues.participants}
              onChange={handleInputChange}
              className={`form-control ${errors.participants ? "is-invalid" : ""}`}
              required
            />
            {errors.participants && <div className="invalid-feedback">{errors.participants}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="purpose">Purpose:</label>
            <textarea
              id="purpose"
              name="purpose"
              value={formValues.purpose}
              onChange={handleInputChange}
              className={`form-control ${errors.purpose ? "is-invalid" : ""}`}
              required
            ></textarea>
            {errors.purpose && <div className="invalid-feedback">{errors.purpose}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="outcome">Outcome:</label>
            <textarea
              id="outcome"
              name="outcome"
              value={formValues.outcome}
              onChange={handleInputChange}
              className={`form-control ${errors.outcome ? "is-invalid" : ""}`}
              required
            ></textarea>
            {errors.outcome && <div className="invalid-feedback">{errors.outcome}</div>}
          </div>

          <button type="submit" className="btn btn-success mt-2">
            Submit
          </button>
        </form>
      )}

      <div className="logs mt-5">
        <h2>Logged Visits</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Location</th>
              <th>Participants</th>
              <th>Purpose</th>
              <th>Outcome</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visitLogs.map((log, index) => (
              <tr key={index}>
                <td>{log.date}</td>
                <td>{log.location}</td>
                <td>{log.participants}</td>
                <td>{log.purpose}</td>
                <td>{log.outcome}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(log._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndustryVisitLogs;
