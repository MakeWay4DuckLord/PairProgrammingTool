// src/CreateSession.js
import React, { useState } from 'react';
import { generate} from "random-words";
import '../index.css';

function CreateSession() {
  // Generate two random words and concatenate them with a "-"
  const generateRandomId = () => {
    const word1 = generate();
    const word2 = generate();
    return `${word1}-${word2}`;
  };

  const [userId, setUserId] = useState(generateRandomId()); // Initialize with a random ID
  const [partnerId, setPartnerId] = useState('');

  return (
    <div className="container">
      <h1>Create Session</h1>
      <p>Your User ID: {userId}</p>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Partner's ID"
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
        />
        <button>Start Session</button>
      </div>
    </div>
  );
}

export default CreateSession;

