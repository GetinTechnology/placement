import { useEffect, useState } from "react";

const ResultsTable = ({ testId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/portal/test/${testId}/all_results`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`, // Replace with actual token logic
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading results...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (results.length === 0) return <p>No results available.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Test Results</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Student Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Score</th>
              <th className="border p-2">Total Marks</th>
              <th className="border p-2">Percentage</th>
              <th className="border p-2">Submitted At</th>
              <th className="border p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border p-2">{result.student_name}</td>
                <td className="border p-2">{result.student_email}</td>
                <td className="border p-2">{result.score}</td>
                <td className="border p-2">{result.total_marks}</td>
                <td className="border p-2">{result.percentage}%</td>
                <td className="border p-2">
                  {new Date(result.submitted_at).toLocaleString()}
                </td>
                <td className="border p-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => console.log(result.answers)}
                  >
                    View Answers
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
