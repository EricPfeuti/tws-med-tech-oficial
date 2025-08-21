import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/userContext";

import "bootstrap-icons/font/bootstrap-icons.css";
import Index from "./pages/index";
import Register from "./pages/Register/Register";
import SignDoctor from "./pages/Doctor/SignDoctor/SignDoctor";
import LoginDoctor from "./pages/Doctor/LoginDoctor/LoginDoctor";
import SignPatient from "./pages/Patient/SignPatient/SignPatient";
import LoginPatient from "./pages/Patient/LoginPatient/LoginPatient";
import Doctor from "./pages/Doctor/Home/HomeDoctor";
import Patient from "./pages/Patient/Home/HomePatient";
import Erro from "./pages/Erro/Erro";

import PrivateDoctorRoute from "./utils/PrivateRouteDoctor";
import PrivatePatientRoute from "./utils/PrivateRoutePatient";

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signDoctor" element={<SignDoctor />} />
          <Route path="/loginDoctor" element={<LoginDoctor />} />
          <Route path="/signPatient" element={<SignPatient />} />
          <Route path="/loginPatient" element={<LoginPatient />} />
          <Route
            path="/doctor"
            element={
              <PrivateDoctorRoute>
                <Doctor />
              </PrivateDoctorRoute>
            }
          />
          <Route
            path="/patient"
            element={
              <PrivatePatientRoute>
                <Patient />
              </PrivatePatientRoute>
            }
          />
          <Route path="*" element={<Erro />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
