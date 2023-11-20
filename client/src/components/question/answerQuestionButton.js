export default function AnswerQuestionButton({ setAnswerQuestionPage }) {
    return (
      <div>
        <hr className="dottedhr"/>
      <button className="buttonStyle" id="answerButton" onClick={setAnswerQuestionPage}>
        Answer Question
      </button>
      </div>

    )
  }