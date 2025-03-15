import React from 'react'
import { Container,Row,Col } from 'react-bootstrap'
import linking from '../../images/linking.jpg'
import StarBorderPurple500Icon from '@mui/icons-material/StarBorderPurple500';
import WebIcon from '@mui/icons-material/Web';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import WorkIcon from '@mui/icons-material/Work';
import './home.css'
import linkedin from '../../images/Screenshot 2025-03-14 203826.png'
import github from '../../images/Screenshot 2025-03-14 204739.png'
import resume from '../../images/resume.webp'
import apply from '../../images/apply.jpeg'
function Jobs() {
  return (
    <div className="getjob">
    <Container>
      <Row >
        <Col md={6}>
          <Row className='job-row'>
            <Col>
              <div className='build-content'>
                <div className="icon">              <span className='cdeatils-icon'><LinkedInIcon></LinkedInIcon></span>
                </div>                <h4>LinkedIn Profile
                </h4>
                <p>Assistance in crafting a compelling LinkedIn profile for networking and visibility among recruiters.</p>
              </div>
            </Col>
          </Row>
          <Row className='job-row'>
            <Col>
              <div className='build-content'>
                <div className="icon"><span className='cdeatils-icon'><GitHubIcon></GitHubIcon></span>
                </div>
                <h4>GitHub Profile
                </h4>
                <p>Guidance on creating and maintaining a professional GitHub profile to showcase technical projects and coding prowess.</p>
              </div>
            </Col>
          </Row>
          <Row className='job-row'>
            <Col>
              <div className='build-content'>
                <div className="icon">              <span className='cdeatils-icon'><ArticleOutlinedIcon></ArticleOutlinedIcon></span>
                </div>
                <h4>Resume Preparation
                </h4>
                <p>Expert advice on resume writing to effectively highlight skills, experience, and achievements.</p>

              </div>
            </Col>
          </Row>
          <Row className='job-row'>
            <Col>
              <div className='build-content'>
                <div className="icon">              <span className='cdeatils-icon'><WorkIcon></WorkIcon></span>
                </div>
                <h4>Help in Applying
                </h4>
                <p>Support in identifying suitable job opportunities and navigating the application process.  </p>
              </div>
            </Col>
          </Row>
        </Col>
        <Col md={6}>
        <div className='job-image'>
          <img src={linkedin} alt=""  />
          <img src={github} alt=""  />
          <img src={resume} alt=""  />
          <img src={apply} alt=""  />
        </div>
        </Col>
      </Row>
    </Container>

  </div>
  )
}

export default Jobs