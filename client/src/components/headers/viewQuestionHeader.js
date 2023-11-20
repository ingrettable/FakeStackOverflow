import React from 'react';
import AskQuestionButton from '../question/askQuestionButton';
import UserInfo from '../block-metadata/userInfo';

export default function ViewQuestionHeader({ asked_by, time, answerCount, title, viewCount, text, setAskQuestionsPage }) {
  return (
    <div>
      <div className="viewQuestionHeader">
        <div className='viewQuestionSidebar'>
          <p>{answerCount} answers</p>
        </div>
        <h2>{title}</h2>
        <AskQuestionButton setAskQuestionsPage={setAskQuestionsPage} />
      </div>
      <div className="viewQuestionHeader">
        <div className='viewQuestionSidebar'>
          <p>{viewCount} views</p>
        </div>
        <div className="viewQuestionHeaderText">
          <p>{text}</p>
        </div>
        <UserInfo user={asked_by} time={time} />
      </div>

    </div>
  )
}