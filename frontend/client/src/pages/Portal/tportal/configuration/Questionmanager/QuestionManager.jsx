import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import QuestionList from "./QuestionList";

const QuestionManager = () => {
  const { id } = useParams(); // Get test ID from URL
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    question_type: "single_choice",
    points: 1,
    answers: [
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
    ],
  });
const [toggle,setToggle] = useState('Question Manager')
  

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `http://127.0.0.1:8000/portal/test/${id}/questions`,
      {
        headers: { Authorization: `Token ${token}` },
      }
    );
    const data = await response.json();
    setQuestions(data);
  };

  const handleQuestionChange = (e) => {
    setNewQuestion({ ...newQuestion, text: e.target.value });
  };

  const handleTypeChange = (e) => {
    setNewQuestion({
      ...newQuestion,
      question_type: e.target.value,
      answers: [
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ],
    });
  };

  const addAnswerField = () => {
    setNewQuestion({
      ...newQuestion,
      answers: [...newQuestion.answers, { text: "", is_correct: false }],
    });
  };

  const removeAnswerField = (index) => {
    const updatedAnswers = newQuestion.answers.filter((_, i) => i !== index);
    setNewQuestion({ ...newQuestion, answers: updatedAnswers });
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...newQuestion.answers];
    updatedAnswers[index].text = value;
    setNewQuestion({ ...newQuestion, answers: updatedAnswers });
  };

  const handleCorrectAnswerChange = (index) => {
    let updatedAnswers = [...newQuestion.answers];
    if (newQuestion.question_type === "single_choice") {
      updatedAnswers = updatedAnswers.map((a, i) => ({
        ...a,
        is_correct: i === index,
      }));
    } else {
      updatedAnswers[index].is_correct = !updatedAnswers[index].is_correct;
    }
    setNewQuestion({ ...newQuestion, answers: updatedAnswers });
  };

  const handleQuestionPointsChange = (e) => {
    setNewQuestion({ ...newQuestion, points: Number(e.target.value) });
  };

  const addQuestion = async (resetForm = false) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `http://127.0.0.1:8000/portal/test/${id}/questions/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(newQuestion),
      }
    );

    if (response.ok) {
      fetchQuestions();
      if (resetForm) {
        setNewQuestion({
          text: "",
          question_type: "single_choice",
          points: 1,
          answers: [
            { text: "", is_correct: false },
            { text: "", is_correct: false },
            { text: "", is_correct: false },
          ],
        });
      } else {
        navigatecontent("Questionlist");
      }
    }
  };

  function navigatecontent(page) {
    setToggle(toggle === page ? 'Question Manager' : page);
  }

  return toggle === "Questionlist" ? (
    <QuestionList testId={id} />
  ) : (
    
    <div className="container">
      <h2>Question Manager</h2>
      <Form>
        <Form.Group>
          <Form.Label>Question</Form.Label>
          <Form.Control
            type="text"
            value={newQuestion.text}
            onChange={handleQuestionChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Question Type</Form.Label>
          <Form.Select value={newQuestion.question_type} onChange={handleTypeChange}>
            <option value="single_choice">Single Choice</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="descriptive">Descriptive</option>
            <option value="true_false">True/False</option>
            <option value="short_answer">Short Answer</option>
            <option value="survey">Survey</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Points for Question</Form.Label>
          <Form.Control
            type="number"
            value={newQuestion.points}
            onChange={handleQuestionPointsChange}
          />
        </Form.Group>

        {newQuestion.question_type !== "descriptive" &&
          newQuestion.question_type !== "short_answer" && (
            <div className="mt-3">
              <h5>Answers</h5>
              {newQuestion.answers.map((answer, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Enter answer"
                    value={answer.text}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  />
                  <Form.Check
                    type={newQuestion.question_type === "single_choice" ? "radio" : "checkbox"}
                    checked={answer.is_correct}
                    onChange={() => handleCorrectAnswerChange(index)}
                    className="mx-2"
                  />
                  <Button variant="danger" size="sm" onClick={() => removeAnswerField(index)}>
                    ✖
                  </Button>
                </div>
              ))}
              <Button variant="secondary" onClick={addAnswerField} className="mt-2">
                + Add Answer
              </Button>
            </div>
          )}

        <div className="mt-3">
          <Button onClick={() => addQuestion(false)}>Save</Button>
          <Button className="mx-2" onClick={() => addQuestion(true)}>Save & Next</Button>
          <Button variant="danger" onClick={() => navigate(`/portal/test/${id}/questions`)}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default QuestionManager;
