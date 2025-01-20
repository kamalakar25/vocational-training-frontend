import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const AttendanceTrainer = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [error, setError] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    topicDiscussed: "",
    studentsAttended: "",
    index: null,
  });

  useEffect(() => {
    const loggedInEmail = localStorage.getItem("email");
    if (loggedInEmail) {
      fetchScheduleData(loggedInEmail);
    } else {
      setError("No email found. Please log in.");
    }
  }, []);

  const fetchScheduleData = async (email) => {
    try {
      const response = await axios.get(`https://vocational-training-backend.onrender.com/trainer/${email}`);
      if (response.data.schedule) {
        setScheduleData(response.data.schedule);
        const initialStatus = response.data.schedule.reduce((acc, schedule, index) => {
          acc[index] = schedule.attendanceStatus || "";
          return acc;
        }, {});
        setAttendanceStatus(initialStatus);
      } else {
        setError("No schedule data found.");
      }
    } catch (err) {
      console.error("Error fetching schedule data:", err);
      setError("Failed to fetch schedule data.");
    }
  };

  const handleAttendanceClick = (index) => {
    setModalData({ ...modalData, index }); // Set the index of the clicked schedule
    setShowModal(true);
  };

  const handleAbsentClick = async (index) => {
    const loggedInEmail = localStorage.getItem("email");
    const scheduleId = scheduleData[index]._id;

    try {
      setAttendanceStatus((prevStatus) => ({
        ...prevStatus,
        [index]: "absent",
      }));

      const response = await axios.put(
        `https://vocational-training-backend.onrender.com/trainer/schedule/${loggedInEmail}/${scheduleId}`,
        { attendanceStatus: "absent" }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Failed to update attendance");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      setError("Failed to mark as absent. Please try again.");
      setAttendanceStatus((prevStatus) => ({
        ...prevStatus,
        [index]: "",
      }));
    }
  };

  const handleModalSubmit = async () => {
    const { index, topicDiscussed, studentsAttended } = modalData;
    const loggedInEmail = localStorage.getItem("email");
    const scheduleId = scheduleData[index]._id;

    try {
      setAttendanceStatus((prevStatus) => ({
        ...prevStatus,
        [index]: "present",
      }));

      const response = await axios.put(
        `https://vocational-training-backend.onrender.com/trainer/schedule/${loggedInEmail}/${scheduleId}`,
        {
          attendanceStatus: "present",
          topicDiscussed,
          studentsAttended,
        }
      );

      if (response.status === 200) {
        const updatedScheduleData = [...scheduleData];
        updatedScheduleData[index] = {
          ...updatedScheduleData[index],
          attendanceStatus: "present",
          topicDiscussed,
          studentsAttended,
        };
        setScheduleData(updatedScheduleData);
      } else {
        throw new Error(response.data.message || "Failed to update attendance");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      setError("Failed to update attendance. Please try again.");
    } finally {
      setShowModal(false);
      setModalData({ topicDiscussed: "", studentsAttended: "", index: null });
    }
  };

  const getRowClass = (index) => {
    if (attendanceStatus[index] === "absent") {
      return "row-absent";
    }
    if (attendanceStatus[index] === "present") {
      return "row-present";
    }
    return "";
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (scheduleData.length === 0) {
    return <p>Loading schedule data...</p>;
  }

  return (
    <div className="attendance-trainer text-center mt-3">
      <h2>Trainer Attendance Schedule</h2>
      <div className="table-responsive">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Action</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {scheduleData.map((schedule, index) => (
              <tr key={index} className={getRowClass(index)}>
                <td>{schedule.subject}</td>
                <td>{schedule.date}</td>
                <td>{schedule.startTime}</td>
                <td>{schedule.endTime}</td>
                <td>
                  <Button
                    variant="success"
                    onClick={() => handleAttendanceClick(index)}
                    disabled={attendanceStatus[index] === "present" || attendanceStatus[index] === "absent"}
                    className={attendanceStatus[index] === "present" ? "active-button" : ""}
                  >
                    Present
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleAbsentClick(index)}
                    disabled={attendanceStatus[index] === "present" || attendanceStatus[index] === "absent"}
                    className={attendanceStatus[index] === "absent" ? "active-button" : ""}
                  >
                    Absent
                  </Button>
                </td>
                <td><strong>{attendanceStatus[index] ? attendanceStatus[index].toUpperCase() : "Pending"}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Mark Attendance</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Topic Discussed</Form.Label>
                <Form.Control
                  type="text"
                  value={modalData.topicDiscussed}
                  onChange={(e) =>
                    setModalData((prevData) => ({
                      ...prevData,
                      topicDiscussed: e.target.value,
                    }))
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Number of Students Attended</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={modalData.studentsAttended}
                  onChange={(e) =>
                    setModalData((prevData) => ({
                      ...prevData,
                      studentsAttended: e.target.value,
                    }))
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleModalSubmit}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default AttendanceTrainer;
