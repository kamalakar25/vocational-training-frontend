import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AttendancePageCoord.css'; // Import the updated CSS

const AttendancePageCoord = () => {
  const { email } = useParams();
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`https://vocational-training-backend.onrender.com/attendance/${email}`);
        console.log('API Response:', response.data);
        setAttendance(response.data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };
    fetchAttendance();
  }, [email]);

  return (
    <div className="">
      <h2 className="attendance-heading">Schedule for {email}</h2>
      <div className="row attendance-container">
      <ul className="attendance-list">
        {attendance.map((entry, index) => (
          <li key={index} className="attendance-item">
            <div className="attendance-date">{entry.date}</div>
            <div className="attendance-subject">{entry.subject}</div>
            <div className="attendance-time">
              {entry.startTime} - {entry.endTime}
            </div>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default AttendancePageCoord;
