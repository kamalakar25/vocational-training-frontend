
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AssignTrainerPageCoord.css'; // Import the CSS file

const AssignTrainerPageCoord = () => {
  const navigate = useNavigate();
  const { state: trainer } = useLocation();
  const [workDetails, setWorkDetails] = useState({
    title: '',
    description: '',
    deadline: '',
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');

  const email = localStorage.getItem('email');

  useEffect(() => {
    const fetchCoordinatorName = async () => {
      if (!email) {
        console.error('Email not found in localStorage.');
        setResponseMessage('Coordinator email not found.');
        return;
      }

      try {
        const response = await axios.get(
          `https://vocational-training-backend.onrender.com/coordinators/get-user-by-email?email=${email}`
        );
        if (response.data && response.data.name) {
          setCoordinatorName(response.data.name);
        } else {
          setResponseMessage('Coordinator name not found.');
        }
      } catch (error) {
        console.error('Error fetching coordinator name:', error);
        setResponseMessage('Error fetching coordinator details.');
      }
    };

    fetchCoordinatorName();
  }, [email]);

  const handleChange = (e) => {
    setWorkDetails({
      ...workDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coordinatorName) {
      setResponseMessage('Coordinator name is not available.');
      return;
    }

    try {
      const payload = {
        trainerId: trainer?._id,
        coordinatorName: coordinatorName,
        workDetails,
      };

      const response = await axios.post('https://vocational-training-backend.onrender.com/coordinators/assign-work', payload);
      setResponseMessage(response.data.message || 'Work assigned successfully!');

      // navigate('/trainer/dashboard', {
      //   state: {
      //     name: trainer?.name,
      //     task: workDetails.title,
      //   },
      // });
      alert("Added Successfully")
    } catch (error) {
      setResponseMessage('Error assigning work. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="assign-trainer-container">
      <h2>Assign Trainer: {trainer?.name || 'Unknown Trainer'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Work Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={workDetails.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={workDetails.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="deadline">Deadline:</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={workDetails.deadline}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]} // Prevent past dates
            required
          />
        </div>
        <button type="submit">Assign Work</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
</div>
      
    </div>
  );
};

export default AssignTrainerPageCoord;