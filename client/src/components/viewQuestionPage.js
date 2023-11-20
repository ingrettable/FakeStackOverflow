import '../stylesheets/MainPage.css';
import React from 'react';
import AnswerInfo from './question/answerInfo';
import ViewQuestionHeader from './headers/viewQuestionHeader';
import AnswerQuestionButton from './question/answerQuestionButton';

export default function ViewQuestion({ question, answers, time, tags, setCurrentPage }) {

    const setAskQuestionsPage = () => {
        setCurrentPage("askQuestion");
    };

    const setAnswerQuestionPage = () => {
        setCurrentPage("answerQuestion");
    }

    return (
        <div>
            <div>
                <div key={question._id}>
                    <ViewQuestionHeader asked_by={question.asked_by} time={time} title={question.title} text={question.text} answerCount={question.answers.length} viewCount={question.views} setAskQuestionsPage={setAskQuestionsPage} />
                </div>
                <AnswerInfo answers={answers} />
                <AnswerQuestionButton setAnswerQuestionPage={setAnswerQuestionPage} />
            </div>
        </div>
    );
}
