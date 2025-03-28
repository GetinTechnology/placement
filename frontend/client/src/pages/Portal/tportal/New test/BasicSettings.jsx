import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './newtest.css';
import CategoryManagement from './Category';
import { useNavigate } from 'react-router-dom';

function BasicSettings({ onTestCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
  });
  
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found!');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/portal/category/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
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
  }, [showModal]);

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
        category: parseInt(formData.category, 10),
        description: formData.description,
    };

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
        
        if (response.ok) {
            setFormData({ name: '', category: '', description: '' });
            navigate('/portal')
        } else {
            alert(data.error || 'Failed to create test.');
        }
    } catch (error) {
        console.error('Error creating test:', error);
    }
  };

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
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <Button variant="success" className='ml-2' onClick={() => setShowModal(true)}>+</Button>
          </div>

          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3}></textarea>

          <button type="submit" className='cb'>Create</button>
        </form>
      </div>

      {/* Bootstrap Modal for Category Management */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Manage Categories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CategoryManagement onCategoryAdded={setCategories} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BasicSettings;
