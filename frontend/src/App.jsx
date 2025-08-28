import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/userContext";

import "bootstrap-icons/font/bootstrap-icons.css";
import Index from "./pages/index";
import Register from "./pages/interfaces/mail/Register";
import SignDoctor from "./pages/Screens/Doctor/SignDoctor/SignDoctor";
import LoginDoctor from "./pages/Screens/Doctor/LoginDoctor/LoginDoctor";
import SignPatient from "./pages/Screens/Patient/SignPatient/SignPatient";
import LoginPatient from "./pages/Screens/Patient/LoginPatient/LoginPatient";
import Doctor from "./pages/interfaces/Home/HomeDoctor";
import Patient from "./pages/interfaces/Home/HomePatient";
import Erro from "./pages/interfaces/Error/Erro";
import EditPatientPage from "./pages/Screens/Patient/EditPatientPage/EditPatientPage";
import EditDoctorPage from "./pages/Screens/Doctor/EditDoctorPage/EditDoctorPage";

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
          <Route
            path="/editPatient"
            element={
              <PrivatePatientRoute>
                <EditPatientPage />
              </PrivatePatientRoute>
            }
          ></Route>
          <Route
            path="/editDoctor"
            element={
              <PrivateDoctorRoute>
                <EditDoctorPage />
              </PrivateDoctorRoute>
            }
          ></Route>
          <Route path="*" element={<Erro />} />
          <Route path="/meeting/:roomName" element={<MeetingRoom />} />
          <Route path="/patient/meetings" element={<PatientMeetings />} />
          <Route path="/meeting/:roomName" element={<MeetingRoom />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
