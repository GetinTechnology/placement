import React, { useEffect, useState } from "react";
import { fetchDescriptiveQuestions, submitMarks } from "../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DescriptiveGrading = ({ testId }) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState({}); // Tracks individual submission status

  useEffect(() => {
    loadResponses();
  }, []);

  const loadResponses = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const data = await fetchDescriptiveQuestions(testId, token);
      setResponses(data.responses);
    } catch (error) {
      toast.error("Failed to fetch questions.");
    } finally {
      setLoading(false);
    }
  };
  const handleMarkChange = (index, marks) => {
    setResponses((prev) => {
      const updatedResponses = [...prev];
      updatedResponses[index].marks_awarded = marks;
      return updatedResponses;
    });
  };

  const handleSubmit = async (index) => {
    const response = responses[index];
    if (!response.marks_awarded && response.marks_awarded !== 0) {
      toast.error("Please enter marks before submitting.");
      return;
    }

    setSubmitting((prev) => ({ ...prev, [response.response_id]: true }));

    try {
      const token = localStorage.getItem("authToken");
      await submitMarks(testId, [response], token); // Send only one response
      toast.success("Marks submitted successfully!");
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setSubmitting((prev) => ({ ...prev, [response.response_id]: false }));
    }
  };

  if (loading) return <p className="text-center mt-4">Loading questions...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Descriptive Question Grading</h2>
      <ToastContainer />

      {responses.length === 0 ? (
        <p className="text-center">No descriptive responses available.</p>
      ) : (
        responses.map((resp, index) => (
          <div key={resp.response_id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{resp.question}</h5>
              <h6 className="text-muted">Student: {resp.student}</h6>
              <p className="card-text">{resp.descriptive_answer}</p>
              <div className="mt-3">
                <label className="form-label">Marks (Max: {resp.max_marks})</label>
                <input
                  type="number"
                  className="form-control w-25"
                  value={resp.marks_awarded || ""}
                  min="0"
                  max={resp.max_marks}
                  onChange={(e) => handleMarkChange(index, Number(e.target.value))}
                />
              </div>
              <button
                className="btn btn-success mt-3"
                onClick={() => handleSubmit(index)}
                disabled={submitting[resp.response_id]}
              >
                {submitting[resp.response_id] ? "Submitting..." : "Submit Marks"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DescriptiveGrading;
