import AskQuestionButton from "../question/askQuestionButton";

export default function QuestionsByTagsHeader({ setAskQuestionsPage, tagName, isLoggedIn }) {
  return (<div className="questionHeader">
    <h2>All Questions with Tag: {tagName.name}</h2> 
    <AskQuestionButton 
    isLoggedIn={isLoggedIn}
    setAskQuestionsPage={setAskQuestionsPage} />
  </div>
  )
}