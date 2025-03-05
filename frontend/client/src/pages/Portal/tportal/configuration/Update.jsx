import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import './configure.css'

function UpdateTestPage() {
  const { id } = useParams(); // Get test ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("User not authenticated");
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/portal/test/", {
          headers: { Authorization: `Token ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tests");
        }

        const data = await response.json();

        const testData = data.find((test) => {
            console.log("Checking test.id:", test.id, "against testId:", id);
            return test.id === parseInt(id, 10);
          });
          console.log("Final testData:", testData);

        if (!testData) {
          throw new Error("Test not found");
        }

        setFormData({
          name: testData.name || "",
          category: testData.category_name || "",
          description: testData.description || "",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("User not authenticated!");
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/portal/test/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update test details");

      alert("Test updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating test:", error);
      alert(error.message);
    }
  };

  if (loading) return <p>Loading test details...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container">
      <h3>Basic Settings</h3>
      <div className="update-test-form">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="testName">
          <Form.Label>Test Name</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group controlId="testCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control type="text" name="category" value={formData.category} onChange={handleChange} required />
        </Form.Group>

        <Form.Group controlId="testDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Update Test
        </Button>
      </Form>
      </div>
     
    </div>
  );
}

export default UpdateTestPage;
