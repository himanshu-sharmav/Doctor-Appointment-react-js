import React from 'react';
import './index.css';
import { FaFacebookSquare, FaInstagramSquare, FaLinkedin, FaGithubSquare, FaPhoneAlt, FaEnvelope  } from "react-icons/fa";

const TopHeader = () => {
    return (
        <div id="topbar" className="d-flex align-items-center fixed-top">
            <div className="container d-flex justify-content-between">
                <div className="contact-info d-flex align-items-center">
                    <FaEnvelope className='contact-icon'/> <a href="mailto:contact@doctorappointment.com">contact@doctorappointment.com</a>
                    <FaPhoneAlt className='contact-icon'/> <a href="tel:+88 01751 040425">+88 01751 040425</a> 
                </div>
                <div className="social-links">
                    <a href="https://www.linkedin.com/company/doctor-appointment-system" target='_blank' rel="noreferrer" className="linkedin"><FaLinkedin /></a>
                    <a href="https://www.facebook.com/doctorappointmentsystem" target='_blank' rel="noreferrer" className="facebook"><FaFacebookSquare /></a>
                    <a href="https://github.com/doctor-appointment-system" target='_blank' rel="noreferrer" className=""><FaGithubSquare /></a>
                    <a href="https://www.instagram.com/doctorappointmentsystem/" target='_blank' rel="noreferrer" className="instagram"><FaInstagramSquare /></a>
                </div>
            </div>
        </div>
    );
};
export default TopHeader;