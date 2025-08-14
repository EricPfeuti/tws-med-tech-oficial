import React from "react";
import logo from "../../assets/images/logoTWSMedTechBranco.png";
import "./Footer.css";

export default function Footer(){
    return (

        <footer>
            <div className="interface">
                <div className="flex">
                    <div className="img-footer">
                        <a href="#"><img src={logo} alt="logoImg" /></a>
                    </div>
                </div>
            </div>
        </footer>

    )
}