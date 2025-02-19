import React from 'react'
import './newtest.css'

function BasicSettings() {
  return (
    <div>
        <h4>Basic Settings</h4>
        <div className='is'>
        <p>Initial Settings</p>
        <form action="">
            <label htmlFor="">Test Name</label>
            <input type="text" />
            <label htmlFor="">Catogary</label>
            <select name="" id="">
                <option value="uncategorized">uncategorized</option>
            </select>
            <label htmlFor="">Description</label>
            <textarea name="" id="" rows={3}></textarea>
        </form>
       
        </div>
        <button className='cb'>Create</button>
    </div>
  )
}

export default BasicSettings