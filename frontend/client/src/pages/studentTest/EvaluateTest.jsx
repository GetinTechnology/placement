import { useEffect, useState } from "react";

const EvaluateTest = ({ testId }) => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [marks, setMarks] = useState({});

  useEffect(() => {
    fetchPendingEvaluations();
  }, []);

  const fetchPendingEvaluations = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/portal/pending-evaluations/${testId}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch evaluations");
      }

      const data = await response.json();
      setEvaluations(data.pending_evaluations);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (questionId, value) => {
    setMarks((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const submitEvaluation = async () => {
    try {
      const evaluationsData = evaluations.map((evaluation) => ({
        attempt_id: evaluation.attempt_id,
        question_id: evaluation.question_id,
        marks_awarded: marks[evaluation.question_id] || 0,
      }));

      const response = await fetch(`http://127.0.0.1:8000/portal/evaluate-answers/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ evaluations: evaluationsData }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit evaluations");
      }

      alert("Evaluations submitted successfully!");
      fetchPendingEvaluations(); // Refresh data
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <p>Loading evaluations...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (evaluations.length === 0) return <p>No pending evaluations.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Evaluate Test Answers</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Student Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Question</th>
              <th className="border p-2">Answer Type</th>
              <th className="border p-2">Student Answer</th>
              <th className="border p-2">Correct Answer</th>
              <th className="border p-2">Marks</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((evaluation, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border p-2">{evaluation.student_name}</td>
                <td className="border p-2">{evaluation.student_email}</td>
                <td className="border p-2">{evaluation.question_text}</td>
                <td className="border p-2 capitalize">{evaluation.answer_type}</td>
                <td className="border p-2">{Array.isArray(evaluation.student_answer) ? evaluation.student_answer.join(", ") : evaluation.student_answer}</td>
                <td className="border p-2">{Array.isArray(evaluation.correct_answer) ? evaluation.correct_answer.join(", ") : evaluation.correct_answer}</td>
                <td className="border p-2">
                  <input
                    type="number"
                    className="w-20 border p-1"
                    value={marks[evaluation.question_id] || ""}
                    onChange={(e) => handleMarksChange(evaluation.question_id, e.target.value)}
                    min="0"
                    max="10"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={submitEvaluation}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Submit Evaluations
      </button>
    </div>
  );
};

export default EvaluateTest;
