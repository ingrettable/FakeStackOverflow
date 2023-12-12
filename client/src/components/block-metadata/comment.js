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
    fetchUserByID,
    // getParentByID,
    getCommentByID,
    addCommentID,
}) {
  const [pageNum, setPageNum] = useState(1);
  const [shownComments, setShownComments] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // input box to add a comment
  const [commentText, setCommentText] = useState("");
  const [updateShownComments, setUpdateShownComments] = useState(1);

  const handleChange = (e) => {
    setCommentText(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCommentText("");
    // setCommentSubmitted(true);
   const commnt = await postComment(commentText, parentID);
   console.log("cmnt", commnt)
   addCommentID(commnt._id)
   setUpdateShownComments(updateShownComments+1)
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
  // useEffect(()=>{
  //   setAllComments(comments)
  // }, [comments])

  // use effect to set shown comments
  useEffect(() => {
    // const cmnts = getCommentsFromParent()
    // setAllComments(cmnts)

    if (comments === undefined) {
      return;
    }

    // console.log("comments", comments)

    // convert all comments from id to comment object
    const mappedCmnts = comments.map(commentID => getCommentByID(commentID));

    // console.log(allComments)
    // split comments into pages of 3
    const split = splitComments(mappedCmnts);

    if (split.length >= pageNum) {
      setShownComments(split[pageNum - 1])
    }
    setTotalPages(mappedCmnts.length);
  }, [pageNum, updateShownComments]);

  // console.log("shownComments", shownComments, "pageNum", pageNum, "totalPages", totalPages, "allComments", allComments)


  return (
    <div>
      {/* show 3 comments, with next button to show next 3 */}
      <h2>Comments</h2>
      {/* {comments.map(comment => <p>{comment}</p>)} */}

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
        <button className="buttonStyle" type="submit">Submit</button>
      </form>
      <button className="buttonStyle" onClick={nextPageNum}>Next</button>
      <button className="buttonStyle" onClick={previousPageNum}>Previous</button>
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
  const [alreadyUpvoted, setAlreadyUpvoted] = useState(false)
  const username = user === undefined ? "Anonymous" : user.username;
  const className = !alreadyUpvoted && isLoggedIn ? "buttonStyle" : "buttonStyle disabledButton";

  useEffect(()=>{
    if (user === undefined || user === null) {
      return;
    }
    if (comment === undefined || comment === null) {
      return;
    }
    setAlreadyUpvoted(comment.upvoted_by.includes(user._id))
  }, [])

  const upvote = () => {
    setVotes(votes+1)
    upvoteComment(comment._id)
    setAlreadyUpvoted(true)
  }

  useEffect(()=>{
    setVotes(comment.upvoted_by.length)
    // console.log(comment)
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