import AskQuestionButton from "../question/askQuestionButton";

export default function TagHeader({ tags, setAskQuestionsPage }) {
  return (
    <div className="tagsHeader">
      <h2>{tags.length} Tags</h2>
      <h2>All Tags</h2>
      <AskQuestionButton setAskQuestionsPage={setAskQuestionsPage} />
    </div>
  )
}