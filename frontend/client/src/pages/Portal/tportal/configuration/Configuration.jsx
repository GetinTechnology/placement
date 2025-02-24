import React, { useState, useEffect } from "react";
import Menu from "../../Menu";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import DatasetOutlinedIcon from '@mui/icons-material/DatasetOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';  
import './configure.css'
import TestInfo from "./TestInfo";
import UpdateTestPage from "./Update";
import QuestionManager from "./Questionmanager/QuestionManager";

function Configuration() {
  const { id } = useParams(); // Get test ID from URL
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggle,setToggle] = useState('test_info')

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://127.0.0.1:8000/portal/test", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch test details");
        }

        const data = await response.json();

        // Convert URL param `id` to number and find the specific test
        const testData = data.find((test) => test.id === parseInt(id));

        if (!testData) {
          throw new Error("Test not found");
        }

        setTest(testData);
      } catch (error) {
        console.error("Error fetching test:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [id]);

  function navigatecontent(page) {
    setToggle(toggle === page ? 'test_info' : page);
  }
  return (
    <div>
      <div className={`menu ${isCollapsed ? "collapsed" : ""}`}>
        <Menu toggleSidebar={() => setIsCollapsed(!isCollapsed)} isCollapsed={isCollapsed} />
      </div>




      {loading ? (
        <p>Loading test details...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : test ? (
        <>
          <div className="chead">
            <Container>
              <h3 >{test.name}</h3>
            </Container>

          </div>
          <div className="cmain">
            <Container>
            <Row>
            <Col className="cmain-c" lg={4}>
              <button>Setup in Progress</button>
              <div>
                <p>Test Configuration</p>
                <div className="cmain-c-box2">
                  <ul>
                    <li onClick={()=>navigatecontent('Basic Settings')}><SettingsSuggestOutlinedIcon className="c-icon"/>Basic Settings</li>
                    <li  onClick={()=>navigatecontent('Question Manager')}>< QuizOutlinedIcon className="c-icon"/>Question Manager</li>
                    <li onClick={()=>navigatecontent('Test Sets')}><DatasetOutlinedIcon className="c-icon"/>Test Sets</li>
                    <li onClick={()=>navigatecontent('Test Access')}><LockOutlinedIcon className="c-icon"/> Test Access</li>
                    <li onClick={()=>navigatecontent('Test Start page')}><HomeOutlinedIcon className="c-icon"/> Test Start page</li>
                    <li onClick={()=>navigatecontent('Grading and Summary')}><EventNoteOutlinedIcon className="c-icon"/>Grading and Summary</li>
                    <li onClick={()=>navigatecontent('Time Setting')}> <AccessTimeOutlinedIcon className="c-icon"/>Time Setting</li>
                    <li>Activate Test</li>
                  </ul>
                </div>
              </div>
              <div>

                <ul>
                  <li>Responted monitoring</li>
                  <li>Result Table</li>
                  <li>Test Sheet Review</li>
                  <li>Answer Review</li>
                  <li>Statics</li>
                </ul>
              </div>
            </Col>
            <Col lg={8}>
            {
              toggle === 'test_info' && (
                <TestInfo/>
              )
            }
            {
              toggle === 'Basic Settings' &&(
                <UpdateTestPage/>
              )
            }
             {
              toggle === 'Question Manager' && (
                <QuestionManager/>
              )
             }
            
            </Col>
          </Row>
            </Container>
  
          </div>
        </>

      ) : (
        <p>No test data available.</p>
      )}

    </div>
  );
}

export default Configuration;
