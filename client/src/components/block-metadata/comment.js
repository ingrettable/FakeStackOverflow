import { useState, useEffect } from "react";
// import mainpage.css
import "../../stylesheets/MainPage.css";
import formatElapsedTime from "../lib/time";

export default function CommentList({
    comments,
    upvoteComment,
    isLoggedIn,
    postComment,
    parentID,
    fetchUserByID
}) {
  const [allComments, setAllComments] = useState(comments);
  const [pageNum, setPageNum] = useState(1);
  const [shownComments, setShownComments] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // input box to add a comment
  const [commentText, setCommentText] = useState("");

  const handleChange = (e) => {
    setCommentText(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setCommentSubmitted(true);
   await postComment(commentText,parentID);
    // addComment(cmnt)
  }

  // add comment to list of comments
  // const addComment = (comment) => {
  //   setAllComments([...allComments, comment]);
  // }

  // console.log(allComments)
  const nextPageNum = () => {
    if (pageNum < totalPages-2) {
      setPageNum(pageNum + 1);
    } else {
      setPageNum(1);
    }
  }

  const previousPageNum = () => {
    if (pageNum > 1) {
      setPageNum(pageNum - 1);
    } else {
      setPageNum(1);
    }
  }

  const splitComments = (comments) => {
    const split = [];
    for (let i = 0; i < comments.length; i += 3) {
      split.push(comments.slice(i, i + 3));
    }
    return split;
  }
  useEffect(()=>{
    setAllComments(comments)
  }, [comments])

  // use effect to set shown comments
  useEffect(() => {
    if (allComments === undefined) {
      return;
    }
    console.log(allComments)

    // split comments into pages of 3
    const split = splitComments(allComments);

    if (split.length >= pageNum) {
      setShownComments(split[pageNum - 1])
    }
    setTotalPages(allComments.length);
  }, [pageNum, allComments]);

  // console.log("shownComments", shownComments, "pageNum", pageNum, "totalPages", totalPages, "allComments", allComments)


  return (
    <div>
      {/* show 3 comments, with next button to show next 3 */}
      <h2>Comments</h2>
      {shownComments.map(comment => 
      <Comment key={comment._id} 
        comment={comment}     
        upvoteComment={upvoteComment}
        isLoggedIn={isLoggedIn} 
        fetchUserByID={fetchUserByID}
      />)}
      {/* input box to add a comment */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="comment">Add a comment:</label>
        <input type="text" id="comment" name="comment" value={commentText} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      {/* {commentSubmitted && <p>Comment submitted!</p>} */}
      <button onClick={nextPageNum}>Next</button>
      <button onClick={previousPageNum}>Previous</button>
    </div>
  )
}

function Comment({
    comment,
    upvoteComment,
    isLoggedIn,
    fetchUserByID,
}) {
  const [votes, setVotes] = useState(comment.upvoted_by.length)
  const user = fetchUserByID(comment.comment_by);
  const username = user === undefined ? "Anonymous" : user.username;
  const already_upvoted = comment.upvoted_by.includes(user._id)
  const className = already_upvoted && isLoggedIn ? "buttonStyle" : "buttonStyle disabledButton";

  const upvote = () => {
    setVotes(votes+1)
    upvoteComment(comment._id)
  }

  useEffect(()=>{
    setVotes(comment.upvoted_by.length)
  }, [comment])

  return (
    <div className="commentBox">
      <h1>{comment.text}</h1>
      <p>Commented by: {username}</p>
      <p>Commented {formatElapsedTime(comment.comment_date_time)}</p>
      <p>Votes: {votes}</p>
      <button className={className} onClick={upvote}>Upvote</button>
    </div>
  )
}