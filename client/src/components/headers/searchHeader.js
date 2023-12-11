import AskQuestionButton from "../question/askQuestionButton";

export default function SearchHeader({ setAskQuestionsPage, isLoggedIn }) {
  return (<div className="questionHeader">
    <h2>Search Results</h2>
    <AskQuestionButton isLoggedIn={isLoggedIn} setAskQuestionsPage={setAskQuestionsPage} />
  </div>
  )
}