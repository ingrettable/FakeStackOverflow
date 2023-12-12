import CommentList from '../block-metadata/comment';
import formatElapsedTime from '../lib/time';
import { useState } from 'react';

export default function AnswerInfo({
  answers,
  fetchUserByID,
  // comment stuff
  upvoteComment,
  isLoggedIn,
  postComment,
  getCommentByID,

}) {
  const showUsername = (ansby) => {
    const id = fetchUserByID(ansby)
    const username = id === undefined ? "Anonymous" : id.username;
    return username
  }

  return (
    <div>
      {
        answers.map((answer, index) => (
          <Answer
            answer={answer}
            showUsername={showUsername}
            key={index}
            // COMMENT STUFF
            upvoteComment={upvoteComment}
            isLoggedIn={isLoggedIn}
            postComment={postComment}
            fetchUserByID={fetchUserByID}
            getCommentByID={getCommentByID}
          />
        ))
      }

    </div >
  );
}

function Answer({
  answer,
  showUsername,
  upvoteComment,
  isLoggedIn,
  postComment,
  fetchUserByID,
  getCommentByID,

}) {

  const [renderComments, setRenderComments] = useState(answer.comments);

  const addCommentID = (id) => {
    console.log("addCommentID", id, renderComments)
    setRenderComments([id, ...renderComments]);
  }


  return (
    <div key={answer._id}>
      <div className="answerInfo" >
        <p>{answer.text}</p>
        <p>
          <span className="usernameAnswer">{showUsername(answer.ans_by)}
          </span> answered on {formatElapsedTime(answer.ans_date_time)}</p>
      </div>
      <CommentList 
        comments={renderComments}
        addCommentID={addCommentID}
        upvoteComment={upvoteComment}
        isLoggedIn={isLoggedIn}
        postComment={postComment}
        parentID={answer._id}
        fetchUserByID={fetchUserByID}
        getCommentByID={getCommentByID}
      />
    </div>
  )
}