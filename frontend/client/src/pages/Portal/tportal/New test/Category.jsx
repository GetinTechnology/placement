import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://127.0.0.1:8000/portal/category/", {
        headers: { Authorization: `Token ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://127.0.0.1:8000/portal/category/", 
        { name: newCategory },
        { headers: { Authorization: `Token ${token}` } }
      );
      setCategories([...categories, response.data]);
      setNewCategory("");
      toast.success("Category added successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error adding category");
    }
  };

  const handleUpdateCategory = async (id) => {
    if (!updatedName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `http://127.0.0.1:8000/portal/modeify_category/${id}`, 
        { name: updatedName },
        { headers: { Authorization: `Token ${token}` } }
      );
      setCategories(
        categories.map((cat) => (cat.id === id ? { ...cat, name: updatedName } : cat))
      );
      setEditingCategory(null);
      toast.success("Category updated successfully!");
    } catch (error) {
      toast.error("Error updating category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://127.0.0.1:8000/portal/modeify_category/${id}`, {
        headers: { Authorization: `Token ${token}` },
      });
      setCategories(categories.filter((cat) => cat.id !== id));
      toast.success("Category deleted successfully!");
    } catch (error) {
      toast.error("Error deleting category");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Category Management</h2>
      <ToastContainer />

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleAddCategory}>
          Add Category
        </button>
      </div>

      <ul className="list-group">
        {categories.map((cat) => (
          <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
            {editingCategory === cat.id ? (
              <>
                <input
                  type="text"
                  className="form-control"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                />
                <button className="btn btn-success btn-sm" onClick={() => handleUpdateCategory(cat.id)}>
                  Save
                </button>
              </>
            ) : (
              <>
                <span>{cat.name}</span>
                <div>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditingCategory(cat.id);
                      setUpdatedName(cat.name);
                    }}
                  >
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCategory(cat.id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManagement;
