import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import questionsData from '/itilv4_questions.json'; // Import the JSON file

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
  fetch('/itilv4_questions.json')
    .then(response => response.json())
    .then(data => setQuestions(data))
    .catch(error => console.error('Error loading questions:', error));
  }, []);
  
  // useEffect(() => {
  //   // Load questions from JSON
  //   if (questionsData && Array.isArray(questionsData)) {
  //     setQuestions(questionsData);
  //   } else {
  //     console.error('Invalid or empty questions data:', questionsData);
  //   }
  // }, []);

  const handleAnswerSelect = (questionId, selectedOption) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    // Calculate score when finishing
    let calculatedScore = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.question] === q.answer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setShowResults(true);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (questions.length === 0) {
    return <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>Loading questions</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    const correctAnswers = questions.filter(q => selectedAnswers[q.question] === q.answer).length;
    const incorrectAnswers = questions.length - correctAnswers;

    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h1>Quiz Complete!</h1>
        <h2>Your Score: {score} / {questions.length} ({percentage}%)</h2>
        <p>Correct Answers: {correctAnswers}</p>
        <p>Incorrect Answers: {incorrectAnswers}</p>
        <h3>Answer Review:</h3>
        <table style={{ width: '80%', margin: '20px auto', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#1e40af', color: 'white' }}>
              <th style={{ padding: '10px' }}>Question #</th>
              <th style={{ padding: '10px' }}>Your Answer</th>
              <th style={{ padding: '10px' }}>Correct Answer</th>
              <th style={{ padding: '10px' }}>Result</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, index) => (
              <tr key={index} style={{ background: index % 2 === 0 ? '#f9fafb' : 'white', borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{index + 1}</td>
                <td style={{ padding: '10px' }}>{selectedAnswers[q.question] || 'Not answered'}</td>
                <td style={{ padding: '10px' }}>{q.answer}</td>
                <td style={{ padding: '10px' }}>
                  {selectedAnswers[q.question] === q.answer ? '✔ Correct' : '✘ Incorrect'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleRestart} style={{ padding: '10px 20px', margin: '10px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '5px' }}>
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>ITIL v4 Mock Exam</h1>
      <div style={{ marginBottom: '20px' }}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>
      <h3>{currentQuestion.question}</h3>
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {currentQuestion.options.map((option, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="radio"
                name={`answer-${currentQuestionIndex}`}
                value={option}
                checked={selectedAnswers[currentQuestion.question] === option}
                onChange={() => handleAnswerSelect(currentQuestion.question, option)}
                style={{ marginRight: '10px' }}
              />
              {option}
            </label>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            background: currentQuestionIndex === 0 ? '#ccc' : '#1e40af',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedAnswers[currentQuestion.question]}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            background: selectedAnswers[currentQuestion.question] ? '#1e40af' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: selectedAnswers[currentQuestion.question] ? 'pointer' : 'not-allowed'
          }}
        >
          Next Question
        </button>
        <button
          onClick={handleFinish}
          disabled={!selectedAnswers[currentQuestion.question]}
          style={{
            padding: '10px 20px',
            background: selectedAnswers[currentQuestion.question] ? '#1e40af' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: selectedAnswers[currentQuestion.question] ? 'pointer' : 'not-allowed'
          }}
        >
          Finish Quiz
        </button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
