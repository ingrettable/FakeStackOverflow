import React, { useEffect, useState } from 'react';
import Question from './question/question'
import '../stylesheets/MainPage.css';
import SortButtonHeader from './question/sortButtons';
import formatElapsedTime from './lib/time';
import IterateListButtons from './question/iterateListButton';

export default function QuestionsPage({ questions, tags, answers, setPickedQuestion, resetFilter, fetchUserByID, getTagArray }) {
  const [sortBy, setSortBy] = useState('newest');
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [shownQuestions, setShownQuestions] = useState([]);
  const [sortQuestions, setSortQuestions] = useState([]); // array of arrays of length 5 [ [5 questions], [5 questions], ...

  const NextPageNum = () => {
    if (pageNum < totalPages) {
      setPageNum(pageNum + 1);
    } else {
      setPageNum(1);
    }
  }

  const PreviousPageNum = () => {
    if (pageNum > 1) {
      setPageNum(pageNum - 1);
    } else {
      setPageNum(1);
    }
  }

  // use effect for sorting
  useEffect(()=>{
    let sortedFullQuestions = [];
    if (sortBy === 'activity') {
      sortedFullQuestions = sortQuestionsByActivity(questions);
    } else if (sortBy === 'newest') {
      sortedFullQuestions = sortQuestionsByDate(questions);
    } else if (sortBy === 'unanswered') {
      sortedFullQuestions = sortUnansweredQuestions(questions);
    }
    const split = splitQuestions(sortedFullQuestions);
    setSortQuestions(split);
    setTotalPages(split.length);
    setPageNum(1);
  }, [sortBy, questions])

  useEffect(() => {
    // console.log("SortQuestions UseEffect", sortQuestions)
    if (sortQuestions === undefined) {
      return;
    }
    if (sortQuestions.length >= pageNum) {
      setShownQuestions(sortQuestions[pageNum - 1])
    }
    setTotalPages(sortQuestions.length);
  }, [pageNum, sortQuestions]);

  const handleSortClick = (newSortBy) => {
    resetFilter();
    setSortBy(newSortBy);
  };

  // var sortQuestions = questionArray[pageNum - 1];



  function getLatestDate(question) {
    // console.log("question:", question)
    // console.log("answers:", answers)
    let latestDate = null;
    if (question.answers.length === 0) {
      return question.ask_date_time;
    }
    for (const ansId of question.answers) {
      const answer = answers.find(ans => ans._id === ansId);
      latestDate = answer.ans_date_time;
    }
    return latestDate;
  }

  function sortQuestionsByActivity(questions) {
    const copy = [...questions];
    copy.sort((a, b) => {
      const aActivityDate = getLatestDate(a);
      const bActivityDate = getLatestDate(b);
      // console.log("activities:", aActivityDate, bActivityDate);

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
    // console.log(copy)
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

// split questions into array of arrays of length 5
const splitQuestions = (questions) => {
  // console.log("QUESTIONS", questions)
  const split = [];
  var i = 0;
  var temp_5 = [];
  for (const question of questions) {
    if (i < 5) {
      temp_5.push(question);
      i++;
    } else {
      split.push(temp_5);
      temp_5 = [question];
      i = 1;
    }
  }
  if (temp_5.length > 0) {
    split.push(temp_5);
  }
  // console.log("SPLIT:", split)
  return split;
}

  return (
    <div>
      <SortButtonHeader questionCount={questions.length} handleSortClick={handleSortClick} sortBy={sortBy} />
      <div className="questionsList" id="questionsContainer">
        <div className="questionsList" id="questionsContainer">
          {shownQuestions!==undefined && shownQuestions.map((question) => {
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
            // console.log("tags", tags)
            return <Question key={question._id} fetchUserByID={fetchUserByID} question={question} tags={tags} time={time} displayQuestionInfo={displayQuestionInfo} />
          }
          )}
          {questions.length === 0 && <div className="noQuestions">
            <h1>No questions found.</h1></div>}
        </div>
          <IterateListButtons isDisabled={pageNum === 1} handleNextClick={NextPageNum} handlePreviousClick={PreviousPageNum} />
      </div>
    </div>
  );
}
