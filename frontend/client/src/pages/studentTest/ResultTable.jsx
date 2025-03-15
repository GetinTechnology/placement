import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ResultTable = () => {
const { id } = useParams(); // Get test ID from URL

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
        try {
            const token = localStorage.getItem("studentToken"); 
            const response = await axios.get(`http://127.0.0.1:8000/portal/test/${id}/result`, {
              headers: { Authorization: `Token ${token}` },
            });
    
            setResult(response.data);
            console.log(response.data)
          } catch (err) {
        setError("Failed to load test results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!result) return <p>No test results available.</p>;

  return (
    <div className="">  
      <h2 className="text-xl font-bold mb-4">Results table{result.test_name}</h2>
      <div></div>

      <div>
        <p>Test Result</p>
        <h4>Browse Test result</h4>
      </div>
      <p><strong>Score:</strong> {result.score} / {result.total_marks}</p>
      <p><strong>Percentage:</strong> {result.percentage}%</p>
      <p><strong>Time Taken:</strong> {result.time_taken}</p>
      <p><strong>Submitted At:</strong> {new Date(result.submitted_at).toLocaleString()}</p>
      
      
    </div>
  );
};

export default ResultTable;