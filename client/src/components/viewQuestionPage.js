import '../stylesheets/MainPage.css';
import React from 'react';
import AnswerInfo from './question/answerInfo';
import ViewQuestionHeader from './headers/viewQuestionHeader';
import AnswerQuestionButton from './question/answerQuestionButton';
import VoteButtons from './headers/voteButtons';

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
    userData 
  }) {
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
                <AnswerInfo fetchUserByID={fetchUserByID} answers={answers} />
                <AnswerQuestionButton isLoggedIn={isLoggedIn} setAnswerQuestionPage={setAnswerQuestionPage} />
            </div>
        </div>
    );
}
