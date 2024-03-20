import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./MMSE.css";
import Timer from "./Timer";

export const MMSE = () => {
    const [showResults, setShowResults] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const { state } = useLocation();
    const player_id = state.pid;

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
          text: "I am going to name three objects. When I am done repeat them to me.\n I will ask you to name them again in a few minutes: Ball / Car / Man",
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
        if (isCorrect) {
            setScore(score + questions[currentQuestion].score);
        }

        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResults(true);
        }
    };

    const navigate = useNavigate();

    const completeQuiz = (finalScore) => {
        navigate(
            `/tests/${player_id}/upload`,
            {
                state: {
                    pid: player_id,
                    mmse_result: finalScore
                }
            });
    };

    return (
        <div className="Quiz">
            {/* Header */}
            <h1>Mini Mental State Examination</h1>

            {/* Instructions Card */}
            {showInstructions && (
                <div className="instructions-card">
                    <h2>Instructions</h2>
                    <p>1. Ask each question a maximum of three times. If the subject does not respond, score 0. </p>
                    <p>2.  If the person answers incorrectly, score 0. Accept that answer and do not ask the question again, hint, or provide any physical clues such as head shaking, etc</p>
                    <p>3. If the person answers: What did you say?, do not explain or engage in conversation. Merely repeat the same directions a maximum of three times.</p>
                    <button onClick={() => setShowInstructions(false)}>Start Quiz</button>
                </div>
            )}

            {/* Current Question */}
            {!showResults && !showInstructions && (
                <div className="question-card">
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

            {/* Final Results */}
            {showResults && (
                <div className="final-results">
                    <h1>Final Results</h1>
                    <h2>
                        {score} out of 24 correct
                    </h2>
                    <button onClick={() => completeQuiz(score)}>Continue to Upload Videos</button>
                </div>
            )}
            {/* <Timer expiryTimestamp={time} /> */}
        </div>
    );
}

export default MMSE;
