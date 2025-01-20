import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TrainerRoutes from "./pages/TrainerRoutes";
import CoordinatorRoutes from "./pages/CoordinatorRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/trainer/*" element={<TrainerRoutes />} />
        <Route path="/coordinator/*" element={<CoordinatorRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
