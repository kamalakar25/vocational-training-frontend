import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    role: "",
    dob: "",
    subject: "",
    location: "",
    trainerDetails: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    const contactPattern = /^[6789]\d{9}$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;

    if (!userData.name.trim()) newErrors.name = "Name is required.";
    if (!emailPattern.test(userData.email)) newErrors.email = "Invalid email format.";
    if (!contactPattern.test(userData.contact)) newErrors.contact = "Contact must be 10 digits starting with 6, 7, 8, or 9.";
    if (!passwordPattern.test(userData.password))
      newErrors.password = "Password must be 8 characters with uppercase, digit, and special character.";
    if (userData.password !== userData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!userData.role) newErrors.role = "Please select a role.";
    if (!userData.dob) {
      newErrors.dob = "Date of Birth is required.";
    } else {
      const age = calculateAge(userData.dob);
      if (age < 18 || age > 70) {
        newErrors.dob = "Age must be between 18 and 70.";
      }
    }
    if (userData.role === "trainer" && !userData.subject.trim())
      newErrors.subject = "Subject to teach is required.";
    if (!userData.location) newErrors.location = "Please select a location.";
    if (userData.role === "trainer" && !userData.trainerDetails.trim())
      newErrors.trainerDetails = "Trainer details are required.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const res = await axios.post("https://vocational-training-backend.onrender.com/register", userData);
        alert("User registered successfully!");
        console.log(res.data);
        setUserData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          contact: "",
          role: "",
          dob: "",
          subject: "",
          location: "",
          trainerDetails: "",
        });
        navigate("/login");
      } catch (err) {
        console.error(err);
        alert("Provided E-mail has been already registered");
      }
    } else {
      setErrors(validationErrors);
    }
  };


  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={userData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={userData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={userData.contact}
          onChange={handleChange}
        />
        {errors.contact && <p className="error">{errors.contact}</p>}

        <select name="role" value={userData.role} onChange={handleChange}>
          <option value="">Select Role</option>
          <option value="trainer">Trainer</option>
          <option value="coordinator">Coordinator</option>
        </select>
        {errors.role && <p className="error">{errors.role}</p>}



        {userData.role === "trainer" && (
          <>
            <input
              type="text"
              name="subject"
              placeholder="Subject to Teach"
              value={userData.subject}
              onChange={handleChange}
            />
            {errors.subject && <p className="error">{errors.subject}</p>}

            <textarea
              name="trainerDetails"
              placeholder="Trainer Details"
              value={userData.trainerDetails}
              onChange={handleChange}
            ></textarea>
            {errors.trainerDetails && <p className="error">{errors.trainerDetails}</p>}
          </>
        )}

        <select name="location" value={userData.location} onChange={handleChange}>
          <option value="">Select Location</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Chennai">Chennai</option>
          <option value="Bangalore">Bangalore</option>
        </select>
        {errors.location && <p className="error">{errors.location}</p>}

        <input
          type="date"
          name="dob"
          value={userData.dob}
          onChange={handleChange}
        />
        {errors.dob && <p className="error">{errors.dob}</p>}

        <button className="btn1" type="submit">Sign Up</button>
        <hr />

        <p>If you already registered, <Link to="/login">Login</Link> here</p>
      </form>
      <style>
        {`
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
          }

          .form-container {
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 400px;
          }

          h2 {
            text-align: center;
            margin-bottom: 1rem;
          }

          form {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          input, select, textarea, button {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 1rem;
            width: 100%;
          }

          .btn1 {
            background-color: #007bff;
            color: white;
            font-weight: bold;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          button:hover {
            background-color: #0056b3;
          }

          .error {
            color: red;
            font-size: 0.85rem;
            margin-top: -10px;
          }
        `}
      </style>
    </div>

    
  );
};



export default SignupPage;

