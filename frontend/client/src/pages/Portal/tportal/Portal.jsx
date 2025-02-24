import React, { useState, useEffect } from 'react';
import Menu from '../Menu';
import './portal.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Portal() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tests, setTests] = useState([]);

  const handleDelete = async (testId) => {
    if (!window.confirm("Are you sure you want to delete this test?")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://127.0.0.1:8000/portal/delete/${testId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        setTests(tests.filter((test) => test.id !== testId)); // Remove deleted test from UI
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete test");
      }
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://127.0.0.1:8000/portal/test/", {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch tests");
        }
        const data = await response.json();
        setTests(data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTests();
  }, []);

  return (
    <div className="portal">
      {/* Sidebar Menu */}
      <div className={`menu ${isCollapsed ? "collapsed" : ""}`}>
        <Menu toggleSidebar={() => setIsCollapsed(!isCollapsed)} isCollapsed={isCollapsed} />
      </div>

      <div className={`main ${isCollapsed ? "expanded" : ""}`}>
        <Container>
          <div className="t-top">
            <h3>My tests ({tests.length})</h3>
            <button><Link to="/newtest">New Test</Link></button>
          </div>

          <Row className="filter">
            <Col lg={2}>
              <div className="fil-1">
                <p>Category</p>
                <p>All categories</p>
              </div>
            </Col>
            <Col lg={8}>
              <div className="fil-2">
                <p>Manage categories</p>
                <div>
                  <p>Status</p>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            {tests.length > 0 ? (
              tests.map((test) => (
                <Col key={test.id} lg={6}>
                  <Link to={`/configuration/${test.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="t-box">
                      <div className="t-box1">
                        <div>
                          <button>{test.is_active ? "Active" : "Inactive"}</button>
                          <p style={{ margin: '0px', color: 'gray', fontWeight: 700 }}>
                            Created: {new Date(test.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span onClick={() => { handleDelete(test.id) }}>delete</span>
                      </div>
                      <div className="t-box2">
                        <h2>{test.name}</h2>
                        <p>{test.description}</p>
                      </div>
                      <div className="t-box3">
                        <div>
                          <span>{test.average_score || "-"}% avg. score</span>
                          <span>Result ({test.result_count || 0})</span>
                        </div>
                        <div>
                          <button>{test.category || "Uncategorized"}</button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Col>
              ))
            ) : (
              <p>No tests found.</p>
            )}
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Portal;
