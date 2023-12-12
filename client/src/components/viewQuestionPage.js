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
  }) {
    const [questionComments, setQuestionComments] = useState([]);
    const [commentsPassedIn, setCommentsPassedIn] = useState(comments);
    const [questionPassedIn, setQuestionPassedIn] = useState(question);

    const id = fetchUserByID(question.asked_by)
    const username = id === undefined ? "Anonymous" : id.username;
    // console.log("ID", id)  

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

    // loop thru comments that belong to question, put in array
    // console.log("questionx comments", question)


    useEffect(() => {
      // const filteredCmnts = commentsPassedIn.filter(comment => {
      //   const cmnts = questionPassedIn.comments.includes(comment._id)
      //   console.log("comments", cmnts, comment._id, question.comments)
      //   return cmnts
      // });
      const mappedCmnts = questionPassedIn.comments.map(comment => {
        return commentsPassedIn.find(cmnt => cmnt._id === comment);
      })
      // remove undefined
      const filteredMappedCmnts = mappedCmnts.filter(cmnt => cmnt !== undefined)
      console.log("mapped cmnts", filteredMappedCmnts)
      setQuestionComments(filteredMappedCmnts);
    }, [commentsPassedIn, questionPassedIn]);


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
                <CommentList parentID={question._id} fetchUserByID={fetchUserByID} comments={questionComments} upvoteComment={upvoteComment} isLoggedIn={isLoggedIn} postComment={postComment} />
                <AnswerInfo fetchUserByID={fetchUserByID} answers={answers} />
                <AnswerQuestionButton isLoggedIn={isLoggedIn} setAnswerQuestionPage={setAnswerQuestionPage} />
            </div>
        </div>
    );
}
