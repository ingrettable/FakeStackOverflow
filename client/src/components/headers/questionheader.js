import AskQuestionButton from "../question/askQuestionButton";

export default function QuestionHeader({ setAskQuestionsPage, isLoggedIn }) {
  // console.log("question header", isLoggedIn)
  return (
    <div className="questionHeader">
      <h2>All Questions</h2>
      <AskQuestionButton isLoggedIn={isLoggedIn} setAskQuestionsPage={setAskQuestionsPage} />
    </div>
  )
}