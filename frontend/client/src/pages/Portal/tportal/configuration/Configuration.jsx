import React, { useState, useEffect } from "react";
import Menu from "../../Menu";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  SettingsSuggestOutlined as SettingsIcon,
  QuizOutlined as QuizIcon,
  DatasetOutlined as DatasetIcon,
  LockOutlined as LockIcon,
  HomeOutlined as HomeIcon,
  AccessTimeOutlined as TimeIcon,
  EventNoteOutlined as EventIcon,
} from "@mui/icons-material";
import "./configure.css";
import TestInfo from "./TestInfo";
import UpdateTestPage from "./Update";
import QuestionManager from "./Questionmanager/QuestionManager";
import QuestionList from "./Questionmanager/QuestionList";
import axios from "axios";

function Configuration() {
  const { id } = useParams();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggle, setToggle] = useState("test_info");
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [questions, setQuestions] = useState([]);


  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://127.0.0.1:8000/portal/test", {
          headers: { Authorization: `Token ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch test details");
        const data = await response.json();
        const testData = data.find((test) => test.id === parseInt(id));
        if (!testData) throw new Error("Test not found");
        setTest(testData);
      } catch (error) {
        console.error("Error fetching test:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();

    const fetchQuestions = async () => {
      setLoading(true);  // Ensure loading is set before fetching
      setError("");  // Reset error state

      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`http://127.0.0.1:8000/portal/test/${id}/questions`, {
          headers: { Authorization: `Token ${token}` },
        });

        setQuestions(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions()
  }, [id]);


  function navigateContent(page) {
    setToggle(toggle === page ? "test_info" : page);
    if (page === "Question Manager") {
      setShowQuestionList(false); // Ensure Question Manager is shown initially
    }
  }

  // Function to handle question addition
  const handleAddQuestion = () => {
    setShowQuestionList(true);
  };

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
              <h3>{test.name}</h3>
            </Container>
          </div>
          <div className="cmain">
            <Container>
              <Row>
                {/* Sidebar */}
                <Col className="cmain-c" lg={3}>
                  <button>Setup in Progress</button>
                  <div>
                    <p>Test Configuration</p>
                    <div className="cmain-c-box2">
                      <ul>
                        {[
                          ["Basic Settings", <SettingsIcon className="c-icon" />],
                          ["Question Manager", <QuizIcon className="c-icon" />],
                          ["Test Sets", <DatasetIcon className="c-icon" />],
                          ["Test Access", <LockIcon className="c-icon" />],
                          ["Test Start Page", <HomeIcon className="c-icon" />],
                          ["Grading and Summary", <EventIcon className="c-icon" />],
                          ["Time Setting", <TimeIcon className="c-icon" />],
                        ].map(([label, icon]) => (
                          <li key={label} onClick={() => navigateContent(label)}>
                            {icon} {label}
                          </li>
                        ))}
                        <li>Activate Test</li>
                      </ul>
                    </div>
                  </div>
                </Col>

                {/* Main Content Area */}
                <Col lg={9}>
                  {toggle === "test_info" && <TestInfo />}
                  {toggle === "Basic Settings" && <UpdateTestPage />}

                  {toggle === "Question Manager" && (
                    <>
                      {questions.length === 0 ? (
                        <QuestionManager onAddQuestion={handleAddQuestion} />
                      ) : (
                        <QuestionList />
                      )}
                    </>
                  )}

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

