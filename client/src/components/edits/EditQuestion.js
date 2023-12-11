import React, { useState } from "react";
import ErrorPopup from "../errors/errorPopup";

export default function EditQuestionPage({ 
  setQuestions, 
  questions, 
  setPage, 
  createTags, 
  server, 
  putQuestion, 
  deleteQuestion,
  postTag, 
  userID,
  // new stuff
  currentTitle,
  currentText,
  currentTags,
  currentQuestionID,
}) {
  // error: { id: 0, title: '', message: '' }

  // join current tags array by space
  const currentTagsString = currentTags.join(" ");

  const [errors, setErrors] = useState([]);
  const [title, setTitle] = useState(currentTitle);
  const [text, setText] = useState(currentText);
  const [tags, setTags] = useState(currentTagsString);
  // const [username, setUsername] = useState("");

  const handleTitle = (event) => {
    if (event.target.value.length <= 100) {
      setTitle(event.target.value);
    }
  }

  const handleText = (event) => {
    setText(event.target.value)
  }

  const handleTags = (event) => {
    setTags(event.target.value);
  }

  // const handleUsername = (event) => {
  //   setUsername(event.target.value);
  // }

  const handleSubmit = async (event) => {
    event.preventDefault();
    let isInvalid = false;
    var localErr = [...errors];
    // if (username === "") {
    //   localErr = [...localErr, {
    //     id: localErr.length,
    //     title: 'Username Error',
    //     description: 'Please enter a username.'
    //   }]
    //   isInvalid = true;
    // }
    if (title === "") {
      localErr = [...localErr, {
        id: localErr.length,
        title: 'Title Error',
        description: 'Please enter a title.'
      }]
      isInvalid = true;
    }
    if (text === "") {
      localErr = [...localErr, {
        id: localErr.length,
        title: 'Text Error',
        description: 'Please enter text.'
      }]
      isInvalid = true;
    }
    if (tags === "") {
      localErr = [...localErr, {
        id: localErr.length,
        title: 'Tags Error',
        description: 'Please enter tags.'
      }]
      isInvalid = true;
    }
    console.log("tags", tags)
  
    const tagsSet = new Set(tags.toLowerCase().split(" "));
    console.log(tagsSet, tagsSet.size);
    if (tagsSet.size > 5) {
      localErr = [...localErr, {
        id: localErr.length,
        title: 'Tags Error',
        description: 'Please enter at most 5 tags.'
      }]
      isInvalid = true;
    }
    
  
    const tids = await createTags(tagsSet);
    if (tids === false) {
      localErr = [...localErr, {
        id: localErr.length,
        title: 'Tags Error',
        description: 'Tags are greater than 10 characters.'
      }]
      isInvalid = true;
    }
  
    if (isInvalid) {
      setErrors(localErr);
      return false;
    }
    
    const newQuestion = {
      title: title,
      text: text,
      tags: tids,
    };
    
    try {
      //setQuestions([...questions, newQuestion]);
      setTitle("");
      setText("");
      setTags("");
      // setUsername("");
      setPage("questions");
      console.log(tids);
      // const tag = await postTag(newTags)
      // console.log(tag)

      //console.log(questions);
      await putQuestion(currentQuestionID, newQuestion);
    } catch (error) {
      console.error('Error posting question:', error);
    }
  }
  

  return (
    <div className="answerQuestionForm">
      {errors.map((error) => {
        return (
          <ErrorPopup
            key={error.id}
            id={error.id}
            title={error.title}
            description={error.description}
            setErrors={setErrors}
            errors={errors}
          />
        );
      }
      )}
      <form id="askQuestionForm" action="#" method="post">
        <label htmlFor="questionTitle">
          Question Title*
          <span className="hint"> (Limit title to 100 chars or less)</span>
        </label>
        <input type="text"
          id="questionTitle"
          name="questionTitle"
          value={title}
          onChange={handleTitle}
          required />
        <br />
        <br />

        <label htmlFor="questionText">
          Question Text*
          <span className="hint"> (Explain yourself)</span>
        </label>
        <textarea id="questionText"
          name="questionText"
          rows="4"
          cols="50"
          value={text}
          onChange={handleText}
          required></textarea>
        <br />

        <label htmlFor="questionTags">
          Tags*
          <span className="hint"> (Whitespace-seperated keywords)</span>
        </label>
        <input type="text"
          id="questionTags"
          name="questionTags"
          value={tags}
          onChange={handleTags}
        />
        <br />

        {/* <label htmlFor="questionUsername">Username*</label>
        <input type="text"
          id="questionUsername"
          name="questionUsername"
          value={username}
          onChange={handleUsername}
          required />
        <br /> */}

        <div className="postButtonDiv">
          <input className="buttonStyle flex2" id="askQuestionPostBox" type="submit" value="Update Question" onClick={handleSubmit} />
          <div className="flex7"></div>
          <p className="flex3">* indicates a required field</p>
        </div>
      </form>
      <button className="buttonStyle flex2" onClick={() => deleteQuestion(currentQuestionID)}>Delete Question</button>
    </div>
  );
}
