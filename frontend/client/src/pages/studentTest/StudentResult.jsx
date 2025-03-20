import React, { useState, useEffect } from "react";
import axios from "axios";

const EvaluateDescriptive = () => {
  const [responses, setResponses] = useState([]);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    // Fetch unanswered descriptive responses
    axios.get("/api/tests/descriptive-responses/")
      .then(response => setResponses(response.data))
      .catch(error => console.error("Error fetching responses:", error));
  }, []);

  const handleGradeChange = (responseId, marks) => {
    setGrades({ ...grades, [responseId]: marks });
  };

  const handleSubmitGrades = async () => {
    try {
      const payload = {
        evaluations: Object.keys(grades).map((responseId) => ({
          response_id: parseInt(responseId),
          marks_awarded: parseFloat(grades[responseId]),
        })),
      };

      await axios.post("/api/tests/evaluate-descriptive/", payload);
      alert("Evaluations submitted successfully!");
    } catch (error) {
      console.error("Error submitting evaluations:", error);
      alert("Failed to submit grades.");
    }
  };

  return (
    <div>
      <h2>Evaluate Descriptive Answers</h2>
      {responses.map((response) => (
        <div key={response.id}>
          <h3>{response.question.text}</h3>
          <p><strong>Student Answer:</strong> {response.descriptive_answer}</p>
          <input
            type="number"
            placeholder="Enter Marks"
            onChange={(e) => handleGradeChange(response.id, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleSubmitGrades}>Submit Grades</button>
    </div>
  );
};

export default EvaluateDescriptive;
