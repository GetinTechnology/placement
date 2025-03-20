import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import logo from '../images/logo (2).png'
function Footer() {
    return (
        <div>
            <hr />
            <Container>
                <Row>
                    <Col>
                        <div>
                            <div className='logo'>
                                <img src={logo} alt="" />
                                <h2>Getin <span>Technologies</span> </h2>
                            </div>
                            <div className='social'>
                                <p>Follow us on</p>
                                <div className='links'>
                                    <FacebookIcon></FacebookIcon>
                                    <InstagramIcon></InstagramIcon>
                                    <XIcon></XIcon>
                                    <YouTubeIcon></YouTubeIcon>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col>

                    </Col>
                </Row>
            </Container>
            <hr />
            <div>
                <Container>
                    <p style={{textAlign:'center'}}>&copy; copywrite Ramaussys Technologies</p>
                </Container>
            </div>
        </div>
    )
}

export default Footer