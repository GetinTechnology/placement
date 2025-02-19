import React, { useState } from 'react';
import Menu from '../Menu';
import './portal.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
function Portal() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="portal">
      {/* Pass toggle function to Menu */}
      <div className={`menu ${isCollapsed ? "collapsed" : ""}`}>
        <Menu toggleSidebar={() => setIsCollapsed(!isCollapsed)} isCollapsed={isCollapsed} />
      </div>
      <div className={`main ${isCollapsed ? "expanded" : ""}`}>
        <Container>
          <div className='t-top'>

            <h3>My tests (4)</h3>
            <button><Link to='/newtest'>New Test</Link></button>
          </div>
          <Row className='filter'>
            <Col lg={2}>
            <div className='fil-1'>
              <p>category</p>
              <p>All categories </p>
            </div>
            </Col>
            <Col lg={8}>
            <div className='fil-2'>
              <p>Manage categories</p>
              <div>
                <p>status</p>
              </div>
            </div>
            </Col>

          </Row>
          <Row>
            <Col>
             <div className='t-box'>
              <div className='t-box1'>
                <div>
                <button>Active</button>
                <p style={{margin:'0px',color:'gray',fontWeight:700}}>Created: 2025-02-11</p>
                </div>
                <span>...</span>

              </div>
              <div className='t-box2'>
                <h2>Test Heading</h2>
                <p>Test Discription</p>
              </div>
              
                <div className='t-box3'>
                  <div> 
                  <span>-% avg.score</span>
                  <span>Result(0)</span>
                  </div>
                  <div>
                  <button>category</button>
                  </div>
                
                </div>
                
            
             </div>
            </Col>
            <Col>
             <div className='t-box'>
              <div className='t-box1'>
                <div>
                <button>Active</button>
                <p style={{margin:'0px',color:'gray',fontWeight:700}}>Created: 2025-02-11</p>
                </div>
                <span>...</span>

              </div>
              <div className='t-box2'>
                <h2>Test Heading</h2>
                <p>Test Discription</p>
              </div>
              
                <div className='t-box3'>
                  <div> 
                  <span>-% avg.score</span>
                  <span>Result(0)</span>
                  </div>
                  <div>
                  <button>category</button>
                  </div>
                
                </div>
                
            
             </div>
            </Col>
          </Row>
          <Row>
            <Col>
             <div className='t-box'>
              <div className='t-box1'>
                <div>
                <button>Active</button>
                <p style={{margin:'0px',color:'gray',fontWeight:700}}>Created: 2025-02-11</p>
                </div>
                <span>...</span>

              </div>
              <div className='t-box2'>
                <h2>Test Heading</h2>
                <p>Test Discription</p>
              </div>
              
                <div className='t-box3'>
                  <div> 
                  <span>-% avg.score</span>
                  <span>Result(0)</span>
                  </div>
                  <div>
                  <button>category</button>
                  </div>
                
                </div>
                
            
             </div>
            </Col>
            <Col>
             <div className='t-box'>
              <div className='t-box1'>
                <div>
                <button>Active</button>
                <p style={{margin:'0px',color:'gray',fontWeight:700}}>Created: 2025-02-11</p>
                </div>
                <span>...</span>

              </div>
              <div className='t-box2'>
                <h2>Test Heading</h2>
                <p>Test Discription</p>
              </div>
              
                <div className='t-box3'>
                  <div> 
                  <span>-% avg.score</span>
                  <span>Result(0)</span>
                  </div>
                  <div>
                  <button>category</button>
                  </div>
                
                </div>
                
            
             </div>
            </Col>
          </Row>
        </Container>

      </div>
    </div>
  );
}

export default Portal;
