export default function AnswerQuestionButton({ setAnswerQuestionPage, isLoggedIn }) {
    const className = isLoggedIn ? "buttonStyle " : "buttonStyle disabledButton";
    return (
      <div>
        <hr className="dottedhr"/>
      <button className={className} id="answerButton" onClick={setAnswerQuestionPage}>
        Answer Question
      </button>
      </div>

    )
  }