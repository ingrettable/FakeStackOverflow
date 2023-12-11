export default function AskQuestionButton({ setAskQuestionsPage, isLoggedIn }) {
  // console.log(isLoggedIn)
  const className = isLoggedIn ? "buttonStyle " : "buttonStyle disabledButton";
  return (
      <button className={className} id="askButton" onClick={setAskQuestionsPage}>
        Ask Question
      </button>
  
    )
  }