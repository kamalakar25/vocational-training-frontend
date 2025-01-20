import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './TrainerManagement.css';
import { useNavigate } from 'react-router-dom';

const TrainerManagement = () => {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [traineeEmail, setTraineeEmail] = useState('');
  const [courseName, setCourseName] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const navigate = useNavigate();

  // Fetch all trainers
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get('https://vocational-training-backend.onrender.com/users');
        const trainerList = response.data.filter(user => user.role === 'trainer');
        setTrainers(trainerList);
      } catch (error) {
        console.error('Error fetching trainers:', error);
      }
    };
    fetchTrainers();
  }, []);

  // Fetch attendance and schedule based on selected trainer
  const fetchAttendance = async (email) => {
    try {
      const response = await axios.get(`https://vocational-training-backend.onrender.com/attendance/${email}`);
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchSchedule = async (email) => {
    try {
      const response = await axios.get(`https://vocational-training-backend.onrender.com/trainer/${email}`);
      setSchedule(response.data.schedule || []);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  // Assign trainer to trainee
  const handleAssignTrainer = async () => {
    if (!selectedTrainer || !traineeEmail || !courseName) {
      Swal.fire("Error", "All fields are required!", "error");
      return;
    }

    try {
      const response = await axios.post('https://vocational-training-backend.onrender.com/assignTrainer', {
        trainerEmail: selectedTrainer.email,
        traineeEmail,
        courseName,
      });
      Swal.fire("Success", "Trainer assigned successfully!", "success");
    } catch (error) {
      console.error('Error assigning trainer:', error);
      Swal.fire("Error", "Failed to assign trainer", "error");
    }
  };

  return (
    <div className="trainer-management">
      <h1>Trainer Management</h1>

      {/* List of Trainers */}
      <section className="trainers-list">
        <h2>List of Trainers</h2>
        <div className="table-responsive">
        <table>
          <thead className='table1'>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className='table1'>
            {trainers.map(trainer => (
              <tr key={trainer._id}>
                <td>{trainer.name}</td>
                <td>{trainer.email}</td>
                <td>{trainer.contact}</td>
                <td>
                  <button onClick={() => {
                    setSelectedTrainer(trainer);
                    fetchSchedule(trainer.email);
                    fetchAttendance(trainer.email);
                    navigate(`/coordinator/schedule/${trainer.email}`, { state: { email: trainer.email } });
                  }}>
                    View Schedule
                  </button>
                  <button onClick={() => navigate(`/coordinator/attendance/${trainer.email}`)}>View Attendance</button>
                  <button onClick={() => navigate('/coordinator/assign-trainer', { state: trainer })}>Assign</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        
      </section>

      {/* Trainer Info and Assign Trainer */}
      {selectedTrainer && (
        <section className="assign-trainer">
          <h2>Assign Trainer: {selectedTrainer.name}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAssignTrainer();
            }}
          >
            <label>
              Trainee Email:
              <input
                type="email"
                value={traineeEmail}
                onChange={(e) => setTraineeEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Course Name:
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
              />
            </label>
            <button type="submit">Assign Trainer</button>
          </form>
        </section>
      )}

      {/* Monitor Attendance */}
      {attendance.length > 0 && (
        <section className="attendance">
          <h2>Trainer Attendance</h2>
          <ul>
            {attendance.map((entry, index) => (
              <li key={index}>{entry.day}: {entry.status}</li>
            ))}
          </ul>
        </section>
      )}

      {/* View Schedule */}
      {schedule.length > 0 && (
        <section className="schedule">
          <h2>Trainer Schedule</h2>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Day</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.subject}</td>
                  <td>{entry.day}</td>
                  <td>{entry.startTime}</td>
                  <td>{entry.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default TrainerManagement;