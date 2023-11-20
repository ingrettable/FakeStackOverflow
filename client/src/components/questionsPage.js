import React, { useState } from 'react';
import Question from './question/question'
import '../stylesheets/MainPage.css';
import SortButtonHeader from './question/sortButtons';
import formatElapsedTime from './lib/time';


export default function QuestionsPage({ questions, tags, answers, setPickedQuestion, resetFilter }) {
  const [sortBy, setSortBy] = useState('newest');
  const handleSortClick = (newSortBy) => {
    resetFilter();
    setSortBy(newSortBy);
  };

  var sortQuestions = questions
  //hi

  function getTagById(tagId) {
    return tags.find(tag => tag._id === tagId);
  }

  
  function getTagArray(question) {
    //console.log(question)

    const tags = question.tags.map(tagId => {
      const tag = getTagById(tagId);
      return tag ? tag.name : '';
    });
    return tags;
  }

  function getLatestDate(question) {
    let latestDate = null;
    for (const ansId of question.answers) {
      console.log("i am sorting")
      const answer = answers.find(ans => ans._id === ansId);
      if (answer && answer.ans_date_time > latestDate) {
        latestDate = answer.ans_date_time;
      }
    }
    console.log(latestDate);
    return latestDate;
  }

  function sortQuestionsByActivity(questions) {
    const copy = [...questions];
    copy.sort((a, b) => {
      const aActivityDate = getLatestDate(a);
      const bActivityDate = getLatestDate(b);

      if (aActivityDate === null) {
        return 1;
      }
      if (bActivityDate === null) {
        return -1;
      }

      if (aActivityDate > bActivityDate) {
        return -1;
      } else if (aActivityDate < bActivityDate) {
        return 1;
      } else {
        return 0;
      }
    });
    return copy;
  }

  function sortQuestionsByDate(questions) {
    const copy = [...questions];
    copy.sort(function (a, b) {
      if (a.ask_date_time > b.ask_date_time) {
        return -1;
      } else if (a.ask_date_time < b.ask_date_time) {
        return 1;
      } else {
        return 0;
      }
    });
    return copy;
  }

  function sortUnansweredQuestions(questions) {
    const unanswered = [];
    for (const question of questions) {
      if (question.answers.length === 0) {
        unanswered.push(question);
      }
    }
    return unanswered;
  }

  if (sortBy === 'activity') {
    sortQuestions = sortQuestionsByActivity(questions);
  } else if (sortBy === 'newest') {
    sortQuestions = sortQuestionsByDate(questions);
  } else if (sortBy === 'unanswered') {
    sortQuestions = sortUnansweredQuestions(questions);
  }

  return (
    <div>
      <SortButtonHeader questionCount={questions.length} handleSortClick={handleSortClick} sortBy={sortBy} />
      <div className="questionsList" id="questionsContainer">
        <div className="questionsList" id="questionsContainer">
          {sortQuestions.map((question) => {
            const tags = getTagArray(question);
            const time = formatElapsedTime(question.ask_date_time);
            const filtered_answers = answers.filter(answer => question.answers.includes(answer._id));
            const displayQuestionInfo = () => {
              setPickedQuestion({
                question,
                tags,
                time,
                'answers': filtered_answers
              })
            }
            return <Question key={question._id} question={question} tags={tags} time={time} displayQuestionInfo={displayQuestionInfo} />
          }
          )}
          {questions.length === 0 && <div className="noQuestions">
            <h1>No questions found.</h1></div>}
        </div>

      </div>
    </div>
  );
}
