import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CoordinatorProfile.css";

const CoordinatorProfile = () => {
  const [coordinator, setCoordinator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("email");
    console.log("Email from localStorage:", email);
    if (!email) {
      setError("Email not found in local storage");
      setLoading(false);
      return;
    }
  
    // Fetch coordinator details from the backend
    const fetchCoordinator = async () => {
      try {
        const response = await axios.get(`https://vocational-training-backend.onrender.com/coordinator/${email}`);
        setCoordinator(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);  // Log the error for better debugging
        setError("Error fetching coordinator details");
        setLoading(false);
      }
    };
  
    fetchCoordinator();
  }, []);
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h1>Coordinator Profile</h1>
      <div className="card">
        <h2>{coordinator.name}</h2>
        <p><strong>Email:</strong> {coordinator.email}</p>
        <p><strong>Contact:</strong> {coordinator.contact}</p>
        <p><strong>Subject:</strong> {coordinator.subject}</p>
      </div>
    </div>
  );
};

export default CoordinatorProfile;
