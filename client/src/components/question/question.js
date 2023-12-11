import React, { useState, useEffect } from 'react';
import QuestionStats from '../block-metadata/questionStats';
import UserInfo from '../block-metadata/userInfo';
import { QuestionContent } from '../block-metadata/questionContent';

export default function Question({ question, tags, time, displayQuestionInfo, fetchUserByID }) {
  const id = fetchUserByID(question.asked_by)
  const username = id === undefined ? "Anonymous" : id.username;
  // console.log(tags)
  return (
        <div key={question._id}>
            {/* <hr className="dottedhr" /> */}
            <div className="questionContentContainer">
                <QuestionStats answerCount={question.answers.length} viewCount={question.views} />
                <QuestionContent _id={question._id} title={question.title} text={question.text} tags={tags} displayQuestionInfo={displayQuestionInfo} />
                <UserInfo user={username} time={time} />
            </div>
        </div>
    );
}