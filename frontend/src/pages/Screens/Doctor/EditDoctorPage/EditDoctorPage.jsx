import EditDoctor from "../../../../components/Screens/Doctor/EditDoctor/EditDoctor";
import Footer from "../../../../components/Web/Footer/Footer";
import HeaderDoctor from "../../../../components/Web/Header/HeaderDoctor";

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