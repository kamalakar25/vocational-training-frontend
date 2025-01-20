import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../assets/styles/navbar.css";

const Navbar = ({ setGeolocation, role }) => {
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false); // Track if user has checked in
  const [checkInTime, setCheckInTime] = useState(null);
  const [isCheckedOut, setIsCheckedOut] = useState(false); // Track if user has checked out

  useEffect(() => {

    const email = localStorage.getItem("email");
    if (!email) {
      // Redirect to login page if not logged in
      navigate("/login");
    }

    
    // Get geolocation dynamically if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          Swal.fire({
            icon: "error",
            title: "Location Error",
            text: "Could not get your location. Please enable location services.",
          });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [navigate]);
  useEffect(() => {
    const fetchCheckInStatus = async () => {
      const email = localStorage.getItem("email");
      if (!email) return;
  
      try {
        const response = await fetch(`https://vocational-training-backend.onrender.com/checkin-status?email=${email}`);
        if (!response.ok) throw new Error("Failed to fetch check-in status");
  
        const data = await response.json();
  
        if (data.isCheckedIn) {
          setIsCheckedIn(true);
          setCheckInTime(new Date(data.checkInTime));
          localStorage.setItem("isCheckedIn", "true");
          localStorage.setItem("checkInTime", data.checkInTime);
        } else {
          setIsCheckedIn(false);
          localStorage.removeItem("isCheckedIn");
          localStorage.removeItem("checkInTime");
        }
  
        if (data.isCheckedOut) {
          setIsCheckedOut(true);
          localStorage.setItem("isCheckedOut", "true");
        } else {
          setIsCheckedOut(false);
          localStorage.removeItem("isCheckedOut");
        }
      } catch (error) {
        console.error("Error fetching check-in status:", error);
      }
    };
  
    // Load persisted state from localStorage on component mount
    const persistedCheckIn = localStorage.getItem("isCheckedIn") === "true";
    const persistedCheckInTime = localStorage.getItem("checkInTime");
    const persistedCheckOut = localStorage.getItem("isCheckedOut") === "true";
  
    if (persistedCheckIn) {
      setIsCheckedIn(true);
      setCheckInTime(new Date(persistedCheckInTime));
    }
  
    if (persistedCheckOut) {
      setIsCheckedOut(true);
    }
  
    // Fetch backend status
    fetchCheckInStatus();
  }, []);
  
  useEffect(() => {
    window.addEventListener("popstate", () => {
      if (!localStorage.getItem("email")) {
        navigate("/login"); // Redirect to login if user is not logged in
      }
    });
  
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", () => {});
    };
  }, [navigate]);
  


  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from the application.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log me out!",
      cancelButtonText: "Cancel",
    });
  
    if (result.isConfirmed) {
      // Clear localStorage data
      localStorage.removeItem("email");
      localStorage.removeItem("isCheckedIn");
      localStorage.removeItem("checkInTime");
      localStorage.removeItem("isCheckedOut");
      localStorage.removeItem("trainerGeolocation");
  
      // Show success message
      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully!",
      }).then(() => {
        // Redirect to login page
        navigate("/login");
      });
    }
  };
  
  const handleCheckinButtonClick = async () => {
    const email = localStorage.getItem("email");
    if (!latitude || !longitude || !email) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enable location services and ensure you're logged in.",
      });
      return;
    }
  
    try {
      const result = await Swal.fire({
        title: "Do you want to check in?",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        icon: "question",
      });
  
      if (!result.isConfirmed) return;
  
      const response = await fetch("https://vocational-training-backend.onrender.com/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          latitude,
          longitude,
          checkInTime: new Date().toISOString(),
        }),
      });
  
      if (!response.ok) throw new Error("Failed to check in");
  
      const data = await response.json();
      setIsCheckedIn(true);
      setCheckInTime(new Date(data.checkInTime));
      setIsCheckedOut(false);
  
      localStorage.setItem("isCheckedIn", "true");
      localStorage.setItem("checkInTime", data.checkInTime);
      localStorage.removeItem("isCheckedOut");
  
      Swal.fire({
        icon: "success",
        title: "Check-in Successful",
        text: `You checked on ${checkInTime.toLocaleDateString()} Successfully.`,
      });
      
    } catch (error) {
      console.error("Check-in error:", error);
      Swal.fire({
        icon: "error",
        title: "Check-in Failed",
        text: "An error occurred while checking in. Please try again.",
      });
    }
  };
  
  const handleCheckoutButtonClick = async () => {
    const email = localStorage.getItem("email");
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please log in to check out.",
      });
      return;
    }
  
    try {
      const result = await Swal.fire({
        title: "Do you want to check out?",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        icon: "question",
      });
  
      if (!result.isConfirmed) return;
  
      const response = await fetch("https://vocational-training-backend.onrender.com/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          latitude,
          longitude,
        }),
      });
  
      if (!response.ok) throw new Error("Failed to check out");
  
      const data = await response.json();
      setIsCheckedIn(false);
      setIsCheckedOut(true);
  
      localStorage.removeItem("isCheckedIn");
      localStorage.removeItem("checkInTime");
      localStorage.setItem("isCheckedOut", "true");
  
      Swal.fire({
        icon: "success",
        title: "Check-out Successful",
        html: `
          <p>You checked out at:</p>
          <strong>Date:</strong> ${new Date(data.checkOutTime).toLocaleDateString()}<br>
          <strong>Your Checked Out Time has been stored Successfully</strong>
        `,
      });
      
          // <strong>Time:</strong> ${new Date(data.checkOutTime).toLocaleTimeString()}<br>
          // <strong>Location:</strong> Latitude ${latitude}, Longitude ${longitude}.
    } catch (error) {
      console.error("Check-out error:", error);
      Swal.fire({
        icon: "error",
        title: "Check-out Failed",
        text: "An error occurred while checking out. Please try again.",
      });
    }
  };
  
  
  
  
  

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-gradient">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-uppercase">
          Vocational App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {role === "trainer" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/trainer/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/trainer/profile">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/trainer/attendance">
                    Attendance
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link className="nav-link" to="/trainer/industry-visits">
                    Industry Visits
                  </Link>
                </li> */}
                <li className="nav-item">
                  <Link className="nav-link" to="/trainer/reports">
                    Reports
                  </Link>
                </li>
                <li className="nav-item">
                  {isCheckedIn ? (
                    <button
                      onClick={handleCheckoutButtonClick}
                      className="login-button"
                    >
                      Check-out
                    </button>
                  ) : (
                    <button
                      onClick={handleCheckinButtonClick}
                      className="login-button"
                    >
                      Check-in
                    </button>
                  )}
                </li>
              </>
            )}

            {role === "coordinator" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/coordinator/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/coordinator/trainers">
                    Trainers
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/coordinator/trainees">
                    Trainees
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/coordinator/reports">
                    Reports
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <button onClick={handleLogout} className="btn btn-danger mx-2">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
