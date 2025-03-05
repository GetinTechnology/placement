import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const TestAttendingPage = () => {
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    axios.get(`/portal/tests/${testId}`)
      .then(response => setTest(response.data))
      .catch(error => console.error("Error fetching test details", error));
  }, [testId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    axios.post(`/portal/tests/${testId}/submit`, { answers })
      .then(response => alert("Test submitted successfully!"))
      .catch(error => console.error("Error submitting test", error));
  };

  if (!test) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{test.name}</h1>
      <p className="mb-6">{test.description}</p>
      {test.questions.map((q, index) => (
        <Card key={q.id} className="mb-4">
          <CardContent>
            <p className="font-medium mb-2">{index + 1}. {q.text}</p>
            {q.type === "single_choice" && q.options.map(opt => (
              <label key={opt} className="block">
                <input type="radio" name={q.id} value={opt} onChange={() => handleAnswerChange(q.id, opt)} />
                {opt}
              </label>
            ))}
            {q.type === "multiple_choice" && q.options.map(opt => (
              <label key={opt} className="block">
                <input type="checkbox" value={opt} onChange={(e) => {
                  const selected = answers[q.id] || [];
                  handleAnswerChange(q.id, e.target.checked ? [...selected, opt] : selected.filter(o => o !== opt));
                }} />
                {opt}
              </label>
            ))}
            {q.type === "descriptive" && (
              <textarea className="w-full border p-2" onChange={(e) => handleAnswerChange(q.id, e.target.value)} />
            )}
          </CardContent>
        </Card>
      ))}
      <Button onClick={handleSubmit} className="mt-4">Submit Test</Button>
    </div>
  );
};

export default TestAttendingPage;
