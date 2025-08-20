import { useContext } from "react";
import { DoctorContext } from "../context/DoctorContext";

export default function useAuth() {
    return useContext(DoctorContext);
}