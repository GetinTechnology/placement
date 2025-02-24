import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

const QuestionManager = () => {
  const { testId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    text: "",
    answer_type: "single",
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://127.0.0.1:8000/portal/test/${testId}/questions`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    };

    fetchQuestions();
  }, [testId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    
    const response = await fetch(`http://127.0.0.1:8000/portal/test/${testId}/questions/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const newQuestion = await response.json();
      setQuestions([...questions, newQuestion]);
      setFormData({ text: "", answer_type: "single" });
    }
  };

  return (
    <Container>
      <h2>Manage Questions</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Question</Form.Label>
          <Form.Control type="text" name="text" value={formData.text} onChange={handleChange} required />
        </Form.Group>

        <Form.Group>
          <Form.Label>Answer Type</Form.Label>
          <Form.Select name="answer_type" value={formData.answer_type} onChange={handleChange}>
            <option value="single">Single Choice</option>
            <option value="multiple">Multiple Choice</option>
            <option value="descriptive">Descriptive</option>
            <option value="true_false">True/False</option>
            <option value="short_answer">Short Answer</option>
            <option value="survey">Survey</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit">Add Question</Button>
      </Form>

      <h3>Existing Questions</h3>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>{question.text} - {question.answer_type}</li>
        ))}
      </ul>
    </Container>
  );
};

export default QuestionManager;
