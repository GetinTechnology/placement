import React, { useState, useEffect } from 'react';
import Menu from '../Menu';
import './portal.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import { fetchTestStatus } from '../../../api';

function Portal() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [anchor, setAnchor] = useState(null);
  const [categories, setCategories] = useState(['Uncategorized']);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [teststatus, setTestStatus] = useState([])

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://127.0.0.1:8000/portal/test/", {
          headers: { Authorization: `Token ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch tests");
        const data = await response.json();
        setTests(data);
        setFilteredTests(data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };
    fetchTests();
  }, []);

  const handleDelete = async (testId) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
  
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://127.0.0.1:8000/portal/delete/${testId}`, {
        method: "DELETE",
        headers: {Authorization: `Token ${token}` },
      });
  
      if (response.ok) {
        setTests((prevTests) => prevTests.filter((test) => test.id !== testId));
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete test");
      }
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };


  useEffect(() => {
    const fetchTestStatus = async () => {
      const token = localStorage.getItem('authToken');
      if (!token || tests.length === 0) return;

      try {
        const statusPromises = tests.map(async (test) => {
          const response = await fetch(`http://127.0.0.1:8000/portal/test/${test.id}/status/`, {
            headers: { Authorization: `Token ${token}` }
          });

          if (!response.ok) throw new Error(`Failed to fetch status for test ${test.id}`);

          return response.json();
        });

        const statuses = await Promise.all(statusPromises);
        setTestStatus(statuses);
      } catch (error) {
        console.error("Error fetching test statuses:", error);
      }
    };

    fetchTestStatus();
  }, [tests]);

  console.log(teststatus)


  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:8000/portal/category/', {
          headers: { 'Authorization': `Token ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = tests;
    if (selectedCategories.length > 0) {
      filtered = tests.filter(test => selectedCategories.includes(test.category_name));
    }
    if (searchQuery) {
      filtered = filtered.filter(test => test.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredTests(filtered);
  }, [tests, selectedCategories, searchQuery]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="portal">
      <div className={`menu ${isCollapsed ? "collapsed" : ""}`}>
        <Menu toggleSidebar={() => setIsCollapsed(!isCollapsed)} isCollapsed={isCollapsed} />
      </div>

      <div className={`main ${isCollapsed ? "expanded" : ""}`}>
        <Container>
          <div className="t-top">
            <h3>My tests ({filteredTests.length})</h3>
            <button className='portal-btn'><Link to="/newtest">New Test</Link></button>
          </div>

          <Row className="filter">
            <Col lg={4}>
              <Form.Control
                type="text"
                placeholder="Search test by name"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Col>
            <Col lg={8}>
              <Button onClick={(event) => setAnchor(anchor ? null : event.currentTarget)}>
                Select Categories
              </Button>
              <BasePopup open={Boolean(anchor)} anchor={anchor} onClose={() => setAnchor(null)}>
                <div className="category-popup">
                  {categories.map((cat) => (
                    <label key={cat.id} className="custom-checkbox">
                      <input
                        type="checkbox"
                        onChange={() => handleCategoryChange(cat.name)}
                        checked={selectedCategories.includes(cat.name)}
                      />
                      <span className="checkmark"></span> {cat.name}
                    </label>
                  ))}
                </div>
              </BasePopup>
            </Col>
          </Row>

          <Row>
            {filteredTests.length > 0 ? (
              filteredTests.map((test) => (
                <Col key={test.id} lg={6}>
                  <Link to={`/configuration/${test.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="t-box">
                      <div className="t-box1">
                        <button className='t-btn'>
                          {teststatus.find((status) => status.test === test.id)?.is_active ? "Active" : "In Progress"}
                        </button>                        
                        <p>Created: {new Date(test.created_at).toLocaleDateString()}</p>
                        <p onClick={handleDelete}>delete</p>
                      </div>
                      <div className="t-box2">
                        <h2>{test.name}</h2>
                        <p>{test.description}</p>
                      </div>
                      <div className="t-box3">
                        <span>{test.average_score || "-"}% avg. score</span>
                        <span>Result ({test.result_count || 0})</span>
                        <button className='t-btn'>{test.category_name || "Uncategorized"}</button>
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
