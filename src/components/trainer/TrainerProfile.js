import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TrainerProfile.css";

const TrainerProfile = () => {
  const [trainerDetails, setTrainerDetails] = useState(null);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    subject: "",
  });
  const [scheduleData, setScheduleData] = useState([]);
  const [overlapIndices, setOverlapIndices] = useState([]); // Track conflicting rows

  useEffect(() => {
    const loggedInEmail = localStorage.getItem("email");
    if (loggedInEmail) {
      fetchTrainerDetails(loggedInEmail);
    } else {
      setError("No email found. Please log in.");
    }
  }, []);

  const fetchTrainerDetails = async (email) => {
    try {
      const response = await axios.get(`https://vocational-training-backend.onrender.com/trainer/${email}`);
      setTrainerDetails(response.data);
      setFormData({
        name: response.data.name,
        contact: response.data.contact,
        subject: response.data.subject,
      });
      if (response.data.schedule && response.data.schedule.length) {
        setScheduleData(response.data.schedule);
      }
    } catch (err) {
      setError("Failed to fetch trainer details.");
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://vocational-training-backend.onrender.com/trainer/${trainerDetails.email}`,
        formData
      );
      if (response.status === 200) {
        setTrainerDetails(response.data.trainer);
        setEditMode(false);
        alert("Profile updated successfully");
      }
    } catch (err) {
      alert("Error updating profile");
    }
  };

  const convertToMinutes = (time) => {
    const [hours, minutes] = time.split(":");
    return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
  };

  const findOverlappingIndices = (schedule) => {
    const overlappingIndices = [];
    for (let i = 0; i < schedule.length; i++) {
      const { date: date1, startTime: start1, endTime: end1 } = schedule[i];
      const start1Minutes = convertToMinutes(start1);
      const end1Minutes = convertToMinutes(end1);

      for (let j = i + 1; j < schedule.length; j++) {
        const { date: date2, startTime: start2, endTime: end2 } = schedule[j];
        const start2Minutes = convertToMinutes(start2);
        const end2Minutes = convertToMinutes(end2);

        if (
          date1 === date2 &&
          ((start1Minutes < end2Minutes && start2Minutes < end1Minutes) ||
            start1Minutes === start2Minutes)
        ) {
          overlappingIndices.push(i, j);
        }
      }
    }
    return [...new Set(overlappingIndices)];
  };

  const handleScheduleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSchedule = [...scheduleData];
    updatedSchedule[index][name] = value;

    // Check if the start and end times meet the 1-hour minimum difference
    const { startTime, endTime } = updatedSchedule[index];
    if (startTime && endTime) {
      const startMinutes = convertToMinutes(startTime);
      const endMinutes = convertToMinutes(endTime);

      if (endMinutes - startMinutes < 60) {
        alert("The duration between Start Time and End Time must be at least 1 hour.");
        return; // Stop further changes if validation fails
      }
    }

    setScheduleData(updatedSchedule);

    // Update overlap detection
    const overlaps = findOverlappingIndices(updatedSchedule);
    setOverlapIndices(overlaps);
  };


  const handleAddSchedule = () => {
    setScheduleData([
      ...scheduleData,
      { subject: "", date: "", startTime: "", endTime: "" },
    ]);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();

    // Validate schedule data
    for (let i = 0; i < scheduleData.length; i++) {
      const { subject, date, startTime, endTime } = scheduleData[i];
      if (!subject || !date || !startTime || !endTime) {
        alert(`Error: All fields must be filled in schedule entry ${i + 1}.`);
        return; // Stop submission if validation fails
      }

      const startMinutes = convertToMinutes(startTime);
      const endMinutes = convertToMinutes(endTime);

      // Ensure minimum duration of 1 hour
      if (endMinutes - startMinutes < 60) {
        alert(`Error: Entry ${i + 1} must have at least 1 hour between start and end time.`);
        return; // Stop submission if validation fails
      }
    }

    // Check for overlaps
    const overlaps = findOverlappingIndices(scheduleData);
    if (overlaps.length > 0) {
      alert("Error: Overlapping schedules detected. Please correct conflicts.");
      return;
    }

    // Submit data if validation passes
    try {
      const response = await axios.put(
        `https://vocational-training-backend.onrender.com/trainer/schedule/${trainerDetails.email}`,
        { schedule: scheduleData }
      );
      setTrainerDetails(response.data.trainer);
      alert("Schedule updated successfully");
    } catch (err) {
      alert("Error updating schedule");
    }
  };

  const handleDeleteSchedule = async (email, scheduleId, index) => {
    try {
      const response = await fetch(`https://vocational-training-backend.onrender.com/trainer/schedule/${email}/${scheduleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error deleting schedule entry:", errorText);
        return;
      }

      const result = await response.json();
      console.log("Schedule entry deleted successfully:", result);

      const updatedSchedule = scheduleData.filter((_, idx) => idx !== index);
      setScheduleData(updatedSchedule);

      const overlaps = findOverlappingIndices(updatedSchedule);
      setOverlapIndices(overlaps);
    } catch (error) {
      console.error("Error making delete request:", error);
    }
  };




  if (error) {
    return <p>{error}</p>;
  }

  if (!trainerDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className="trainer-profile text-center ">
      <div
        className="profile-row"
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.93), rgba(227, 104, 10, 0.93))",
        }}
      >
        <div className="col-4 profile-image">
          <img src={require('../../assets/images/profile.png')} alt="Trainer" className="trainer-img" style={{
            width: '300px', // Fixed small size
            height: 'auto',
            borderRadius: '8px',
            marginBottom: '20px',
            maxWidth: '100%', // Make it responsive on smaller screens
          }} />

        </div>
        <div className="container1">
          <div className="row justify-content-center mt-2">
            <div className="col-12 col-6 profile-content">
              <h2 className="heading">
                <i className="fa-solid fa-user"></i> Trainer Profile
              </h2>
              <div className="profile-card p-4 text-center">
                {!editMode ? (
                  <>
                    <h3>Name : {trainerDetails.name}</h3>
                    <p>Email : {trainerDetails.email}</p>
                    <p>Phone : {trainerDetails.contact}</p>
                    <p>Subject : {trainerDetails.subject}</p>

                    <button
                      className="btn btn-light edit-btn"
                      onClick={handleEditClick}
                    >
                      Edit Profile
                    </button>

                  </>
                ) : (
                  <form onSubmit={handleSubmit} className="form2">
                    <div className="mb-3">
                      <label className="form-label text-dark"><b>Name:</b></label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-dark"><b>Phone:</b></label>
                      <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-dark"><b>Subject:</b></label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <button type="submit" className="btn btn-light submit-btn submit-btn1 ">
                      Save Changes
                    </button>
                  </form>

                )}
              </div>
            </div>
          </div>
        </div>

      </div>


      <div className="trainer-schedule mt-4">
        <h3>Manage Schedule</h3>
        <form onSubmit={handleScheduleSubmit}>
          <div className="table-responsive">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((schedule, index) => (
                  <tr
                    key={index}
                    className={overlapIndices.includes(index) ? "highlight" : ""}
                  >
                    <td>
                      <input
                        type="text"
                        name="subject"
                        value={schedule.subject}
                        onChange={(e) => handleScheduleChange(index, e)}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="date"
                        value={schedule.date}
                        onChange={(e) => handleScheduleChange(index, e)}
                        min={new Date().toISOString().split("T")[0]} // Today's date
                        max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} // Next 7 days
                      />
                    </td>

                    <td>
                      <input
                        type="time"
                        name="startTime"
                        value={schedule.startTime}
                        onChange={(e) => handleScheduleChange(index, e)}
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        name="endTime"
                        value={schedule.endTime}
                        onChange={(e) => handleScheduleChange(index, e)}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDeleteSchedule(trainerDetails.email, schedule._id, index)}
                      >
                        Delete
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {overlapIndices.length > 0 && (
            <p className="error-text">
              Conflicts detected! Please resolve overlapping schedules.
            </p>
          )}
          <div class="d-flex justify-content-center align-items-center">
            <button
              type="button"
              className="btn mx-2 btn-primary"
              style={{ color: 'white' }}
              onClick={handleAddSchedule}
            >
              Add Schedule
            </button>
            <button type="submit" class="btn btn-success mx-2">
              Save Schedule
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TrainerProfile;
