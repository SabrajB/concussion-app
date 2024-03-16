import React, {useState} from 'react';
import "./Test.css";
import Timer from "./Timer"

export const Tests = () => {
    const [showResults, setShowResults] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(10);
    const questions = [
    {
        text: "What year is it?",
        options: [
            { id: 0, text: "Correct Answer", isCorrect: true },
            { id: 1, text: "Incorrect Answer", isCorrect: false },
            { id: 2, text: "Did Not Reply", isCorrect: false },
        ],
        score: 1,
        time: 10,
        },
    {
        text: "What season is it?",
        options: [
            { id: 0, text: "Correct Answer", isCorrect: true },
            { id: 1, text: "Incorrect Answer", isCorrect: false },
            { id: 2, text: "Did Not Reply", isCorrect: false },
            ],
        score: 1,
        time: 10,
        },
    {
        text: "What month is it?",
        options: [
            { id: 0, text: "Correct Answer", isCorrect: true },
            { id: 1, text: "Incorrect Answer", isCorrect: false },
            { id: 2, text: "Did Not Reply", isCorrect: false },
            ],
        score: 1,
        time: 10,
        },
    {
        text: "What is today's date?",
        options: [
        { id: 0, text: "Correct Answer", isCorrect: true },
        { id: 1, text: "Incorrect Answer", isCorrect: false },
        { id: 2, text: "Did Not Reply", isCorrect: false },
        ],
        score: 1,
        time: 10,
    },
    {
        text: "What day of the week is it?",
        options: [
            { id: 0, text: "Correct Answer", isCorrect: true },
            { id: 1, text: "Incorrect Answer", isCorrect: false },
            { id: 2, text: "Did Not Reply", isCorrect: false },
        ],
        score: 1,
        time: 10,
        },
    {
        text: "What country are we in?",
        options: [
            { id: 0, text: "Correct Answer", isCorrect: true },
            { id: 1, text: "Incorrect Answer", isCorrect: false },
            { id: 2, text: "Did Not Reply", isCorrect: false },
        ],
        score: 1,
        time: 10,
        },
    {
        text: "What province are we in?",
        options: [
        { id: 0, text: "Correct Answer", isCorrect: true },
        { id: 1, text: "Incorrect Answer", isCorrect: false },
        { id: 2, text: "Did Not Reply", isCorrect: false },
        ],
        score: 1,
        time: 10,
    },
    {
        text: "What city are we in?",
        options: [
            { id: 0, text: "Correct Answer", isCorrect: true },
            { id: 1, text: "Incorrect Answer", isCorrect: false },
            { id: 2, text: "Did Not Reply", isCorrect: false },
        ],
        score: 1,
        time: 10,
        },
    {
        text: "What is the name of this Institution?",
        options: [
            { id: 0, text: "Correct Answer", isCorrect: true },
            { id: 1, text: "Incorrect Answer", isCorrect: false },
            { id: 2, text: "Did Not Reply", isCorrect: false },
        ],
        score: 1,
        time: 10,
        },
    {
        text: "What building are we in?",
        options: [
        { id: 0, text: "Correct Answer", isCorrect: true },
        { id: 1, text: "Incorrect Answer", isCorrect: false },
        { id: 2, text: "Did Not Reply", isCorrect: false },
        ],
        score: 1,
        time: 10,
    },
    {
        text: "I am going to name three objects. When I am done repeat them to me. I will ask you to name them again in a few minutes: Ball / Car / Man",
        options: [
            { id: 0, text: "Correct Answer", isCorrect: true },
            { id: 1, text: "Incorrect Answer", isCorrect: false },
            { id: 2, text: "Did Not Reply", isCorrect: false },
        ],
        score: 3,
        time: 20,
        },
    {
        text: "Spell the word: WORLD.. Now spell it backwards please. (Backwards is what counts)",
        options: [
            { id: 0, text: "Correct Answer", isCorrect: true },
            { id: 1, text: "Incorrect Answer", isCorrect: false },
            { id: 2, text: "Did Not Reply", isCorrect: false },
        ],
        score: 5,
        time: 30,
        },
    {
        text: "What were the three objects I asked you to remember? (They were: Ball / Car / Man)",
        options: [
            { id: 0, text: "Correct Answer", isCorrect: true },
            { id: 1, text: "Incorrect Answer", isCorrect: false },
            { id: 2, text: "Did Not Reply", isCorrect: false },
        ],
        score: 3,
        time: 10,
        },
    {
        text: "*Point at Watch* Ask: What is this called?",
        options: [
            { id: 0, text: "Correct Answer", isCorrect: true },
            { id: 1, text: "Incorrect Answer", isCorrect: false },
            { id: 2, text: "Did Not Reply", isCorrect: false },
        ],
        score: 1,
        time: 10,
        },
    {
        text: "*Point at Pencil* Ask: What is this called?",
        options: [
            { id: 0, text: "Correct Answer", isCorrect: true },
            { id: 1, text: "Incorrect Answer", isCorrect: false },
            { id: 2, text: "Did Not Reply", isCorrect: false },
        ],
        score: 1,
        time: 10,
        },
    {
        text: "Repeat the phrase: No ifs ands or buts?",
        options: [
        { id: 0, text: "Correct Answer", isCorrect: true },
        { id: 1, text: "Incorrect Answer", isCorrect: false },
        { id: 2, text: "Did Not Reply", isCorrect: false },
        ],
        score: 1,
        time: 10,
        },
    ];

    const optionClicked = (isCorrect) => {
        // Increment the score
        console.log(`time:${questions[currentQuestion].time}`);
        if (isCorrect) {
          setScore(score + questions[currentQuestion].score);
        }
    
        if (currentQuestion + 1 < questions.length) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setShowResults(true);
        }

        const newTime = new Date();
        newTime.setSeconds(newTime.getSeconds() + questions[currentQuestion+1].time); // 10 minutes timer
        setTime(newTime);
        console.log(`newtime: ${time}`);
      };
    
    const restartQuiz = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowResults(false);
    };
    

    return (
        <div className="Quiz">
          {/* 1. Header  */}
          <h1>Mini Mental State Examination</h1>
    
          {/* 2. Current Score  */}
          <h2>Score: {score}</h2>
    
          {/* 3. Show results or show the question game  */}
          {showResults ? (
            /* 4. Final Results */
            <div className="final-results">
              <h1>Final Results</h1>
              <h2>
                {score} out of 24 correct
              </h2>
              <button onClick={() => restartQuiz()}>Restart Quiz</button>
            </div>
          ) : (
            /* 5. Question Card  */
            <div className="question-card">
              {/* Current Question  */}
              <h2>
                Question: {currentQuestion + 1} out of {questions.length}
              </h2>
              <h3 className="question-text">{questions[currentQuestion].text}</h3>
    
              {/* List of possible answers  */}
              <ul>
                {questions[currentQuestion].options.map((option) => {
                  return (
                    <li
                      key={option.id}
                      onClick={() => optionClicked(option.isCorrect)}
                    >
                      {option.text}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
            <Timer expiryTimestamp={time} />
        </div>
      );
    }

export default Tests;