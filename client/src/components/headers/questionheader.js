import AskQuestionButton from "../question/askQuestionButton";

export default function QuestionHeader({ setAskQuestionsPage }) {
  return (
    <div className="questionHeader">
      <h2>All Questions</h2>
      <AskQuestionButton setAskQuestionsPage={setAskQuestionsPage} />
    </div>
  )
}