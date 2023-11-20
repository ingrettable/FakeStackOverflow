export default function AskQuestionButton({ setAskQuestionsPage }) {
    return (
      <button className="buttonStyle" id="askButton" onClick={setAskQuestionsPage}>
        Ask Question
      </button>
  
    )
  }