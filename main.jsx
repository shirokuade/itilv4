import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import questionsData from './itilv4_questions.json'; // Import the JSON file

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Load questions from JSON
    if (questionsData && Array.isArray(questionsData)) {
      setQuestions(questionsData);
    } else {
      console.error('Invalid or empty questions data:', questionsData);
    }
  }, []);

  const handleAnswerSelect = (questionId, selectedOption) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate score
      let calculatedScore = 0;
      questions.forEach(q => {
        if (selectedAnswers[q.question] === q.answer) {
          calculatedScore++;
        }
      });
      setScore(calculatedScore);
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (questions.length === 0) {
    return <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>Loading questions</div>
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h1>Quiz Complete!</h1>
        <h2>Your Score: {score} / {questions.length} ({percentage}%)</h2>
        <p>Congratulations! Review the questions to improve.</p>
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
      <ul style={{ listStyleType: 'none', padding: 0 }}>
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
      <button
        onClick={handleNext}
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
        {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
      </button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);