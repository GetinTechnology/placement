import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTestDetails, submitTestAnswers } from "../../api";
import { Toast, ToastContainer } from "react-bootstrap";
import { fetchTestStatus } from "../../api";

const StudentTestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState({questions:[]});
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const token = localStorage.getItem("studentToken");

  useEffect(() => {
    const checkTestStatus = async () => {
      try {
        const statusData = await fetchTestStatus(testId,token);
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
        setTest(testData);

        const initialResponses = {};
        testData.questions.forEach((q) => {
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
  }, [testId,isActive]);

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
        selected_choice_ids: Array.isArray(responses[questionId])
          ? responses[questionId]
          : responses[questionId] !== null
          ? [responses[questionId]]
          : [],
        descriptive_answer:
          typeof responses[questionId] === "string" ? responses[questionId] : "",
      }));

      await submitTestAnswers(testId, formattedResponses, token);
      setSubmitted(true);
      setShowToast(true);
    } catch (error) {
      console.error("Error submitting test:", error);
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

          {test.questions?.map((question) => (
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

          <button className="btn btn-success w-100" onClick={handleSubmit}>
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
