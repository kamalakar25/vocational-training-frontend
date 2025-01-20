import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import TrainerDashboard from "../components/trainer/TrainerDashboard";
import AttendanceManagement from "../components/trainer/AttendanceManagement";
import IndustryVisits from "../components/trainer/IndustryVisits";
import Reports from "../components/trainer/Reports";
import AttendanceLogs from "../components/coordinator/AttendanceLogs";
import ProfilePage from "../components/trainer/Profile";
import TrainerProfile from "../components/trainer/TrainerProfile";
import Attendance from "../components/trainer/AttendanceTrainer";
import IndustryVisitLogs from "../components/trainer/IndustryVisits";

const TrainerRoutes = ({ setGeolocation }) => {
  return (
    <>
      <Navbar setGeolocation={setGeolocation} role="trainer" />
      <Routes>
        <Route path="/dashboard" element={<TrainerDashboard />} />
        <Route path="/profile" element={<TrainerProfile />} />

        {/* <Route path="/trainer/:email" element={<TrainerProfile />} /> */}

        {/* <Route path="/profile" element={<TrainerProfile />} /> */}
        {/* <Route path="/attendance" element={<AttendanceManagement />} /> */}
        
        <Route path="/attendance" element={<Attendance />} />
        {/* <Route path="/industry-visits" element={<IndustryVisits />} /> */}
        <Route path="/reports" element={<Reports />} />
        <Route path="/attendance-logs" element={<AttendanceLogs />} />
      </Routes>
    </>
  );
};

export default TrainerRoutes;
