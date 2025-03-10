import React, { useState, useEffect } from 'react';
import Menu from '../Menu';
import './portal.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import { fetchTestStatus } from '../../../api';

function Portal() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tests, setTests] = useState([]);
  const [anchor, setAnchor] = React.useState(null);
  const [categories, setCategories] = useState(['uncategorized']);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isActive, setIsActive] = useState(false);
  

  const handlecatpop = (event) => {
    setAnchor(anchor ? null : event.currentTarget);
  };

  const open = Boolean(anchor);
  const id = open ? 'simple-popper' : undefined;

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

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
      if (!token) {
        console.error('No authentication token found!');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/portal/category/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`, // Include token in request
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(()=>{
    tests.map((test=>{
      const checkTestStatus = async () => {
        try {
          const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
            const statusData = await fetchTestStatus(test.id,token);
            setIsActive(statusData.is_active);
    
         
        } catch (error) {
          console.error("Failed to fetch test status", error);
        }
      };
  
     return checkTestStatus();
    }))
    console.log(isActive)
  },[])


  const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
  };

  const blue = {
    200: '#99CCFF',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0066CC',
  };

  const PopupBody = styled('div')(
    ({ theme }) => `
    width: max-width;
    padding: 12px 16px;
    margin: 8px;
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    box-shadow: ${theme.palette.mode === 'dark'
        ? `0px 4px 8px rgb(0 0 0 / 0.7)`
        : `0px 4px 8px rgb(0 0 0 / 0.1)`
      };
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    z-index: 1;
  `,
  );


  // Handle checkbox change
  const handleCategoryChange = (categoryName) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryName)
        ? prevSelected.filter((name) => name !== categoryName) // Remove if already selected
        : [...prevSelected, categoryName] // Add if not selected
    );
  };

  // Handle "All Categories" selection
  const handleAllCategoriesChange = (e) => {
    if (e.target.checked) {
      setSelectedCategories(categories.map((cat) => cat.name)); // Select all categories
    } else {
      setSelectedCategories([]); // Deselect all categories
    }
  };

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
                <p onClick={handlecatpop}>All categories</p>
                <BasePopup id={id} open={open} anchor={anchor}>
                  <PopupBody>
                  <div className="po-cat">
        <label className="custom-checkbox">
          <input
            type="checkbox"
            onChange={handleAllCategoriesChange}
            checked={selectedCategories.length === categories.length}
          />
          <span className="checkmark"></span> All Categories
        </label>

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
                  </PopupBody>
                </BasePopup>
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
                          <button>{isActive ? "Active" : "Inactive"}</button>
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
                          <button>{test.category_name || "Uncategorized"}</button>
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
