import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TrainerRoutes from "./pages/TrainerRoutes";
import CoordinatorRoutes from "./pages/CoordinatorRoutes";
import SignupPage from "./pages/SignupPage";

function App() {
  const [geolocation, setGeolocation] = React.useState(() => {
    const storedGeo = localStorage.getItem("trainerGeolocation");
    return storedGeo ? JSON.parse(storedGeo) : null;
});

React.useEffect(() => {
    console.log("Geolocation updated in App.js:", geolocation);
}, [geolocation]);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/trainer/*"
          element={<TrainerRoutes setGeolocation={setGeolocation} />}
        />
        <Route
          path="/coordinator/*"
          element={<CoordinatorRoutes geolocation={geolocation}  />}
        />
        <Route
          path="*"
          element={<h1 style={{ textAlign: "center" }}>404 - Page Not Found</h1>}
        />
      </Routes>
    </Router>
  );
}

export default App;
