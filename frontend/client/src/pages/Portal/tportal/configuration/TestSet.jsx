import React, { useState } from "react";
import { createTestSet } from "../../../../api";

const TestSetConfig = ({ testId }) => {
  const [orderType, setOrderType] = useState("fixed");
  const [questionsPerPage, setQuestionsPerPage] = useState(5);

  const handleSetOrder = async () => {
    try {
      const response = await createTestSet(testId, orderType, questionsPerPage);
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
      <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
        <option value="fixed">Fixed Order</option>
        <option value="shuffle">Shuffle Questions & Answers</option>
      </select>
      <input
        type="number"
        value={questionsPerPage}
        onChange={(e) => setQuestionsPerPage(parseInt(e.target.value))}
      />
      </div>

      <button onClick={handleSetOrder}>Save Settings</button>
    </div>
  );
};

export default TestSetConfig;
