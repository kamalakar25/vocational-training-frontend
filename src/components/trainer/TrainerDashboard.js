import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './TrainerDashboard.css';

const TrainerDashboard = () => {
  const location = useLocation();
  const [trainerData, setTrainerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        // Get email from localStorage or your authentication system
        const email = localStorage.getItem('email');
        console.log('Fetching data for email:', email);

        const response = await fetch(`https://vocational-training-backend.onrender.com/trainer/${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch trainer data');
        }

        const data = await response.json();
        console.log('Received trainer data:', data);
        setTrainerData(data);
        setNotificationHistory(data.messages); // Initialize history from messages
      } catch (err) {
        console.error('Error fetching trainer data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, []);


  const handleLectureResponse = async (response, lecture) => {
    const email = localStorage.getItem('email');
    const lectureId = lecture._id;

    console.log(`Attempting to ${response} the guest lecture with ID: ${lectureId}`);  // Log action

    try {
      const responseData = await fetch("https://vocational-training-backend.onrender.com/update-guest-lecture-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, lectureId, status: response }),
      });

      if (!responseData.ok) {
        throw new Error("Failed to update lecture status");
      }

      const updatedData = await responseData.json();
      console.log("Lecture status updated:", updatedData);  // Log the response data

      // Update the trainer data locally after the response
      setTrainerData((prevData) => {
        const updatedLectures = prevData.guestLectures.map((lectureItem) => {
          if (lectureItem._id === lectureId) {
            return { ...lectureItem, status: response };  // Update status
          }
          return lectureItem;
        });

        return { ...prevData, guestLectures: updatedLectures };  // Update state with new lecture data
      });
    } catch (err) {
      console.error("Error updating guest lecture status:", err);
      setError("Failed to update lecture status. Please try again.");
    }
  };


  const handleMarkAsRead = async (index) => {
    const updatedMessages = [...trainerData.messages];
    const messageId = updatedMessages[index]._id;
    const trainerId = trainerData._id;

    console.log("Sending request with trainerId:", trainerId, "and messageId:", messageId);

    try {
      const response = await fetch("https://vocational-training-backend.onrender.com/mark-notification-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trainerId, messageId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update notification status");
      }

      const data = await response.json();
      console.log("Notification marked as read:", data);

      updatedMessages[index].isRead = true;
      setTrainerData({ ...trainerData, messages: updatedMessages });

      // Optional: Set a 24-hour timeout to remove the notification from the list
      setTimeout(() => {
        setTrainerData((prevData) => ({
          ...prevData,
          messages: prevData.messages.filter((_, i) => i !== index),
        }));
      }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    } catch (err) {
      console.error("Error marking notification as read:", err);
      setError("Failed to update notification status. Please try again.");
    }
  };




  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-container">
        {/* Trainer Dashboard Heading */}
        <h1 className="dashboard-heading">
          <i className="fa fa-tachometer-alt"></i> Trainer Dashboard
        </h1>

        {/* More Text Below */}
        <p className="dashboard-description">
          Welcome to the Trainer Dashboard! Here you can manage all your training sessions, view
          client progress, and track your fitness programs. Stay organized and on top of your
          training goals with ease.
        </p>
      </div>

      {/* Trainer Info and Notifications in Same Row */}
      <div className="row">
        {/* Trainer Info Section (col-6) */}
        <div className="col-6 trainer-info-container"  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="dashboard-section card trainer-card" style={{ background: "linear-gradient(180deg, rgba(255, 255, 255, 0.93) , rgba(227, 104, 10, 0.93))" }}>
            <h2 className="section-title text-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa fa-user" style={{ marginRight: '10px' }}></i> Trainer Information
            </h2>

            <div className="text-center img" style={{ marginTop: '20px' }}>
              <img
                src={require('../../assets/images/trainer.png')}
                alt="Trainer"
                style={{
                  width: '300px', // Fixed small size
                  height: 'auto',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  maxWidth: '100%', // Make it responsive on smaller screens
                }}
              />

            </div>

            <p className="text-center" style={{ marginTop: '20px' }}>
              Our expert trainer brings years of experience and knowledge to help you achieve your goals.
              With a strong background in various fields, they provide tailored strategies and personalized advice.
            </p>
            <div className="trainer-info my-2">
              <p><strong>Name:</strong> {trainerData.name}</p>
              <p><strong>Email:</strong> {trainerData.email}</p>
              <p><strong>Contact:</strong> {trainerData.contact}</p>
              <p><strong>Subject:</strong> {trainerData.subject}</p>
            </div>
          </div>
        </div>


        {/* Notifications Section (col-6) */}
        <div className="col-6 notifications-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="dashboard-section card trainer-card " style={{ background: "linear-gradient(180deg, rgba(255, 255, 255, 0.93) , rgba(227, 104, 10, 0.93))" }}>
            <h2 className="section-title text-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa fa-bell" style={{ marginRight: '10px' }}></i> Notifications
            </h2>
            <div className="notification-list my-5">
              {trainerData?.messages?.length > 0 ? (
                trainerData.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`notification-item ${message.status === 'read' ? 'read' : 'unread'} card-animation`}
                    style={{
                      backgroundColor: message.status === 'read' ? '#d4edda' : 'lightgray',
                      color: 'black'
                    }}

                  >
                    <p>
                      <strong>Type:</strong> {message.messageType}
                    </p>
                    <p>
                      <strong>Message:</strong> {message.customMessage}
                    </p>
                    <p>
                      <strong>Sent At:</strong> {new Date(message.sentAt).toLocaleString()}
                    </p>
                    {message.status !== 'read' && (
                      <button
                        onClick={() => handleMarkAsRead(index)}
                        className="mark-as-read-button"
                      >
                        <i className="fa fa-check"></i> Mark as Read
                      </button>

                    )}
                  </div>
                ))
              ) : (
                <p className="no-notifications">
                  You have read all notifications till now.
                </p>
              )}
            </div>
            <button
              className="history-button"
              onClick={() => setShowHistoryModal(true)}
            >
              <i className="fa fa-history"></i> View Notification History
            </button>
          </div>
        </div>
      </div>


      {/* Notification History Modal */}
      {showHistoryModal && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <h1>Notification History</h1>
            <button
              className="close-modal-button mt-3"
              onClick={() => setShowHistoryModal(false)}
            >
              <i className="fa fa-times"></i>   Close
            </button>

            <div className="history-list mt-2">
              {notificationHistory.length > 0 ? (
                notificationHistory.map((message, index) => (
                  <div key={index} className="history-itemmt mt-5">
                    <p>
                      <strong>Type:</strong> {message.messageType}
                    </p>
                    <p>
                      <strong>Message:</strong> {message.customMessage}
                    </p>
                    <p>
                      <strong>Sent At:</strong>{" "}
                      {new Date(message.sentAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="no-history mt-3">No history available.</p>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Work Assignments Section */}
      <div className="dashboard-section">
        <div className="row" style={{ background: "linear-gradient(180deg, rgba(255, 255, 255, 0.93), rgba(227, 104, 10, 0.93))" }}>
          {/* Column 1: Image */}
          <div className="col-6 col-md-6 my-5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="image-container">
              <img
                src="https://st3.depositphotos.com/7865540/12756/i/450/depositphotos_127563976-stock-photo-notepad-with-text-in-frame.jpg"
                alt="Work Assignments"
                className="work-assignments-image img-fluid"
              />
            </div>
          </div>
          {/* Column 2: Content */}
          <div className="col-12 col-6  my-5">
            {/* Additional Text and Points */}
            <div className="work-assignments-info">
              <h2 className="section-title text-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa fa-tasks" style={{ marginRight: '10px' }}></i> Work Assignments
              </h2>

              <p className="info-description text-center text-dark mt-4">
                Work assignments are essential for ensuring that all tasks are assigned to the right individuals
                and completed within the set deadlines. Here are some key points about how we manage work assignments:
              </p>
              <ul className="info-points">
                <div className="row mt-4">
                  <div className="col-6 col-md-6">
                    <li>
                      <i className="fa fa-check-circle"></i> Task assignment is based on skill sets.
                    </li>
                    <li>
                      <i className="fa fa-check-circle"></i> Deadlines are tracked monitored regularly.
                    </li>
                  </div>
                  <div className="col-6 col-md-6">
                    <li>
                      <i className="fa fa-check-circle"></i> Frequent communication ensures smooth progress.
                    </li>
                    <li>
                      <i className="fa fa-check-circle"></i> Regular feedback and support are provided.
                    </li>
                  </div>
                </div>
              </ul>
            </div>

            <div className="work-assignments">
              {trainerData?.workAssignments?.length > 0 ? (
                trainerData.workAssignments.map((work, index) => (
                  <div key={index} className="work-item card-animation card">
                    <h3>{work.title}</h3>
                    <p className="work-description">{work.description}</p>
                    <div className="work-details">
                      <p>Deadline: {new Date(work.deadline).toLocaleDateString()}</p>
                      <p>Assigned by: {work.assignedBy}</p>
                    </div>
                    <div className="work-icons">
                      <i className="fa fa-clock"></i> <span>Due in {Math.floor((new Date(work.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days</span>
                      <i className="fa fa-user"></i> <span>{work.assignedBy}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data text-danger text-center animated-box">
                  No work assignments available
                </p>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className='row'>
        <div className='col-6 custom-schedule'>
          {/* Schedule Section */}
          <div className="custom-dashboard-section">
            <h2 className="custom-section-title" style={{ color: "rgb(255,136,67)" }}>
              <i className="fa fa-calendar"></i> <b>Schedule</b>
            </h2>
            <p className='mt-3 text-dark'>
              They handle communication with clients, confirming appointment details, addressing concerns, and providing necessary information.
            </p>

            <div className="custom-schedule-list">
              {trainerData?.schedule?.length > 0 ? (
                <div className="row">
                {trainerData.schedule.map((scheduleItem, index) => (
                  <div key={index} className="col-md-6 mb-4">
                  <div className="custom-schedule-item custom-card-animation custom-card card">
                    <p><strong>Date:</strong> {new Date(scheduleItem.date).toLocaleDateString()}</p>
                    <p><strong>Subject:</strong> {scheduleItem.subject}</p>
                    <p><strong>Start Time:</strong> {scheduleItem.startTime}</p>
                    <p><strong>End Time:</strong> {scheduleItem.endTime}</p>
                  </div>
                  </div>
                ))}
    </div>
              ) : (
                <p className="no-data text-danger">No schedule entries available</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-6 custom-visit-log" style={{ borderLeft: '2px solid rgba(227, 104, 10, 0.93)' }}>
          {/* Visit Log Section */}
          <div className="custom-dashboard-section">
            <h2 className="custom-section-title" style={{ color: 'rgb(255,136,67)' }}>
              <i className="fa fa-map-marker-alt"></i> <b>Guest Lecture</b>
            </h2>
            <p className="mt-3 text-dark">
              The Guest Lecture feature allows for efficient tracking and management of scheduled training sessions. It records all details related to a session.
            </p>

            {trainerData?.guestLectures?.length > 0 ? (
              <div className='row'>
              {trainerData.guestLectures.map((lecture, index) => (
                <div key={index} className="col-md-4 mb-4">
                  <div className="custom-visit-item custom-card-animation custom-card card">
                    <h3>{lecture.eventTopic}</h3>
                    <p><strong>Lecturer:</strong> {lecture.lecturerName}</p>
                    <p><strong>Event Date:</strong> {new Date(lecture.eventDate).toLocaleDateString()}</p>
                    <p><strong>Location:</strong> {lecture.eventLocation}</p>
                    <p><strong>Start Time:</strong> {lecture.startTime}</p>
                    <p><strong>End Time:</strong> {lecture.endTime}</p>
                    <p><strong>Participants:</strong> {lecture.numberOfParticipants}</p>
                  </div>
                </div>
              
              ))}
              </div>
            ) : (
              <p className="no-data text-danger">No Lectures assigned</p>
            )}

          </div>
        </div>


      </div>



      {/* Reports Section */}
      <div className="row mt-5" style={{
        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.93), rgba(227, 104, 10, 0.93))",
      }}>
        {/* Column 1: Image */}
        <div className="col-6 col-md-6 my-5">
          {/* Reports Section */}
          <div className="dashboard-section">
            <h2 className="section-title fade-in text-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
              <i className="fa fa-file-alt me-2"></i> Reports Overview
            </h2>
            <p className="section-description text-center text-dark fade-in mt-4">
              Stay updated with the latest progress reports, including trainer insights,
              task status, and future recommendations. Each report highlights key metrics
              for improved performance tracking.
            </p>

            <div className="reports-list row">
              {trainerData?.reports?.length > 0 ? (
                trainerData.reports.map((report, index) => (
                  <div
                    key={index}
                    className="col-lg-4 col-md-6 col-sm-12 mb-4 report-item card-animation card shadow-sm"
                  >
                    <div className="card-body">
                      <h3 className="card-title d-flex align-items-center">
                        <i className="fa fa-folder-open me-2"></i> {report.title}
                      </h3>
                      <p className="card-text">{report.description}</p>
                      <ul className="report-details list-unstyled">
                        <li>
                          <i className="fa fa-calendar-alt me-2"></i>
                          <strong>Date:</strong> {new Date(report.date).toLocaleDateString()}
                        </li>
                        <li>
                          <i className="fa fa-user-tie me-2"></i>
                          <strong>Trainer:</strong> {trainerData.name || "N/A"}
                        </li>
                      </ul>
                      <a href={report.link || "/trainer/reports"} className="btn btn-primary btn-sm report-link">
                        <i className="fa fa-eye me-2"></i> My Reports
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data text-center text-danger">No reports available</p>
              )}
            </div>
          </div>
        </div>
        {/* Column 2: Content */}
        <div className="col-12 col-md-6  my-5">
          {/* Additional Text and Points */}

          <div className="image-container">
            <img
              src="https://img.freepik.com/premium-photo/painting-people-sitting-couch-with-one-reading-book_1293074-185969.jpg"
              alt="Work Assignments"
              className="work-assignments-image img-fluid"
            />
          </div>



        </div>

      </div>
    </div>
  );
};

export default TrainerDashboard;