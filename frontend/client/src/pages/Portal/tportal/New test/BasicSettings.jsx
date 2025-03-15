import React, { useState,useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './newtest.css';

function BasicSettings({ onTestCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'uncategorized',
    description: '',
  });

  const [categories, setCategories] = useState(['uncategorized']);
  const [newCategory, setNewCategory] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('You are not logged in!');
        return;
    }

    const payload = {
        name: formData.name,
        category: parseInt(formData.category, 10),  // Convert category to integer
        description: formData.description
    };

    console.log("Submitting data:", payload); // Debugging

    try {
        const response = await fetch('http://localhost:8000/portal/test/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log("Response Data:", data);

        if (response.ok) {
            alert('Test created successfully!');
            onTestCreated(data);
            setFormData({ name: '', category: 'uncategorized', description: '' });
        } else {
            alert(data.error || data.test || 'Failed to create test.');
        }
    } catch (error) {
        console.error('Error creating test:', error);
    }
};



  const handleAddCategory = async () => {
    if (newCategory.trim() === '') {
      alert('Category name cannot be empty');
      return;
    }
  
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You are not logged in!');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8000/portal/category/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategory }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setCategories([...categories, data.name]);
        setNewCategory('');
        setShowModal(false);
      } else {
        alert(data.error || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
      if (!token) {
        console.error('No authentication token found!');
        return;
      }
  
      try {
        const response = await fetch('http://localhost:8000/portal/category/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`, // Include token in request
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchCategories();
  }, []);
  

  return (
    <div>
      <h4>Basic Settings</h4>
      <div className='is'>
        <p>Initial Settings</p>
        <form onSubmit={handleSubmit}>
          <label>Test Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Category</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <select name="category" value={formData.category} onChange={handleChange}>
          {categories.map((cat, index) => (
                <option key={index} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <Button variant="success" className='ml-2' onClick={() => setShowModal(true)}>+</Button>
          </div>

          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3}></textarea>

          <button type="submit" className='cb'>Create</button>
        </form>
      </div>

      {/* Bootstrap Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAddCategory}>Add</Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BasicSettings;
