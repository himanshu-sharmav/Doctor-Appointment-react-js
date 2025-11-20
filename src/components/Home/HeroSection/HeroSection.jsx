import React from 'react';
import './index.css';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section id="hero" className="d-flex align-items-center">
            <div className="container">
                <div>
                    <small className="text-uppercase fw-bold text-primary">PREMIUM HEALTHCARE SOLUTIONS</small>
                    <h1>Your Trusted Partner in <br />Healthcare Excellence</h1>
                    <small className="text-secondary">Experience world-class medical care with our comprehensive healthcare management system designed for modern healthcare delivery.</small>
                </div>
                <div className="d-flex justify-content-start gap-3 mt-4">
                    <Link to={'/doctors'} className="btn-get-started scrollto">Find a Doctor</Link>
                    <Link to={'/track-appointment'} className="btn-get-started scrollto btn-outline-primary">Track Appointment</Link>
                </div>
            </div>
        </section>
    )
}
export default HeroSection;