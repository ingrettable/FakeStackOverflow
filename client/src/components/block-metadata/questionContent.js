import RenderHyperlinks from "../question/renderHyperlinks"

function QuestionPreview({ title, text }) {
  return (
    <div >
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  )
}

function QuestionContent({ _id, title, text, tags, displayQuestionInfo }) {
  return (
    <div className="questionMain">
      <a id={`question-${_id}`} onClick={displayQuestionInfo} href="#" className="header-button-style">
        <h3>{title}</h3>
      </a>
      {/* <p>{text}</p> */}
      <p> <RenderHyperlinks text={text} /> </p>
      <p>{tags.map((tag, index) => (
        <span key={index} className="tag">{tag}</span>
      ))}</p>
    </div>
  )
}

export {
  QuestionPreview,
  QuestionContent
}