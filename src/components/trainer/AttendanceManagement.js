import React, { useState } from "react";
import "../../assets/styles/coordinator.css";

const AttendanceManagement = () => {
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, name: "Trainee A", date: "2024-12-20", status: "Present", classTopic: "", isPresent: false },
    { id: 2, name: "Trainee B", date: "2024-12-20", status: "Absent", classTopic: "", isPresent: false },
  ]);

  const [formValues, setFormValues] = useState({ classTopic: "", presentCount: 0 });
  const [attendanceLogs, setAttendanceLogs] = useState([
    { id: 1, name: "Trainee A", date: "2024-12-19", status: "Present" },
    { id: 2, name: "Trainee B", date: "2024-12-19", status: "Absent" },
    { id: 3, name: "Trainee C", date: "2024-12-18", status: "Present" },
  ]);

  const [showLogs, setShowLogs] = useState(false);

  const markAttendance = (id, status) => {
    setAttendanceData((prevData) =>
      prevData.map((trainee) =>
        trainee.id === id
          ? { ...trainee, status: status, isPresent: status === "Present" }
          : trainee
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const presentTrainees = attendanceData.filter((trainee) => trainee.isPresent);

    if (presentTrainees.length > 0 || formValues.presentCount > 0) {
      const newLog = {
        id: attendanceLogs.length + 1,
        name: presentTrainees.map((trainee) => trainee.name).join(", ") || `Custom Count: ${formValues.presentCount}`,
        date: presentTrainees.length > 0 ? presentTrainees[0].date : "Custom Date",
        status: "Present",
        classTopic: formValues.classTopic,
      };

      setAttendanceLogs([...attendanceLogs, newLog]);
      setFormValues({ classTopic: "", presentCount: 0 });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "presentCount" ? Math.min(Math.max(Number(value), 0), 100) : value;

    setFormValues((prevValues) => ({ ...prevValues, [name]: newValue }));
  };

  return (
    <div className="attendance-management">
      <h1>Attendance Management</h1>

      <div className="attendance-list">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Trainee Name</th>
              <th scope="col">Date</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((trainee) => (
              <tr key={trainee.id}>
                <td>{trainee.name}</td>
                <td>{trainee.date}</td>
                <td>{trainee.status}</td>
                <td>
                  <button
                    onClick={() => markAttendance(trainee.id, "Present")}
                    className={`btn btn-success ${trainee.isPresent ? "disabled" : ""}`}
                  >
                    Mark Present
                  </button>
                  <button
                    onClick={() => markAttendance(trainee.id, "Absent")}
                    className="btn btn-danger"
                  >
                    Mark Absent
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {attendanceData.some((trainee) => trainee.isPresent) && (
        <div className="form-container mt-4">
          <h2>Class Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="classTopic">Class Topic:</label>
              <input
                type="text"
                id="classTopic"
                name="classTopic"
                value={formValues.classTopic}
                onChange={handleInputChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="presentCount">Number of Present Students:</label>
              <input
                type="number"
                id="presentCount"
                name="presentCount"
                value={formValues.presentCount}
                onChange={handleInputChange}
                min="1"
                max="100"
                required
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setShowLogs(!showLogs)}
        className="btn btn-link mt-4"
      >
        {showLogs ? "Hide Attendance Logs" : "View All Attendance Logs"}
      </button>

      {showLogs && (
        <div className="logs-list mt-4">
          <h2>Attendance Logs</h2>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Trainee Name</th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
                <th scope="col">Class Topic</th>
              </tr>
            </thead>
            <tbody>
              {attendanceLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.name}</td>
                  <td>{log.date}</td>
                  <td>{log.status}</td>
                  <td>{log.classTopic || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
