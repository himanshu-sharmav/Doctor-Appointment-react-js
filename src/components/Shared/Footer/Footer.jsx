import React from 'react';
import './Footer.css';
import logo from '../../../images/logo.png';
import { Link } from 'react-router-dom';
import { FaAngleDoubleRight } from "react-icons/fa";

const Footer = () => {
	return (
		<footer className="footer position-relative">
			<div className="footer-top">
				<div className="container-fluid">
					<div className="row">
						<div className="col-6 col-md-6 col-lg-3">
							<div className="footer-widget footer-about">
								<div className="footer-logo">
									<Link to={'/'}>
										<img src={logo} alt="logo" style={{ maxWidth: '160px' }} />
									</Link>
								</div>
								<div className="footer-about-content">
									<p className='form-text' style={{maxWidth:200}}>We are committed to providing exceptional healthcare services with a focus on patient care, medical excellence, and community well-being. Your health is our priority.</p>
								</div>
							</div>
						</div>

						<div className="col-6 col-md-6 col-lg-3">
							<div className="footer-widget footer-menu">
								<h2 className="footer-title">For Patients</h2>
								<ul>
									<li><Link to={'/doctors'}><FaAngleDoubleRight className='icon' />  Search for Doctors</Link></li>
									<li><Link to={'/login'}><FaAngleDoubleRight className='icon' />  Login</Link></li>
									<li><Link to={'/login'}><FaAngleDoubleRight className='icon' />  Register</Link></li>
									<li><Link to={'/doctors'}><FaAngleDoubleRight className='icon' />  Booking</Link></li>
									<li><Link to={'/'}><FaAngleDoubleRight className='icon' />  Patient Dashboard</Link></li>
								</ul>
							</div>
						</div>

						<div className="col-6 col-md-6 col-lg-3">

							<div className="footer-widget footer-menu">
								<h2 className="footer-title">For Doctors</h2>
								<ul>
									<li><Link to={'/'}><FaAngleDoubleRight className='icon' /> Appointments</Link></li>
									<li><Link to={'/login'}><FaAngleDoubleRight className='icon' /> Login</Link></li>
									<li><Link to={'/register'}><FaAngleDoubleRight className='icon' /> Register</Link></li>
									<li><Link to={'/dashboard'}><FaAngleDoubleRight className='icon' /> Doctor Dashboard</Link></li>
								</ul>
							</div>
						</div>

						<div className="col-6 col-md-6 col-lg-3">
							<div className="footer-widget footer-contact">
								<h2 className="footer-title mt-3 mt-md-0">Contact Us</h2>
								<div className="footer-contact-info">
									<div className="footer-address">
										<span><i className="fas fa-map-marker-alt"></i></span>
										<p>KIET Group of Institutions<br />Ghaziabad, Uttar Pradesh, India</p>
									</div>
									<p>
										<i className="fas fa-phone-alt"></i>
										+91 98765 43210
									</p>
									<p className="mb-0">
										<i className="fas fa-envelope"></i>
										info@kiethealthcare.com
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="footer-bottom">
				<div className="container-fluid">

					                    <div className="copyright">
                        <div className="row">
                            <div className="col-md-6 col-lg-6">
                                <div className="copyright-text">
                                    <div className="copyRight text-center">
                                        <p className="mb-0">© {(new Date()).getFullYear()} KIET Healthcare System. All Rights Reserved.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-6">
                                <div className="copyright-menu">
                                    <ul className="policy-menu d-flex gap-2 justify-content-center">
                                        <Link to={'/about'} className='text-white'>About Us</Link>
                                        <Link to={'/contact'} className='text-white'>Contact</Link>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

				</div>
			</div>

		</footer>
	);
};

export default Footer;