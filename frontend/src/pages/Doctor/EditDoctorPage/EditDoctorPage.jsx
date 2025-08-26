import EditDoctor from "../../../components/Doctor/EditDoctor/EditDoctor";
import Footer from "../../../components/Footer/Footer";
import HeaderDoctor from "../../../components/Header/HeaderDoctor";

export default function EditDoctorPage() {
    return (
        <div>
            <HeaderDoctor />
            <main>
                <EditDoctor />
            </main>
            <Footer />
        </div>
    )
}