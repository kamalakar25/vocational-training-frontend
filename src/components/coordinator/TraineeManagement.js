import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./TrainerManagement.css";
import { useNavigate } from "react-router-dom";

const TraineeManagement = () => {
  const [trainers, setTrainers] = useState([]);
  const navigate = useNavigate();

  // Fetch all trainers
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get("https://vocational-training-backend.onrender.com/users");
        const trainerList = response.data.filter((user) => user.role === "trainer");
        setTrainers(trainerList);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };
    fetchTrainers();
  }, []);

  // Handle delete trainer
  const handleDeleteTrainer = async (trainerId) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmation.isConfirmed) {
      try {
        await axios.delete(`https://vocational-training-backend.onrender.com/users/${trainerId}`);
        Swal.fire("Deleted!", "Trainer has been deleted.", "success");

        // Fetch the updated trainers list
        const response = await axios.get("https://vocational-training-backend.onrender.com/users");
        const updatedTrainers = response.data.filter((user) => user.role === "trainer");
        setTrainers(updatedTrainers);
      } catch (error) {
        console.error("Error deleting trainer:", error);
        Swal.fire("Error", "Failed to delete trainer", "error");
      }
    }
  };

  // Handle send message
  const handleSendMessage = async (trainerId) => {
    const { value: formValues } = await Swal.fire({
      title: "Send Message",
      html: `
        <select id="message-type" class="swal2-select">
          <option value="warning">Warning</option>
          <option value="performance">Performance</option>
          <option value="appreciation">Appreciation</option>
        </select>
        <textarea id="custom-message" class="swal2-textarea" placeholder="Type your message here..."></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Send",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const messageType = document.getElementById("message-type").value;
        const customMessage = document.getElementById("custom-message").value;
  
        if (!customMessage) {
          Swal.showValidationMessage("Message cannot be empty!");
          return false;
        }
  
        return { messageType, customMessage };
      },
    });
  
    if (formValues) {
      const { messageType, customMessage } = formValues;
  
      // Debugging: Log the form values to ensure they are correct
      console.log("Form Values:", { trainerId, messageType, customMessage });
  
      try {
        // Send message to backend
        const response = await axios.post("https://vocational-training-backend.onrender.com/add-message", {
          trainerId,
          messageType,
          customMessage,
        });
  
        Swal.fire("Sent!", "Your message has been sent successfully and stored.", "success");
      } catch (error) {
        console.error("Error sending message:", error);
        Swal.fire("Error", "Failed to send message", "error");
      }
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
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map((trainer) => (
              <tr key={trainer._id}>
                <td>{trainer.name}</td>
                <td>{trainer.email}</td>
                <td>{trainer.contact}</td>
                <td>
                  <button
                    onClick={() => handleDeleteTrainer(trainer._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleSendMessage(trainer._id)}
                    className="message-btn"
                  >
                    Send Message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
       
      </section>
    </div>
  );
};

export default TraineeManagement;
