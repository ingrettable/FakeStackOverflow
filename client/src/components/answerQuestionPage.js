import React, { useState } from 'react';
import ErrorPopup from './errors/errorPopup';

export default function AnswerQuestionPage({
  question,
  setAnswers,
  answers,
  setCurrentPage,
  addAnswerToQuestion,
  setPickedQuestion,
  pickQuestion,
  postAnswer,
  addAnswertoQuestionServer,
  userID
}) {
  // error: { id: 0, title: '', message: '' }
  const [errors, setErrors] = useState([]);
  // const [username, setUsername] = useState('');
  const [answerText, setAnswerText] = useState('');

  const handleText = (event) => {
    setAnswerText(event.target.value)
  }

  const getNextAnswerID = () => {
    if (answers.length === 0) {
      return 'a1';
    } else {
      return 'a' + (answers.length + 1);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    var returnErr = false;
    var localErr = [...errors];

    // if (username === "") {
    //   localErr = [...localErr, {
    //     id: localErr.length,
    //     title: 'Username Error',
    //     description: 'Please enter a username.'
    //   }]
    //   returnErr = true
    // }

    if (answerText === "") {
      localErr = ([...localErr, {
        id: localErr.length,
        title: 'Answer Text Error',
        description: 'Please enter an Answer Text.'
      }])
      returnErr = true
    }

    setErrors(localErr);

    if (returnErr) {
      return false;
    }


    const newAnswer = {
      text: answerText,
      ans_by: userID,
      ans_date_time: new Date()
    };

  
    try {
      // setUsername('');
      setAnswerText('');
      const response = await postAnswer(newAnswer);
      await addAnswertoQuestionServer(question._id, response._id)
      addAnswerToQuestion(question._id, response._id);
      console.log(response)
      setAnswers([...answers, response]);
      pickQuestion.question = question;
      pickQuestion.answers = [...pickQuestion.answers, response];
      setPickedQuestion(pickQuestion);
      setCurrentPage('viewQuestion');
    } catch (error) {
      console.error('Error posting answer:', error);
    }
  };

  return (
    <div className="answerQuestionForm">
      {
        errors.map(error => {
          return <ErrorPopup key={error.id} id={error.id} title={error.title} description={error.description} errors={errors} setErrors={setErrors} />
        })
      }

      <form id="askQuestionForm" action="#" method="post" onSubmit={handleFormSubmit}>
        {/* <label htmlFor="username">
          Username*
          <span className="hint"> (Case sensitive)</span>
        </label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /> */}

        <br />
        <br />
        <label htmlFor="answerText">Answer Text*</label>
        <textarea
          name="answerText"
          rows="4"
          cols="50"
          value={answerText}
          onChange={(e) => handleText(e)}
          required
        ></textarea>
        <br />
        <div className="postButtonDiv">
          <input onClick={handleFormSubmit} className="buttonStyle flex2" id="askQuestionPostBox" type="submit" value="Post Answer" />
          <div className="flex7"></div>
          <p className="flex3">* indicates a required field</p>
        </div>
      </form>
    </div>
  );
}
