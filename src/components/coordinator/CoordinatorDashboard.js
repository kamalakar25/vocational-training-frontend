import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/styles/coordinator.css";
import Swal from "sweetalert2";

const CoordinatorDashboard = () => {
  const [trainerCount, setTrainerCount] = useState(0);
  const [trainers, setTrainers] = useState([]);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    lecturerName: "",
    eventDate: "",
    eventLocation: "",
    numberOfParticipants: "",
    eventTopic: "",
    startTime: "",
    endTime: "",
  });
  const [errors, setErrors] = useState({});

  // Fetch Trainer Count and Trainer List on Component Mount
  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const response = await axios.get("https://vocational-training-backend.onrender.com/users");
        const trainerList = response.data.filter((user) => user.role === "trainer");
        setTrainers(trainerList);
        setTrainerCount(trainerList.length);
      } catch (error) {
        console.error("Error fetching trainers:", error);
        setTrainerCount(0);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await axios.get("https://vocational-training-backend.onrender.com/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchTrainerData();
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let formErrors = {};
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 2);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 7);

    // Validate fields
    if (!formData.lecturerName) formErrors.lecturerName = "Lecturer Name is required";
    if (!formData.eventLocation) formErrors.eventLocation = "Event Location is required";
    if (!formData.numberOfParticipants || formData.numberOfParticipants <= 0)
      formErrors.numberOfParticipants = "Please enter a valid number of participants";
    if (!formData.eventTopic) formErrors.eventTopic = "Event Topic is required";

    // Validate Event Date
    if (!formData.eventDate) {
      formErrors.eventDate = "Event Date is required";
    } else {
      const selectedDate = new Date(formData.eventDate);
      if (selectedDate < minDate || selectedDate > maxDate) {
        formErrors.eventDate = `Date must be between ${minDate.toLocaleDateString()} and ${maxDate.toLocaleDateString()}`;
      }
    }

    // Validate Time
    if (!formData.startTime) {
      formErrors.startTime = "Start Time is required";
    }
    if (!formData.endTime) {
      formErrors.endTime = "End Time is required";
    } else if (formData.startTime >= formData.endTime) {
      formErrors.endTime = "End Time must be later than Start Time";
    }
    // Validate date range
    if (!formData.eventDate) {
      formErrors.eventDate = "Event Date is required";
    } else {
      const selectedDate = new Date(formData.eventDate);
      if (selectedDate < minDate || selectedDate > maxDate) {
        formErrors.eventDate = `Date must be between ${minDate.toLocaleDateString()} and ${maxDate.toLocaleDateString()}`;
      }
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Find userId based on the selected lecturer name
      const selectedTrainer = trainers.find(
        (trainer) => trainer.name === formData.lecturerName
      );

      if (!selectedTrainer) {
        Swal.fire("Error", "Please select a valid lecturer.", "error");
        return;
      }

      const userId = selectedTrainer._id;

      try {
        const requestData = {
          lecturerName: formData.lecturerName,
          eventDate: formData.eventDate,
          eventLocation: formData.eventLocation,
          numberOfParticipants: formData.numberOfParticipants,
          eventTopic: formData.eventTopic,
          startTime: formData.startTime,
          endTime: formData.endTime,
        };

        const response = await axios.post(
          `https://vocational-training-backend.onrender.com/users/${userId}/events`,
          requestData
        );

        Swal.fire("Success", response.data.message, "success");

        setFormData({
          lecturerName: "",
          eventDate: "",
          eventLocation: "",
          numberOfParticipants: "",
          eventTopic: "",
          startTime: "",
          endTime: "",
        });
      } catch (error) {
        Swal.fire("Error", "Failed to save event data.", "error");
        console.error("Error submitting form:", error);
      }
    } else {
      Swal.fire("Error", "Please fill in all the fields correctly.", "error");
    }
  };


  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(`https://vocational-training-backend.onrender.com/events/${eventId}`);
      setEvents(events.filter((event) => event._id !== eventId));
      Swal.fire("Success", "Event deleted successfully.", "success");
    } catch (error) {
      console.error("Error deleting event:", error);
      Swal.fire("Error", "Failed to delete event.", "error");
    }
  };


  return (
    <div className="coordinator-dashboard">
      {/* Carousel Section */}
      <div
        id="carouselExampleIndicators"
        className="carousel slide"
        data-bs-ride="carousel"
        style={{ height: "80vh" }} // Ensuring fixed height for the carousel
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner h-100">
          {/* Carousel Items */}
          <div className="carousel-item active">
            <img
              src="https://news.scbc.wa.edu.au/wp-content/uploads/2017/07/VaC-Edu-Tra-tag-777x437.jpg"
              className="d-block w-100 h-100"
              alt="First Slide"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://teachatlanguagelink.com/wp-content/uploads/2024/05/62209bb96b3e9884d02caa9f_Blog-46-Cover-min-1.png"
              className="d-block w-100 h-100"
              alt="Second Slide"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://storage.teachwithepi.com/styles/hero_medium/s3/2023-09/home-hero-image.jpg?VersionId=LQboBA7..SjcWtTrn8KJQpWNozb6l_C2&itok=lULuwfv-"
              className="d-block w-100 h-100"
              alt="Third Slide"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>


      {/* Total Trainers Section */}
      <div
        className="row my-5"
        style={{
          background: "linear-gradient(to right, white , rgb(227, 104, 10))",
          borderRadius: "5px", // Optional: Adds rounded corners
          padding: "20px",
        }}
      >
        {/* Content Section */}
        <div className="col-lg-6 col-12">
          {/* Total Trainers Count Section */}
          <div className="dashboard-summary text-center">
            <h1 className="mb-2 d-inline">Total Trainers : </h1>
            <h1 className="mb-2 d-inline" style={{ color: "#ff6347" }}>
              <i className="bi bi-person" style={{ color: "rgb(19, 18, 17)", fontSize: "2.3rem", paddingRight: "10px" }}></i>
              {trainerCount}
            </h1>
          </div>

          {/* Description Section */}
          <div className="row mt-4">
            <div className="col-12">
              <p>
                Our platform continues to grow with highly skilled trainers. The
                number of trainers is increasing, and we are proud to provide
                opportunities for growth in the educational field. We ensure a
                diverse pool of talent is available to our users.
              </p>
            </div>
          </div>

          {/* Additional Points Section with Icons */}
          <div className="row mt-3">
            <div className="col-12">
              <ul className="list-group">
                <li className="list-group-item d-flex align-items-center fade-in">
                  <i
                    className="bi bi-person-check me-2 icon-hover"
                    style={{ fontSize: "1.5rem", color: "rgb(227, 104, 10)" }}
                  ></i>
                  Highly skilled trainers joining every day.
                </li>
                <li className="list-group-item d-flex align-items-center fade-in">
                  <i
                    className="bi bi-award me-2 icon-hover"
                    style={{ fontSize: "1.5rem", color: "rgb(227, 104, 10)" }}
                  ></i>
                  Trainers with certifications and expertise.
                </li>
                <li className="list-group-item d-flex align-items-center fade-in">
                  <i
                    className="bi bi-people me-2 icon-hover"
                    style={{ fontSize: "1.5rem", color: "rgb(227, 104, 10)" }}
                  ></i>
                  A growing community of learners and trainers.
                </li>
                <li className="list-group-item d-flex align-items-center fade-in">
                  <i
                    className="bi bi-lightbulb me-2 icon-hover"
                    style={{ fontSize: "1.5rem", color: "rgb(227, 104, 10)" }}
                  ></i>
                  Continuous learning opportunities for trainers.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="col-6 col-12">
          <img
            src="https://media.istockphoto.com/id/1433288643/photo/who-is-going-to-answer-my-question.jpg?s=612x612&w=0&k=20&c=HFVgvzn3GBcMRkm4SHNYGjVmkSabFWQyietw08ojG-Y="
            alt="Trainers Image"
            className="img-fluid"
            style={{ objectFit: "cover", height: "100%" }}
          />
        </div>
      </div>
      {/* add */}
      {/* Total Trainers Section */}
      <div
        className="row my-5"
        style={{
          background: "linear-gradient(180deg, white,rgb(227, 104, 10) )",
          borderRadius: "5px", // Optional: Adds rounded corners
          padding: "20px",
        }}
      >
        {/* Content Section */}
        {/* Image Section */}
        <div className="col-6 col-12">
          <img
            src="https://media.istockphoto.com/id/1433288643/photo/who-is-going-to-answer-my-question.jpg?s=612x612&w=0&k=20&c=HFVgvzn3GBcMRkm4SHNYGjVmkSabFWQyietw08ojG-Y="
            alt="Trainers Image"
            className="img-fluid"
            style={{ objectFit: "cover", height: "60%" }}
          />

        </div>
        <div className="col-6 col-12">
          {/* Total Trainers Count Section */}
          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-12 text-center mb-4">
                <h1>Add Guest Lecturers</h1>
                <p>Total Trainers: <span style={{ color: "#ff6347" }}>{trainerCount}</span></p>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="``````` col-12">
                <form onSubmit={handleSubmit}>
                  {/* Lecturer Name Dropdown */}
                  <div className="mb-3">
                    <label htmlFor="lecturerName" className="form-label">
                      Select Lecturer
                    </label>
                    <select
                      className="form-control"
                      id="lecturerName"
                      name="lecturerName"
                      value={formData.lecturerName}
                      onChange={handleChange}
                    >
                      <option value="">Select a Lecturer</option>
                      {trainers.map((trainer) => (
                        <option key={trainer._id} value={trainer.name}>
                          {trainer.name}
                        </option>
                      ))}
                    </select>
                    {errors.lecturerName && (
                      <div className="text-danger">{errors.lecturerName}</div>
                    )}
                  </div>

                  {/* Event Date */}
                  <div className="mb-3">
                    <label htmlFor="eventDate" className="form-label">Select Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="eventDate"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      min={new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split("T")[0]}
                      max={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split("T")[0]}
                      required
                    />
                    {errors.eventDate && (
                      <div className="text-danger">{errors.eventDate}</div>
                    )}
                  </div>

                  {/* Event Location */}
                  <div className="mb-3">
                    <label htmlFor="eventLocation" className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      id="eventLocation"
                      name="eventLocation"
                      value={formData.eventLocation}
                      onChange={handleChange}
                      required
                    />
                    {errors.eventLocation && (
                      <div className="text-danger">{errors.eventLocation}</div>
                    )}
                  </div>

                  {/* Number of Participants */}
                  <div className="mb-3">
                    <label htmlFor="numberOfParticipants" className="form-label">Number of Participants</label>
                    <input
                      type="number"
                      className="form-control"
                      id="numberOfParticipants"
                      name="numberOfParticipants"
                      value={formData.numberOfParticipants}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                    {errors.numberOfParticipants && (
                      <div className="text-danger">{errors.numberOfParticipants}</div>
                    )}
                  </div>

                  {/* Event Topic */}
                  <div className="mb-3">
                    <label htmlFor="eventTopic" className="form-label">Topic</label>
                    <input
                      type="text"
                      className="form-control"
                      id="eventTopic"
                      name="eventTopic"
                      value={formData.eventTopic}
                      onChange={handleChange}
                      required
                    />
                    {errors.eventTopic && (
                      <div className="text-danger">{errors.eventTopic}</div>
                    )}
                  </div>

                  {/* Event Start Time */}
                  <div className="mb-3">
                    <label htmlFor="startTime" className="form-label">Start Time</label>
                    <input
                      type="time"
                      className="form-control"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                    />
                    {errors.startTime && <div className="text-danger">{errors.startTime}</div>}
                  </div>

                  {/* Event End Time */}
                  <div className="mb-3">
                    <label htmlFor="endTime" className="form-label">End Time</label>
                    <input
                      type="time"
                      className="form-control"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                    />
                    {errors.endTime && <div className="text-danger">{errors.endTime}</div>}
                  </div>


                  <div className="mb-3 text-center">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Guest Lecturers Table */}
          <div className="container mt-5">
            <h2>Assigned Guest Lecturers</h2>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Lecturer Name</th>
                  <th>Event Topic</th>
                  <th>Event Date</th>
                  <th>Participants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id}>
                    <td>{event.lecturerName}</td>
                    <td>{event.eventTopic}</td>
                    <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                    <td>{event.numberOfParticipants}</td>
                    <td>{event.status || "Scheduled"}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteEvent(event._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>


    </div>
  );
};

export default CoordinatorDashboard;
