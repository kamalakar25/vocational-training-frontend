import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AttendancePageCoord.css'; // Import CSS file

const AttendancePageCoord = () => {
  const { email } = useParams();
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`https://vocational-training-backend.onrender.com/trainer/${email}`);
        setSchedule(response.data.schedule || []);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };
    fetchSchedule();
  }, [email]);

  return (
    <div>
      <h2 className="attendance-header">Attendance for {email}</h2>
      <div className="attendance-container">
        {schedule.map((entry, index) => (
          <div
            key={index}
            className={`attendance-card ${entry.attendanceStatus === 'present' ? 'present' : 'absent'}`}
          >
            <h3>{entry.date}</h3>
            <p>
              Time: {entry.startTime} - {entry.endTime}
            </p>
            <p>Subject: {entry.subject}</p>
            <p>Status: <strong>{entry.attendanceStatus || 'N/A'}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendancePageCoord;
