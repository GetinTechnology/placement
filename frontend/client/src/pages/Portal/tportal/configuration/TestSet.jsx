import React, { useState } from "react";
import { createTestSet } from "../../../../api";

const TestSetConfig = ({ testId }) => {
  const [orderType, setOrderType] = useState("fixed");
  const [questionsPerPage, setQuestionsPerPage] = useState(1);
  
  const handleSetOrder = async () => {
    const token = localStorage.getItem('authToken')
    try {
      const response = await createTestSet(testId, orderType, questionsPerPage,token);
      console.log("Test set updated:", response);
      alert("Test order updated!");
    } catch (error) {
      console.error("Failed to set test order", error);
    }
  };

  return (
    <div className="test-set">
      <h3>Test Sets</h3>
      <div>
        <p>Question Order</p>
        <div className="radio-group">
          <label className="custom-radio">
            <input
              type="radio"
              value="fixed"
              checked={orderType === "fixed"}
              onChange={() => setOrderType("fixed")}
            />
             <span class="radio-mark"></span>
            Fixed Order
          </label>
          <label className="custom-radio">
            <input
              type="radio"
              value="shuffle"
              checked={orderType === "shuffle"}
              onChange={() => setOrderType("shuffle")}
            />
             <span class="radio-mark"></span>
            Shuffle Questions & Answers
          </label>
        </div>
        <p>Question Count in page</p>
        <input
          type="number"
          value={questionsPerPage}
          onChange={(e) => setQuestionsPerPage(parseInt(e.target.value))}
          min={1}
          style={{padding:'10px',width:'100px'}}
        />
      </div>

      <button onClick={handleSetOrder} className="btn btn-success mt-2">Save Settings</button>
    </div>
  );
};

export default TestSetConfig;
