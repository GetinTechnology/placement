import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTestDetails, submitTestAnswers, fetchTestStatus } from "../../api";
import { Toast, ToastContainer } from "react-bootstrap";

const StudentTestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState({ questions: [], test_set: {} });
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("studentToken");

  useEffect(() => {
    const checkTestStatus = async () => {
      try {
        const statusData = await fetchTestStatus(testId, token);
        setIsActive(statusData.is_active);
      } catch (error) {
        console.error("Failed to fetch test status", error);
      }
    };

    checkTestStatus();
  }, [testId]);

  useEffect(() => {
    const loadTest = async () => {
      try {
        const testData = await fetchTestDetails(testId, token);
        let questions = testData.questions;

        // Check test_set settings
        if (testData.test_set) {
          if (testData.test_set.order_type === "shuffle") {
            questions = [...questions].sort(() => Math.random() - 0.5);
            questions.forEach((q) => {
              q.answers = [...q.answers].sort(() => Math.random() - 0.5);
            });
          }
        }

        setTest({ ...testData, questions });

        const initialResponses = {};
        questions.forEach((q) => {
          if (q.question_type === "single_choice") {
            initialResponses[q.id] = null;
          } else if (q.question_type === "multiple_choice") {
            initialResponses[q.id] = [];
          } else {
            initialResponses[q.id] = "";
          }
        });

        setResponses(initialResponses);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load test:", error);
        setLoading(false);
      }
    };

    if (isActive) {
      loadTest();
    }
  }, [testId, isActive]);

  const handleChange = (questionId, value, isMultiple = false) => {
    setResponses((prev) => {
      if (isMultiple) {
        const newValues = prev[questionId].includes(value)
          ? prev[questionId].filter((v) => v !== value)
          : [...prev[questionId], value];
        return { ...prev, [questionId]: newValues };
      }
      return { ...prev, [questionId]: value };
    });
  };

  const handleSubmit = async () => {
    try {
      const formattedResponses = Object.keys(responses).map((questionId) => ({
        question_id: questionId,
        selected_choices: Array.isArray(responses[questionId])
          ? responses[questionId]
          : responses[questionId] !== null
          ? [responses[questionId]]
          : [],
        descriptive_answer:
          typeof responses[questionId] === "string" ? responses[questionId] : "",
      }));
  
      console.log("Submitting Responses:", JSON.stringify(formattedResponses, null, 2)); // 🔥 DEBUG HERE
  
      await submitTestAnswers(testId, formattedResponses, token);
      setSubmitted(true);
      setShowToast(true);
  
      setTimeout(() => {
        navigate(`/result/${testId}`);
      }, 3000);
    } catch (error) {
      console.error("Error submitting test:", error);
      alert(error.response?.data?.message || "Failed to submit test");
    }
  };
  

  if (!isActive) {
    return (
      <div className="text-center mt-5">
        <h2 className="text-danger">Test Not Activated</h2>
        <p>Please contact the admin to activate the test.</p>
      </div>
    );
  }

  if (loading) return <div className="text-center mt-5"><h5>Loading test...</h5></div>;

  // Pagination logic
  const questionsPerPage = test.test_set?.questions_per_page || 1;
  const totalQuestions = test.questions.length;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);

  const startIdx = (currentPage - 1) * questionsPerPage;
  const endIdx = startIdx + questionsPerPage;
  const currentQuestions = test.questions.slice(startIdx, endIdx);

  return (
    <div className="container mt-5">
      {submitted ? (
        <div className="text-center">
          <h2 className="text-success">Test Submitted</h2>
          <p>Your responses have been recorded.</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Go to Dashboard
          </button>
        </div>
      ) : (
        <>
          <h1 className="mb-3">{test.name}</h1>
          <p className="text-muted">{test.description}</p>

          {currentQuestions.map((question) => (
            <div key={question.id} className="card mb-3 p-3">
              <h5>{question.text}</h5>

              {question.question_type === "single_choice" &&
                question.answers?.map((choice) => (
                  <div className="form-check" key={choice.id}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question-${question.id}`}
                      value={choice.id}
                      checked={responses[question.id] === choice.id}
                      onChange={() => handleChange(question.id, choice.id)}
                    />
                    <label className="form-check-label">{choice.text}</label>
                  </div>
                ))}

              {question.question_type === "multiple_choice" &&
                question.answers.map((choice) => (
                  <div className="form-check" key={choice.id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={choice.id}
                      checked={responses[question.id].includes(choice.id)}
                      onChange={() => handleChange(question.id, choice.id, true)}
                    />
                    <label className="form-check-label">{choice.text}</label>
                  </div>
                ))}

              {question.question_type === "descriptive" && (
                <textarea
                  className="form-control"
                  value={responses[question.id]}
                  onChange={(e) => handleChange(question.id, e.target.value)}
                  placeholder="Type your answer here..."
                />
              )}
            </div>
          ))}

          {/* Pagination Buttons */}
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <button
              className="btn btn-secondary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>

          <button className="btn btn-success w-100 mt-3" onClick={handleSubmit}>
            Submit Test
          </button>
        </>
      )}

      {/* Toast Notification */}
      <ToastContainer className="p-3" position="top-end">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Body className="text-success">Test submitted successfully!</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default StudentTestPage;
