import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import QuestionManager from "./QuestionManager";
import './question.css'
import { Row, Col } from "react-bootstrap";

const QuestionList = ({ onBack }) => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQuestionManager, setShowQuestionManager] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [id]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");
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

  const handleDelete = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://127.0.0.1:8000/portal/test/${id}/question/${questionId}/delete/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== questionId));
    } catch (error) {
      alert("Failed to delete question. Please try again.");
    }
  };

  const handleAddQuestion = () => {
    setShowQuestionManager(true);
  };
  return (
    <div className="p-4">
      {showQuestionManager ? (
        <QuestionManager onBack={() => setShowQuestionManager(false)} onAddQuestion={fetchQuestions} />
      ) : (
        <>
          <div className="question-list-top">
            <h2 className="text-xl font-bold mb-4">Question Manager</h2>
            <button className="mb-4 p-2 bg-blue-500 text-white rounded" onClick={handleAddQuestion}>
              ➕ Add Question
            </button>
          </div>

          {loading && <p>Loading questions...</p>}
          {error && (
            <div className="text-red-500">
              <p>{error}</p>
              <button onClick={fetchQuestions} className="text-blue-500 underline">
                Retry
              </button>
            </div>
          )}

          {!loading && !error && questions.length === 0 && <p>No questions available.</p>}

          {!loading && !error && questions.length > 0 && (
            <div className="ans-container">
              {questions.map((question) => (
                <div key={question.id} className="ans-box">
                  <div className="ans-box-q">
                    <div className="ans-box-q-1">
                    <p>Q.NO: {questions.indexOf(question) + 1}</p>
                    <p className="">Type: {question.question_type}</p>
                    </div>
                   
                    <p className="">{question.text}</p>
                 
                    {question.answers.map((answer) => (
                      <div key={answer.id} className="ans-box-q">
                        {/* <input type="radio" name={`question-${question.id}`} id={`answer-${answer.id}`} /> */}
                        <label
                          htmlFor={`answer-${answer.id}`}
                          className={answer.is_correct ? "ans-box-a-bc" : "ans-box-a"}
                        >
                          {answer.text}
                        </label>
                      </div>
                    ))}

                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionList;
