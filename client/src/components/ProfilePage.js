// create a profile page for the user that displays their username, email, and a list of their questions and answers

import React, { useState, useEffect } from 'react';
import DeleteButton from './headers/deleteButton';
import formatElapsedTime from './lib/time';

export default function ProfilePage({ 
  questions, 
  answers, 
  comments, 
  tags,
  userData, 
  users,
  deleteUserByID,
  setPickedQuestionByID,
  getAnswerByID,
  setCurrentPage,
  editTagByID,
  deleteTagByID
 }) { 
  // filter questions by user id
  const [userQuestions, setUserQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [userTags, setUserTags] = useState([]);
  // console.log("Profile Page", userData, questions, answers, comments);

  useEffect(() => {
    const filteredQuestions = questions.filter(question => question.asked_by === userData.userID);
    setUserQuestions(filteredQuestions);
  }, [questions, userData]);

  useEffect(() => {
    // search thru the answers of every question to see if the answer was written by the user
    const filteredAnswers = questions.filter(question => question.answers.some(answer => {
      const answerObj = getAnswerByID(answer);
      return answerObj.ans_by === userData.userID
    }));

    // const filteredAnswers = answers.filter(answer => answer.ans_by === userData.userID);
    setUserAnswers(filteredAnswers);
  }, [answers, userData]);

  useEffect(() => {
    // search thru tags to see if the tag was written by the user
    const filteredTags = tags.filter(tag => tag.creator === userData.userID);
    setUserTags(filteredTags);
  },[])

  useEffect(() => {
    const filteredComments = comments.filter(comment => comment.commented_by === userData.userID);
    setUserComments(filteredComments);
  }, [comments, userData]);

  // display reputation points and date joined:
  const [dateJoined, setDateJoined] = useState(formatElapsedTime(userData.dateJoined));
  const [reputationPoints, setReputationPoints] = useState(userData.reputation);

  return (
    <div>
      <h1>Profile Page</h1>
      <h2>Username: {userData.user}</h2>
      <h2>Email: {userData.email}</h2>
      <h2>Date Joined: {dateJoined}</h2>
      <h2>Reputation: {reputationPoints}</h2>
      <DisplayAdmin 
        users={users} 
        admin={userData.is_admin}
        deleteUserByID={deleteUserByID}
      />
      <DisplayMap  // display questions
          title="Questions" 
          mapper={userQuestions}
          funct={setPickedQuestionByID} 
          pageAfter={"editQuestion"}
      />
      <DisplayMap  // display answers
          title="Answers" 
          mapper={userAnswers} 
          funct={setPickedQuestionByID}
          pageAfter={"viewQuestion"}
      />
      <DisplayTags  // display tags
          tags={userTags} 
          deleteTagByID={deleteTagByID}
          editTagByID={editTagByID}
      />
      <DisplayMap  // display comments
          title="Comments" 
          mapper={userComments} 
      />
    </div> 
  )
}

function DisplayMap({title, mapper, funct, pageAfter}) {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {mapper.map(item => {
          return (
            <li key={item._id}>
              <a href='#' onClick={() => funct(item._id, pageAfter)} >{item.title}</a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function DisplayTags({tags, deleteTagByID, editTagByID}) {
  return (
    <div>
      <h2>Tags</h2>
      <ul>
        {tags.map(tag => <TagEditBox key={tag._id} tag={tag} editTagByID={editTagByID} deleteTagByID={deleteTagByID} />)}
      </ul>
    </div>)
}

function TagEditBox({tag, editTagByID, deleteTagByID}) {
  const [newTag, setNewTag] = useState(tag.name);
  const [toggle, setToggle] = useState(false);
  return (
    <li key={tag._id}>
      <h2>{tag.name}</h2>
      <button className='buttonStyle' onClick={() => deleteTagByID(tag._id)} >Edit</button>
      <button className='buttonStyle' onClick={() => setToggle(!toggle)} >Edit</button>
      {/* make a text box that displays when user clicks edit. */}
      {toggle && <input type="text" value={newTag} onChange={e => setNewTag(e.target.value)} />}
      {toggle && <button className='buttonStyle' onClick={() => editTagByID(tag._id, newTag)} >Submit</button>}
    </li>
  )
}


function DisplayAdmin({
  admin, 
  users, 
  deleteUserByID
}) {
  const [toggle, setToggle] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const setFalseAndDelete = (id) => {
    deleteUserByID(id)
    setShowBox(false);
  }
  if (admin) {
    return (
      <div>
        <h2>You Are An Admin User</h2>
      {/* display list of all users with a button to delete them */}
      <button className='buttonStyle' onClick={()=>setToggle(!toggle)}>{toggle ? "Hide Users" : "Show Users"}</button>
      <h2>All Users</h2>
      <ul>
        {toggle && users.map(user => {
          return (
            <li key={user._id}>
              <h3>{user.username}</h3>
              <p>{user.email}</p>
              {/* delete button */}
              <DeleteButton funct={()=>setShowBox(true)} />
              {showBox && <ConfirmDeleteUser funct={()=>setFalseAndDelete(user._id)} setShowBox={setShowBox} />}
            </li>
          )
        })} 
        {users.length === 0 && <h3>No Users</h3>}
      </ul>
      </div>
    )
  }
  return null;
}

// confirmation box for deleting user. should be styled like a modal
function ConfirmDeleteUser({
  funct,
  setShowBox
}) {
  const yesButton = () => {
    funct();
    setShowBox(false);
  }

  return (
    <div>
      {/* make this a modal */}
      <h2>Are you sure you want to delete this user?</h2>
      <button className='buttonStyle' onClick={yesButton}>Yes</button>
      <button className='buttonStyle' onClick={()=>setShowBox(false)}>No</button>
    </div>
  )
}