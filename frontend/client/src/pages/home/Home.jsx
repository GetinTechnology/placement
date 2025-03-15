import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Card } from 'react-bootstrap'
import './home.css'
import logo from '../../images/logo (2).png'
import hi from '../../images/home-image.png'
import el1 from '../../images/Ellipse 1.png'
import el2 from '../../images/Ellipse 2.png'
import el3 from '../../images/Ellipse 3.png'
import el4 from '../../images/Ellipse 4.png'
import el5 from '../../images/Frame 6.png'
import python from '../../images/python.jpg'
import java from '../../images/java.jpg'
import dm from '../../images/digital marketing.jpg'
import dan from '../../images/data analytis.jpg'
import azure from '../../images/azure.jpg'
import ai from '../../images/ai.jpg'
import aws from '../../images/aws.jpg'
import star from '../../images/star.jpg'
import PlacedStudent from './PlacedStudent'
import Gallary from './Gallary'
import Jobs from './Jobs'
import Review from './Review'

const traingcourse = [
  {
    "img": python,
    "title": 'Python FullStack',
    "star": star,
    'review': '5(20000)',
    "description":
    {
      "l1": "Practical Application",
      "l2": '100% Placement',
      "l3": 'Mdule Based Syllabus'
    }
  },
  {
    "img": java,
    "title": 'Java FullStack ',
    "star": star,
    'review': '5(23000)',
    "description":
    {
      "l1": "Rigorous Curriculum",
      "l2": '100% Placement',
      "l3": 'Mdule Based Syllabus'
    }
  },
  {
    "img": dm,
    "title": 'Digital Marketing  ',
    "star": star,
    'review': '5(18120)',
    "description":
    {
      "l1": "Practical Application",
      "l2": '100% Placement',
      "l3": 'Mdule Based Syllabus'
    }
  },
  {
    "img": dan,
    "title": 'Data Analytics ',
    "star": star,
    'review': '5(16200)',
    "description":
    {
      "l1": "Learn Data Processing",
      "l2": '100% Placement',
      "l3": 'Mdule Based Syllabus'
    }
  },
  {
    "img": ai,
    "title": 'Artificial Intelligence',
    "star": star,
    'review': '5(17640)',
    "description":
    {
      "l1": "100% Placement",
      "l2": 'Machine Learning',
      "l3": 'Computer Vision'
    }
  },
  {
    "img": aws,
    "title": 'AWS',
    "star": star,
    'review': '5(12000)',
    "description":
    {
      "l1": "Cloud Computing",
      "l2": '100% Placement',
      "l3": 'Infrastructure as a Service'
    }
  },
  {
    "img": azure,
    "title": 'Azure Certification ',
    "star": star,
    'review': '5(14340)',
    "description":
    {
      "l1": "AI Services",
      "l2": 'Industry Expert Trainers',
      "l3": 'Cloud Computing'
    }
  },
  {
    "img": 'https://saravanandeveloper25.github.io/React-Project-1/images/cybersecurity.jpg',
    "title": 'Cyber Security  ',
    "star": 'https://saravanandeveloper25.github.io/React-Project-1/images/star.jpg',
    'review': '5(11276)',
    "description":
    {
      "l1": "Practical Application",
      "l2": 'Industry Expert Trainers',
      "l3": 'Threat Detection'
    }
  },


]



function Home() {
  const [visible, setIsVisible] = useState(false)
  const [display, setDisplay] = useState(false)



  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplay(true);
    }, 2000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const debounceScroll = debounce(handleScroll, 100); // Debounce with 100ms delay
    window.addEventListener('scroll', debounceScroll);

    return () => {
      window.removeEventListener('scroll', debounceScroll);
    };
  }, []);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  return (
    <div>
      <header className={visible ? 'header-bg' : 'header'}>
        <Container>
          <Row>
            <Col lg={10}>
              <Link to='/' className='link-top'>
                <img src={logo} alt="" />
                <p className="ps">
                  Getin
                  {display ? (
                    <span className="s2">Placement</span>
                  ) : (
                    <span className="s1">Technologies</span>
                  )}
                </p>
              </Link>

            </Col>
            <Col lg={2} style={{ display: 'flex', alignItems: 'center' }} className='auth-col'>
              <ul>
                <li ><Link to='/register_student'>Register</Link></li>
                <li><Link to='/login_student'>Login</Link></li>
              </ul>
            </Col>
          </Row>


        </Container>

      </header>
      <div className='home-banner'>
        <div style={{ paddingLeft: '4rem' }} className='m-home t-home'>
          <Container>
            <Row id='banner-row'>
              <Col xl={6} sm={12} md={6}>
                <div className='home-content'>
                  <h1>Empowering Your IT Career with Expert Training & Guaranteed Placements! </h1>
                  <p>We at Getin Technologies Institute offer professional IT training through practical learning, live projects, and assured placements. Acquire in-demand skills, career counseling, and industry exposure to start your profitable tech career.</p>
                  <div style={{ display: 'flex' }}>
                    <button id='i'>Button</button>
                  </div>

                </div>
              </Col>
              <Col xl={6} sm={12} md={6}>
                <div className='home-image'>
                  <PlacedStudent/>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

      </div>
      <div className='top-course'>
        <Container>
          <Row xs={1} md={2} xl={4} className='g-4 cardrow'>
            {traingcourse.map((course, index) => (
              <Col key={index} xs={12} md={6} className={[4, 5, 6, 7].includes(index) ? "hidden-col" : "c"}>
                <Card className={[4, 5, 6, 7].includes(index) ? 'hidden-card' : 'Coursecard'}>
                  <Card.Img variant="top" src={course.img} className='card_img' />
                  <Card.Body>
                    <p style={{ marginBottom: '10px', fontWeight: 700 }}>{course.title}</p>
                    <Card.Text style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <p>⭐️⭐️⭐️⭐️⭐️</p>
                      <p >{course.review}</p>
                    </Card.Text>
                  </Card.Body>
                  <div className="content">
                    <div className='content-details'>
                      <div>
                        <h6>{course.title}</h6>
                        <div style={{ background: 'red', height: '5px', width: '50px', borderRadius: '10px' }}></div>
                      </div>

                      <ul>
                        <li>{course.description.l1}</li>
                        <li>{course.description.l2}</li>
                        <li>{course.description.l3}</li>
                      </ul>
                      <p className='contentB'>View More</p>
                    </div>

                  </div>
                </Card>
              </Col>
            ))}


          </Row>
        </Container>
      </div>
      <Container>
        <Row>
          <Col className='placed-box'>
            <h4>Placed Students at Getin Technologies</h4>
            <p>We at Getin Technologies Institute are proud to mold the careers of the next generation IT professionals. Our rigorous training programs, live projects, and expert guidance have placed many students in the most sought-after IT firms.

              Strong placement assistance scheme with us ensures that our students are well-equipped to meet industry requirements. Our alumni have achieved success in beginning their careers across different fields such as Web Development, Software Engineering, Data Science, Cybersecurity, and Cloud Computing.

              Be part of Getin Technologies and you have taken the first step towards a successful career in IT!</p>
          </Col>
          <Col>
            <PlacedStudent />

          </Col>
        </Row>
      </Container>
          <Gallary/>
          <Jobs/>
          <Review/>
    </div>
  )
}

export default Home