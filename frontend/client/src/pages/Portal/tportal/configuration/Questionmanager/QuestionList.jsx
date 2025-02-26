import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const QuestionList = () => {
const { id } = useParams(); 
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    fetchQuestions();
    
  }, []);

  const fetchQuestions = async () => {
   
    try {
        const token = localStorage.getItem("authToken"); // Adjust according to your storage method
        console.log(token)
      const response = await axios.get(`http://127.0.0.1:8000/portal/test/${id}/questions`,{
        headers: {
            Authorization: `Token ${token}`,
        },});
      setQuestions(response.data);
      setLoading(false);
    } catch (error) {
        console.log(error)
      setError("Failed to load questions");
      setLoading(false);
    }
  };
  console.log(questions)
  const handleDelete = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    
    try {
        const token = localStorage.getItem("authToken");
      await axios.delete(`http://127.0.0.1:8000/portal/test/${id}/question/${questionId}/delete/`,
        {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
      );
      setQuestions(questions.filter((q) => q.id !== questionId));
    } catch (error) {
      alert("Failed to delete question");
    }
  };

  return (
    
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Question List</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ul className="border rounded-lg p-4">
          {questions.map((question) => (
            <li key={question.id} className="flex justify-between items-center border-b py-2">
              <div>
                <p className="font-semibold">{question.text}</p>
                <p className="text-sm text-gray-600">Type: {question.question_type}</p>
              </div>
              <div>
                <button className="text-blue-500 mr-2" onClick={() => alert("Edit not implemented")}>
                  ✏️ Edit
                </button>
                <button className="text-red-500" onClick={() => handleDelete(question.id)}>
                  🗑 Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuestionList;
