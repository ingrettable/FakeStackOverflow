export default function QuestionStats({ answerCount, viewCount }) {
  return (
    <div className="questionSidebar">
      <p>{answerCount} answers</p>
      <p>{viewCount} views</p>
    </div>
  )
}