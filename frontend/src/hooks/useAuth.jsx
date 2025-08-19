import { useContext } from "react";
import { DoctorContext } from "../context/doctorContext";

export default function useAuth() {
    return useContext(DoctorContext);
}