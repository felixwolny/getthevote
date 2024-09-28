import React, { useEffect, useState } from 'react';
import { db } from './firebase'; // Import Firestore database reference
import { collection, addDoc, onSnapshot, updateDoc, doc } from 'firebase/firestore'; // Import Firestore functions
import './style.css';

const App = () => {
  const [polls, setPolls] = useState([]);
  const [pollName, setPollName] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPolls = async () => {
      const pollsCollection = collection(db, 'polls');
      onSnapshot(pollsCollection, (snapshot) => {
        const fetchedPolls = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setPolls(fetchedPolls);
      });
    };

    fetchPolls();
  }, []);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index] = value;
    setPollOptions(updatedOptions);
  };

  const addOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const createPoll = async () => {
    if (!pollName || pollOptions.some(option => option.trim() === '')) {
      setError('Please provide a poll name and options.');
      return;
    }

    const newPoll = {
      name: pollName,
      options: pollOptions.map(option => ({ name: option, votes: 0 })),
    };

    try {
      await addDoc(collection(db, 'polls'), newPoll);
      setPollName('');
      setPollOptions(['', '']);
      setError('');
    } catch (error) {
      setError('Error creating poll: ' + error.message);
    }
  };

  const handleVote = async (pollIndex, optionIndex) => {
    const votedPollKey = `votedPolls-${polls[pollIndex].id}`;
    const hasVoted = localStorage.getItem(votedPollKey);

    if (hasVoted) {
      alert('You have already voted on this poll.');
      return;
    }

    // Update the vote count
    const updatedPolls = [...polls];
    updatedPolls[pollIndex].options[optionIndex].votes += 1;

    const pollRef = doc(db, 'polls', polls[pollIndex].id); // Get the document reference

    try {
      await updateDoc(pollRef, {
        options: updatedPolls[pollIndex].options,
      });

      localStorage.setItem(votedPollKey, 'true');
      setPolls(updatedPolls); // Update local state
    } catch (error) {
      console.error('Error updating vote:', error);
    }
  };

  return (
    <div>
      <h1>Create a Poll</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Poll Name"
        value={pollName}
        onChange={(e) => setPollName(e.target.value)}
      />
      {pollOptions.map((option, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
        />
      ))}
      <button onClick={addOption}>Add Option</button>
      <button onClick={createPoll}>Create Poll</button>

      <h2>Polls</h2>
      {polls.map((poll, pollIndex) => (
        <div className="poll-container" key={poll.id}>
          <h3>{poll.name}</h3>
          {poll.options.map((option, optionIndex) => (
            <div key={optionIndex}>
              <button onClick={() => handleVote(pollIndex, optionIndex)}>
                {option.name} - {option.votes} votes
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;
