import React from "react";
import { useLocation } from "react-router-dom";

const AttendanceLogs = () => {
  const location = useLocation();
  const logs = location.state?.logs || []; // Fallback to an empty array if no state is passed

  return (
    <div className="attendance-logs">
      <h1>Attendance Logs</h1>
      {logs.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Class Topic</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.id}</td>
                <td>{log.name}</td>
                <td>{log.date}</td>
                <td>{log.status}</td>
                <td>{log.classTopic || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attendance logs available.</p>
      )}
    </div>
  );
};

export default AttendanceLogs;
