import AskQuestionButton from "../question/askQuestionButton";

export default function SearchHeader({ setAskQuestionsPage }) {
  return (<div className="questionHeader">
    <h2>Search Results</h2>
    <AskQuestionButton setAskQuestionsPage={setAskQuestionsPage} />
  </div>
  )
}