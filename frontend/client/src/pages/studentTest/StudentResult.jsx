import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const StudentResult = () => {
  const { testId } = useParams(); // Get test ID from URL
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("studentToken"); // Assuming token is stored in localStorage
        const response = await axios.get(`http://127.0.0.1:8000/portal/test/${testId}/result`, {
          headers: { Authorization: `Token ${token}` },
        });
        
        setResult(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching results");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [testId]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // Check if any descriptive answers are still ungraded
  const pendingGrading = result.answers.some(item => item.question_type === "descriptive" && item.score === 0);
  console.log(pendingGrading)
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Test Results: {result.test_name}
      </h2>
      {pendingGrading ? (
        <p className="text-lg text-yellow-600 text-center">Some descriptive answers are pending evaluation. Your final score will be available once they are graded.</p>
      ) : (
        <div className="text-center mb-4">
          <p className="text-lg font-semibold">Score: {result.score} / {result.total_marks}</p>
          <p className="text-lg text-blue-600">Percentage: {result.percentage.toFixed(2)}%</p>
          <p className="text-sm text-gray-600">Submitted at: {new Date(result.submitted_at).toLocaleString()}</p>
        </div>
      )}
      
      <h3 className="text-xl font-semibold mt-4 mb-3">Question Breakdown</h3>
      <div className="space-y-4">
        {result.answers.map((item, index) => (
          <div key={item.question_id} className="p-4 border rounded-lg">
            <p className="font-medium">{index + 1}. {item.question_text}</p>
            <p className="text-sm text-gray-600">
              <strong>Your Answer:</strong> {item.student_answer.length > 0 ? item.student_answer : "No Answer"}
            </p>
            {item.question_type !== "descriptive" ? (
              <>
                <p className="text-sm text-green-600">
                  <strong>Correct Answer:</strong> {item.correct_answer.join(", ")}
                </p>
                <p className={`text-sm font-semibold ${item.is_correct ? "text-green-500" : "text-red-500"}`}>
                  {item.is_correct ? "✔ Correct" : "✘ Incorrect"}
                </p>
              </>
            ) : (
              <p className="text-sm text-blue-600">
                <strong>Points Awarded:</strong> {item.points !== null ? item.points : "Pending"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentResult;
