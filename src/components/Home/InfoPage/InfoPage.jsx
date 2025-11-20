import React from 'react';
import './InfoPage.css';
import { FaClock, FaHeadset,FaHouseUser  } from "react-icons/fa";
import { Link } from 'react-router-dom';

const InfoPage = () => {
    return (
        <section className="why-us mt-5 mt-md-0">
            <div className="container">

                <div className="row">
                    <div className="col-lg-4 d-flex align-items-stretch">
                        <div className="content">
                            <h3>Why Choose Us?</h3>
                            <p>
                                We are committed to providing exceptional healthcare services with a focus on patient care and medical excellence. Our team of experienced professionals ensures that you receive the highest quality medical attention in a comfortable and caring environment.
                            </p>
                            <div className="text-center">
                                <Link to="/service" className="more-btn">Learn More <i className="bx bx-chevron-right"></i></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8 d-flex align-items-stretch">
                        <div className="icon-boxes d-flex flex-column justify-content-center">
                            <div className="row">
                                <div className="col-xl-4 d-flex align-items-stretch">
                                    <div className="icon-box mt-4 mt-xl-0">
                                        <FaHouseUser className="icon"/>
                                        <h4>Appointment Booking</h4>
                                        <small className='text-secondary'>24/7 Online Service</small>
                                        <p>Book appointments anytime, anywhere with our user-friendly online scheduling system designed for your convenience.</p>
                                    </div>
                                </div>
                                <div className="col-xl-4 d-flex align-items-stretch">
                                    <div className="icon-box mt-4 mt-xl-0">
                                        <FaHeadset className="icon"/>
                                        <h4>Emergency Response</h4>
                                        <h6 className='text-secondary'>+91 98765 43210</h6>
                                        <p>Our emergency response team is available 24/7 to provide immediate medical assistance when you need it most. Quick response times and professional care.</p>
                                    </div>
                                </div>
                                <div className="col-xl-4 d-flex align-items-stretch">
                                    <div className="icon-box mt-4 mt-xl-0">
                                        <FaClock className="icon"/>
                                        <h4>Operating Hours</h4>
                                        <small className='text-secondary'>Service Schedule</small>
                                        <ul className='list-group list-group-flush'>
                                        <li className="list-group-item d-flex justify-content-between text-nowrap" ><p>Mon - Wed : </p> <p>8:00 AM - 6:00 PM</p></li>
                                        <li className="list-group-item d-flex justify-content-between text-nowrap" ><p>Thu - Fri : </p> <p>9:00 AM - 6:00 PM</p></li>
                                        <li className="list-group-item d-flex justify-content-between text-nowrap" ><p>Sat - Sun : </p> <p>10:00 AM - 5:00 PM</p></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default InfoPage