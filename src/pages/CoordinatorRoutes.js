import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import CoordinatorDashboard from "../components/coordinator/CoordinatorDashboard";
import TrainerManagement from "../components/coordinator/TrainerManagement";
import TraineeManagement from "../components/coordinator/TraineeManagement";
import ReportsManagement from "../components/coordinator/ReportsManagement";
import AttendanceLogs from "../components/coordinator/AttendanceLogs";
import CoordinatorProfile from "../components/coordinator/CoordinatorProfile";
import AttendancePageCoord from "../components/coordinator/AttendancePageCoord";
import SchedulePageCoord from "../components/coordinator/SchedulePageCoord";
import AssignTrainerPageCoord from "../components/coordinator/AssignTrainerPageCoord";

const CoordinatorRoutes = ({ email, geolocation }) => {
  return (
    <>
      <Navbar role="coordinator" />
      <Routes>
        <Route path="/dashboard" element={<CoordinatorDashboard geolocation={geolocation} />} />
        <Route path="/profile" element={<CoordinatorProfile email={email} />} />
        <Route path="/trainers" element={<TrainerManagement />} />
        <Route path="/attendance/:email" element={<AttendancePageCoord />} />
        <Route path="/schedule/:email" element={<SchedulePageCoord />} />
        <Route path="/assign-trainer" element={<AssignTrainerPageCoord />} />
        <Route path="/trainees" element={<TraineeManagement />} />
        <Route path="/reports" element={<ReportsManagement />} />
        <Route path="/attendance-logs" element={<AttendanceLogs />} />
      </Routes>
    </>
  );
};

export default CoordinatorRoutes;
