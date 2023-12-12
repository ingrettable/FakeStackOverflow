import '../stylesheets/MainPage.css';
import React from 'react';
import { useState, useEffect } from 'react';
import AnswerInfo from './question/answerInfo';
import ViewQuestionHeader from './headers/viewQuestionHeader';
import AnswerQuestionButton from './question/answerQuestionButton';
import VoteButtons from './headers/voteButtons';
import CommentList from './block-metadata/comment';

export default function ViewQuestion({ 
    question, 
    handleUpvote,
    handleDownvote,
    answers, 
    time, 
    tags, 
    setCurrentPage, 
    isLoggedIn, 
    fetchUserByID, 
    userData,
    // comment stuff
    comments,
    upvoteComment,
    postComment,
    getCommentByID,
    getQuestionByID,
  }) {
    const id = fetchUserByID(question.asked_by)
    const username = id === undefined ? "Anonymous" : id.username;
    // console.log("ID", id)  

    const [renderComments, setRenderComments] = useState(question.comments);

    const addCommentID = (id) => {
      console.log("addCommentID", id, renderComments)
      setRenderComments([id, ...renderComments]);
    }

    // useEffect(() => {
    //   // get updated question
    //   const parent = getQuestionByID(question._id);
    //   // get comments 
    //   const mappedCmnts = parent.comments.map(comment => {
    //     return comments.find(cmnt => cmnt._id === comment);
    //   })
    //   // remove undefined
    //   // const filteredMappedCmnts = mappedCmnts.filter(cmnt => cmnt !== undefined)
    //   setRenderComments(mappedCmnts);
    // }, [])


    const setAskQuestionsPage = () => {
        setCurrentPage("askQuestion");
    }

    const setAnswerQuestionPage = () => {
        setCurrentPage("answerQuestion");
    }

    const setUpvote = () => {
      handleUpvote(question._id, question.asked_by, userData.userID);
    }

    const setDownvote = () => {
      handleDownvote(question._id, question.asked_by, userData.userID);
    }

    return (
        <div>
            <div>
                <div key={question._id}>
                    <ViewQuestionHeader isLoggedIn={isLoggedIn} asked_by={username} time={time} title={question.title} text={question.text} answerCount={question.answers.length} viewCount={question.views} setAskQuestionsPage={setAskQuestionsPage} />
                    <VoteButtons 
                      userData={userData}
                      handleUpvote={setUpvote} 
                      handleDownvote={setDownvote} 
                      voteCount={question.votes}
                      upvoted_by={question.upvoted_by}
                      downvoted_by={question.downvoted_by}
                    />
                </div>
                <CommentList 
                    parentID={question._id} 
                    fetchUserByID={fetchUserByID} 
                    getParentByID={getQuestionByID} 
                    comments={renderComments} 
                    upvoteComment={upvoteComment} 
                    isLoggedIn={isLoggedIn} 
                    postComment={postComment} 
                    addCommentID={addCommentID}
                    getCommentByID={getCommentByID}
                    />
                <AnswerInfo 
                  fetchUserByID={fetchUserByID} 
                  answers={answers}
                  
                  upvoteComment={upvoteComment}
                  isLoggedIn={isLoggedIn}
                  postComment={postComment}
                  getCommentByID={getCommentByID}      
                  />
                <AnswerQuestionButton 
                  isLoggedIn={isLoggedIn} 
                  setAnswerQuestionPage={setAnswerQuestionPage}
                   />
            </div>
        </div>
    );
}
