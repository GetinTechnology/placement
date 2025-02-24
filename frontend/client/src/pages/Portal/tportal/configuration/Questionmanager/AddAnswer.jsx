import React, { useState } from "react";

const AddAnswer = ({ questionId, onAnswerAdded }) => {
  const [answerText, setAnswerText] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`http://localhost:8000/question/${questionId}/answers/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ text: answerText, is_correct: isCorrect }),
      });

      if (!response.ok) throw new Error("Failed to add answer");

      const data = await response.json();
      onAnswerAdded(data);  // Notify parent component
      setAnswerText("");  // Reset input
      setIsCorrect(false); // Reset checkbox
    } catch (error) {
      console.error("Error adding answer:", error);
    }
  };

  return (
    <div>
      <h4>Add Answer</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter answer"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={isCorrect}
            onChange={(e) => setIsCorrect(e.target.checked)}
          />
          Correct Answer
        </label>
        <button type="submit">Add Answer</button>
      </form>
    </div>
  );
};

export default AddAnswer;
