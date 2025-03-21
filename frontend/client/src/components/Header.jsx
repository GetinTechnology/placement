import React from 'react'
import Logo from '../images/logo (2).png'
import './components.css'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'

function Header() {
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
    <header className={visible ? 'header-bg' : 'header'}>
    <Container>
      <Row>
        <Col lg={10}>
          <Link to='/' className='link-top'>
            <img src={Logo} alt="" />
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
  )
}

export default Header