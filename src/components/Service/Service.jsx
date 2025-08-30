import React from 'react'
import SubHeader from '../Shared/SubHeader'
import Footer from '../Shared/Footer/Footer'
import Header from '../Shared/Header/Header'
import { Link } from 'react-router-dom'
import doctorBg from '../../images/img/doctors-bg.jpg';

// Import diverse service images
import babyImg from '../../images/features/baby.png'
import feature1Img from '../../images/features/feature-01.jpg'
import feature2Img from '../../images/features/feature-02.jpg'
import feature3Img from '../../images/features/feature-03.jpg'
import feature5Img from '../../images/features/feature-05.jpg'
import feature6Img from '../../images/features/feature-06.jpg'

const Service = () => {
  const weArePleaseStyle = {
    backgroundColor: "antiquewhite",
    height: "60vh",
    background: `url(${doctorBg}) no-repeat`,
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    padding: "10px",
    position: "relative",
    marginTop: 200,
    marginBottom: 100
  }

  // Define diverse healthcare services with relevant images and descriptions
  const services = [
    {
      id: 1,
      title: "Pediatric Care",
      image: babyImg,
      description: "Specialized medical care for infants, children, and adolescents. Our pediatricians provide comprehensive health services including vaccinations, growth monitoring, and developmental assessments."
    },
    {
      id: 2,
      title: "Cardiology Services",
      image: feature1Img,
      description: "Expert cardiovascular care with state-of-the-art diagnostic equipment. We offer heart disease prevention, treatment, and rehabilitation services for optimal cardiac health."
    },
    {
      id: 3,
      title: "Orthopedic Care",
      image: feature2Img,
      description: "Comprehensive bone and joint care including sports injuries, arthritis treatment, and surgical procedures. Our orthopedic specialists help restore mobility and reduce pain."
    },
    {
      id: 4,
      title: "Neurology Services",
      image: feature3Img,
      description: "Advanced neurological care for disorders of the brain, spine, and nervous system. We provide diagnosis, treatment, and management of complex neurological conditions."
    },
    {
      id: 5,
      title: "Laboratory Services",
      image: feature5Img,
      description: "State-of-the-art diagnostic laboratory with comprehensive testing capabilities. We provide accurate and timely results for blood work, imaging, and specialized medical tests."
    },
    {
      id: 6,
      title: "Emergency Care",
      image: feature6Img,
      description: "24/7 emergency medical services with rapid response teams. Our emergency department is equipped to handle critical care situations and urgent medical needs."
    }
  ]

  return (
    <>
      <Header />
      <SubHeader title="Our Services" subtitle="Comprehensive healthcare services designed to meet your medical needs with excellence and personalized care." />

      <div className="container" style={{ marginTop: 200, marginBottom: 100 }}>
        <div className="row">
          {services.map((service) => (
            <div className="col-lg-4 col-md-6 col-sm-6" key={service.id}>
              <div className="card shadow border-0 mb-5 h-100">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="img-fluid" 
                  style={{ maxHeight: '17rem', objectFit: 'cover' }} 
                />
                <div className="card-body d-flex flex-column">
                  <h4 className="mt-4 mb-3 text-primary">{service.title}</h4>
                  <p className="mb-4 flex-grow-1">{service.description}</p>
                  <div className="mt-auto">
                    <Link to="/doctors" className="btn btn-outline-primary btn-sm">
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section style={weArePleaseStyle}>
        <div className="container" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <div className="row">
            <div className="col-lg-7">
              <div className="d-flex align-items-center">
                <div className='mb-4 section-title text-center'>
                  <h2 className='text-uppercase text-white'>Ready to Get Started?</h2>
                  <p className='form-text text-white'>Schedule your appointment with our experienced healthcare professionals and experience the difference quality care makes.</p>
                  <Link to={'/doctors'} className="btn-get-started scrollto">Find a Doctor</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Service