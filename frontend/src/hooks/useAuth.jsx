import { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function useAuth() {
    return useContext(UserContext);
}