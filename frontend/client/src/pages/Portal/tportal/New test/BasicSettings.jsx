import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './newtest.css';

function BasicSettings({ onTestCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'uncategorized',
    description: '',
  });

  const [categories, setCategories] = useState(['uncategorized']);
  const [newCategory, setNewCategory] = useState('');
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
    try {
      const response = await fetch('http://localhost:8000/portal/test/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Test created successfully!');
        onTestCreated(data);
        setFormData({ name: '', category: 'uncategorized', description: '' });
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Failed to create test.');
      }
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== '' && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
      setShowModal(false);
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
            <select name="category" value={formData.category} onChange={handleChange}>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
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
