// export default function fakeStackOverflow() {
//   return (
//     <h1> Replace with relevant content </h1>
//   );
// }
import React, { useState, useEffect } from 'react';
import '../stylesheets/MainPage.css';
import QuestionsPage from './questionsPage';
import TagsPage from './tagsPage';
import AskQuestionPage from './askQuestionPage';
import ViewQuestionPage from './viewQuestionPage';
import TagHeader from './headers/tagheader';
import QuestionHeader from './headers/questionheader';
import SearchBar from './headers/searchBar';
import AnswerQuestionPage from './answerQuestionPage';
import AnswerInfo from './question/answerInfo';
import QuestionsByTagsHeader from './headers/questionsByTagHeader';
import SearchHeader from './headers/searchHeader';
import axios from 'axios';
import WelcomePage from './WelcomePage';
import ProfilePage from './ProfilePage';
import ProfileButton from './headers/profileButton';
import formatElapsedTime from './lib/time';
import EditQuestionPage from './edits/EditQuestion';

export default function FakeStackOverflow({ server, userData }) {
  //const [WelcomePage, setWelcomePage] = useState('questions');
  const [fullQuestions, setFullQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [answers, setAnswers] = useState([])
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState('questions');
  const [pickQuestion, setPickQuestion] = useState({});
  const [pickTag, setPickTag] = useState({});
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState({});
  const [reputation, setReputation] = useState(userData.reputation);

  // console.log("users", users)
  // useEffect(() => {
  //   // Redirect to the WelcomePage if the screen is refreshed
  //   if (currentPage === 'login') {
  //     setWelcomePage('login');
  //   }
  // }, [currentPage]);

  const modifyReputation = async (amount, userID) => {
    // console.log(userID)
    // setReputation(reputation + amount);
    // post request to update reputation
    await axios.put(`${server}/posts/users/${userID}`, { reputation: reputation + amount })
  }

  const upvoteQuestion = async (questionID, questionAuthor, upvoter) => {
    // modify reputation
    // console.log("Author", questionAuthor)
    await modifyReputation(5, questionAuthor);
    // check if user is in downvoted list by questionID
    const currentQuestion = fullQuestions.find(question => question._id === questionID);
    // console.log("before touch", currentQuestion)
    const downvoterIndex = currentQuestion.downvoted_by.indexOf(upvoter);
    if (downvoterIndex !== -1) {
      currentQuestion.downvoted_by.splice(downvoterIndex, 1);
      // return users reputation
      await modifyReputation(10, questionAuthor);
    }
    // console.log(upvoter)
    // exit if upvoter is already in upvoted_by list
    if (currentQuestion.upvoted_by.includes(upvoter)) {return}

    // add upvoter to question
    currentQuestion.upvoted_by.push(upvoter);

    // set question votes
    currentQuestion.votes = currentQuestion.upvoted_by.length - currentQuestion.downvoted_by.length;

    // update question
    await axios.put(`${server}/posts/questions/${questionID}`, { upvoted_by: currentQuestion.upvoted_by, downvoted_by: currentQuestion.downvoted_by });


    console.log("after touch", currentQuestion)
    // update questions
    const updatedQuestions = fullQuestions.map(question => {
      if (question._id === questionID) {
        // console.log("found")
        return currentQuestion;
      } else {
        return question;
      }
    })
    setFullQuestions(updatedQuestions);

   // update filtered questions
   const updatedFilterQuestions = filteredQuestions.map(question => {
    if (question._id === questionID) {
      // console.log("found")
      return currentQuestion;
    } else {
      return question;
    }
  })
  setFilteredQuestions(updatedFilterQuestions);
  }

  const downvoteQuestion = async (questionID, questionAuthor, downvoter) => {
    // modify reputation
    await modifyReputation(-10, questionAuthor);
    // check if user is in upvoted list by questionID
    const currentQuestion = fullQuestions.find(question => question._id === questionID);
    const upvoterIndex = currentQuestion.upvoted_by.indexOf(downvoter);
    if (upvoterIndex !== -1) {
      currentQuestion.upvoted_by.splice(upvoterIndex, 1);
      // return users reputation
      await modifyReputation(-5, questionAuthor);
    }
    // exit if downvoter is already in upvoted_by list
    if (currentQuestion.downvoted_by.includes(downvoter)) {return}

    // add downvoter to question
    currentQuestion.downvoted_by.push(downvoter);

    // set question votes
    currentQuestion.votes = currentQuestion.upvoted_by.length - currentQuestion.downvoted_by.length;
    // update question
    await axios.put(`${server}/posts/questions/${questionID}`, { upvoted_by: currentQuestion.upvoted_by, downvoted_by: currentQuestion.downvoted_by });

    // update full questions
    const updatedFullQuestions = fullQuestions.map(question => {
      if (question._id === questionID) {
        return currentQuestion;
      } else {
        return question;
      }
    })
    setFullQuestions(updatedFullQuestions);

    // update filtered questions
    const updatedFilterQuestions = filteredQuestions.map(question => {
      if (question._id === questionID) {
        // console.log("found")
        return currentQuestion;
      } else {
        return question;
      }
    })
    setFilteredQuestions(updatedFilterQuestions);
  }

  // fetch questions
  const [qCount, setQcount] = useState(0);
  const qCountPP = () => setQcount(qCount + 1)
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${server}/posts/questions`);
        // console.log(response.data)
        setFullQuestions(response.data);
        setFilteredQuestions(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchQuestions();
  }, [])

  // fetch answers
  const [aCount, setAcount] = useState(0);
  const aCountPP = () => setAcount(aCount + 1)
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await axios.get(`${server}/posts/answers`);
        setAnswers(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAnswers();
  }, [])

  // fetch tags
  const [tCount, setTcount] = useState(0);
  const tCountPP = () => setTcount(tCount + 1)
  useEffect(() => { // grab data from server
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${server}/posts/tags`);
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchTags();
  }, []);

    // fetch users
    useEffect(() => { // grab data from server
      const fetchUsers = async () => {
        try {
          const response = await axios.get(`${server}/posts/users`);
          setUsers(response.data);
          // console.log(response.data)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchUsers();
    }, []);
  
  async function postQuestion(newQuestion) {
    try {
      const response = await axios.post(`${server}/posts/questions`, newQuestion);
      console.log('Question posted successfully:', response.data);
      const updatedQuestions = [response.data, ...fullQuestions];
      setFullQuestions(updatedQuestions);
      setFilteredQuestions(updatedQuestions)
    } catch (error) {
      console.error('Error posting question:', error);
    }
    tCountPP();
    qCountPP();
  }

  async function postTag(newTagData) {
    try {
      console.log(newTagData)
      const response = await axios.post(`${server}/posts/tags`, newTagData);
      console.log('Tag posted successfully:', response.data);
      const getAllNewTags = await axios.get(`${server}/posts/tags`);
      setTags(getAllNewTags.data);
      return response.data;
    } catch (error) {
      console.error('Error posting tag:', error);
    }
    tCountPP();
  }

  async function postAnswer(newAnswerData) {
    try {
      const response = await axios.post(`${server}/posts/answers`, newAnswerData);
      console.log('Answer posted successfully:', response.data);
      const updatedAnswers = [response.data, ...answers];
      setAnswers(updatedAnswers)
      // addAnswerToQuestion(question, newAnswerData._id);
      return response.data
    } catch (error) {
      console.error('Error posting answer:', error);
    }
    aCountPP();
  }

  async function addAnswertoQuestionServer(questionID, answerID) {
    try {
      console.log(questionID)
      console.log(answerID)
      const response = await axios.put(`${server}/posts/questions/${questionID}`, { answerID });
      console.log('Answer added to question successfully:', response.data);
    } catch (error) {
      console.error('Error adding answer to question on server:', error);
    }
    qCountPP();
  }

  async function updateQuestion(questionID, views) {
    try {
      const response = await axios.put(`${server}/posts/questions/${questionID}`, { views });
      console.log('Question updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating question views:', error);
    }
    qCountPP();
  }

  const setPickedSearch = () => {
    setSearch();
    setCurrentPage("search");
  }

  const findTagByID = (_id) => {
    return tags.find(tag => tag._id === _id);
  }

  const resetFilter = () => {
    setFilteredQuestions(fullQuestions);
  }

  const createTags = async (tagNames) => {
    var tids = []
    var tagArr = tags
    var tenCharBroken = false
    for (const tagName of tagNames) {
      // tagNames.forEach(async (tagName) => {
      if (tagName.trim() === "") {
        continue
      }
      console.log(tagArr);
      if (tagName.trim().length > 10) {
        tenCharBroken = true;
        continue
      } else if (tagArr.find(tag => tag.name === tagName.trim())) {
        const newTag = tagArr.find(tag => tag.name === tagName.trim());
        console.log(newTag)
        tids = [...tids, newTag._id];
      } else {
        const newTag = await postTag({
          name: tagName.trim(),
          creator: userData.userID
        });
        console.log(newTag)
        console.log(newTag._id)
        tids = [...tids, newTag._id];
        tagArr = [...tagArr, newTag];
        console.log(tids)
      }
    }
    if (tenCharBroken) {
      return false
    }
    console.log(tids)
    if (tagArr.length < 6) {
      setTags([...tags, ...tagArr]);
    }
    return tids;
  }

  const addAnswerToQuestion = (qid, aid) => {
    // get question by id
    const updateQuestion = fullQuestions.find(question => question._id === qid);
    // add answer id to question
    updateQuestion.answers.push(aid);
    console.log(updateQuestion)
    // update questions
    const updatedQuestions = fullQuestions.map(question => {
      if (question._id === qid) {
        return updateQuestion;
      } else {
        return question;
      }
    });
    setFullQuestions(updatedQuestions);
  };

  const setQuestions = (questions) => {
    setFullQuestions(questions);
    setFilteredQuestions(questions);
  }


  const setQuestionsPage = () => {
    setCurrentPage("questions")
    setFilteredQuestions(fullQuestions);
  };

  const setTagsPage = () => {
    setCurrentPage("tags")
  }

  const setAskQuestionsPage = () => {
    setCurrentPage("askQuestion");
  };

  // pick question by id number
  const setPickedQuestionByID = (questionID, pageAfter) => {
    const question = fullQuestions.find(question =>
      question._id === questionID
    )
    const tags = getTagArray(question);
    const time = formatElapsedTime(question.ask_date_time);
    const filtered_answers = answers.filter(answer => question.answers.includes(answer._id));
    setPickedQuestion({
      question,
      tags,
      time,
      'answers': filtered_answers
    })
   setCurrentPage(pageAfter)
  }

  function getTagById(tagId) {
    return tags.find(tag => tag._id === tagId);
  }

  function getAnswerByID(answerID) {
    return answers.find(answer => answer._id === answerID);
  }

  function getTagArray(question) {
    //console.log(question)
    const tags = question.tags.map(tagId => {
      const tag = getTagById(tagId);
      // return tag.name if tag exists, else return empty string
      // check if tag is undefined or null
      if (tag === undefined || tag === null) {
        return '';
      }
      return tag.name
    });
    return tags;
  }

  const setPickedQuestion = (questionInfo) => {
    const question = fullQuestions.find(question =>
      question._id === questionInfo.question._id
    )
    question.views++;
    // real sees real
    const filteredFullQ = fullQuestions.filter(question => question._id !== questionInfo.question._id)
    setFullQuestions([...filteredFullQ, question])

    setPickQuestion(questionInfo)
    updateQuestion(question._id, question.views)
    setCurrentPage("viewQuestion");
  };

  // make sure u pass in entire tag object
  const setPickedTag = (tag) => {
    setPickTag(tag)
    setFilteredQuestions(
      fullQuestions.filter((question) =>
        question.tags.includes(tag._id)
      )
    )
    setCurrentPage("questionsByTag");
  };

  const deleteUserByID = async (userID) => {
    try {
      const response = await axios.delete(`${server}/posts/users/${userID}`);
      console.log('User deleted successfully:', response.data);
      const updatedUsers = users.filter(user => user._id !== userID);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  const putQuestion = async (questionID, newQuestion) => {
    try {
      const response = await axios.put(`${server}/posts/questions/${questionID}`, newQuestion);
      console.log('PUT Question updated successfully:', response.data);
      const updatedQuestions = fullQuestions.map(question => {
        if (question._id === questionID) {
          console.log("rplaced q id", questionID)
          return response.data;
        } else {
          return question;
        }
      })
      setFullQuestions(updatedQuestions);
      setFilteredQuestions(updatedQuestions);
      // set current page
      setCurrentPage("questions");
    } catch (error) {
      console.error('Error updating question:', error);
    }
  }

  // delete question by id
  const  deleteQuestion = async (questionID) => {
    try {
      const response = await axios.delete(`${server}/posts/questions/${questionID}`);
      console.log('Question deleted successfully:', response.data);
      const updatedQuestions = fullQuestions.filter(question => question._id !== questionID);
      setFullQuestions(updatedQuestions);
      setFilteredQuestions(updatedQuestions);

      // switch current page
      setCurrentPage("questions");
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  }

  // const [userData, setUserData] = useState({});
  // const [userQuestions, setUserQuestions] = useState([]);
  // const [userTags, setUserTags] = useState([]);
  // const [userAnswers, setUserAnswers] = useState([]);

  // const fetchUserData = async () => {
  //   try {
  //     const userResponse = await axios.get(`/api/users/${userId}`);
  //     setUserData(userResponse.data);

  //     const questionsResponse = await axios.get(`/api/users/${userId}/questions`);
  //     setUserQuestions(questionsResponse.data);

  //     const tagsResponse = await axios.get(`/api/users/${userId}/tags`);
  //     setUserTags(tagsResponse.data);

  //     const answersResponse = await axios.get(`/api/users/${userId}/answers`);
  //     setUserAnswers(answersResponse.data);
  //   } catch (error) {
  //     console.error('Error fetching user data:', error);
  //   }
  // };
  const getUserByID = (_id) => {
    return users.find(user => user._id === _id);
  }

  return (
    <div className="page">
      <div className="head">
        <ProfileButton isLoggedIn={userData.isLoggedIn} setProfilePage={() => setCurrentPage("profile")} />
        <div className="headerTitle">
          <h1>🧚‍♀️✨Fake Stack Overflow🧚‍♀️✨</h1>
        </div>
        <SearchBar setPickedSearch={setPickedSearch} findTagByID={findTagByID} setQuestions={setFilteredQuestions} questions={fullQuestions} />
      </div>


      <div id="sideBar" className="sideBar">
        <div id="questionsDiv" className={`sideBarAnchor ${currentPage === 'questions' ? 'sideBarAnchorSelected' : ''}`}>
          <a onClick={setQuestionsPage} href="#Questions">Questions</a>
        </div>
        <div id="tagsDiv" className={`sideBarAnchor ${currentPage === 'tags' ? 'sideBarAnchorSelected' : ''}`}>
          <a onClick={setTagsPage} href="#Tags" id="tagsLink">Tags</a>
        </div>
      </div>

      <div className="mainContent">
        {/* {(currentPage === 'welcome') && <WelcomePage setWelcomePage={setCurrentPage} />} */}
        {(currentPage === "questions") && <QuestionHeader 
            isLoggedIn={userData.isLoggedIn} 
            resetFilter={resetFilter} 
            setAskQuestionsPage={setAskQuestionsPage} 
        />}
        {(currentPage === "search") && <SearchHeader isLoggedIn={userData.isLoggedIn} />}
        {(currentPage === "search") && <QuestionsPage 
            questions={filteredQuestions} 
            tags={tags} answers={answers} 
            setPickedQuestion={setPickedQuestion} 
        />}
        {(currentPage === "tags") && <TagHeader 
            tags={tags} 
            isLoggedIn={userData.isLoggedIn}
            setAskQuestionsPage={setAskQuestionsPage}
        />}
        {(currentPage === "questionsByTag") && <QuestionsByTagsHeader 
            tagName={pickTag}
            isLoggedIn={userData.isLoggedIn} 
            setAskQuestionsPage={setAskQuestionsPage} 
        />}
        {(currentPage === "questionsByTag") && <QuestionsPage 
            questions={filteredQuestions} 
            tags={tags} 
            answers={answers} 
            setPickedQuestion={setPickedQuestion} 
        />}
        {(currentPage === "questions") && <QuestionsPage 
            resetFilter={resetFilter} 
            questions={filteredQuestions} 
            fetchUserByID={getUserByID}
            tags={tags} answers={answers} 
            setPickedQuestion={setPickedQuestion} 
            getTagArray={getTagArray}
        />}
        {(currentPage === "tags") && <TagsPage 
            setPickedTag={setPickedTag} 
            questions={fullQuestions} 
            tags={tags} 
        />}
        {(currentPage === "askQuestion") && <AskQuestionPage
          setQuestions={setQuestions}
          questions={fullQuestions}
          setPage={setCurrentPage}
          createTags={createTags}
          postQuestion={postQuestion}
          server={server}
          postTag={postTag}
          userID={userData.userID}
        />
        }
        {(currentPage === "viewQuestion") && <ViewQuestionPage 
              isLoggedIn={userData.isLoggedIn} 
              setCurrentPage={setCurrentPage}
              question={pickQuestion.question} 
              answers={pickQuestion.answers} 
              time={pickQuestion.time} 
              tags={pickQuestion.tags}
              fetchUserByID={getUserByID}
              handleUpvote={upvoteQuestion}
              handleDownvote={downvoteQuestion}
              userData={userData}
        />}
        {(currentPage === "answerQuestion") && 
          <AnswerInfo
            fetchUserByID={getUserByID} 
            answers={answers} 
          /> 
          && 
          <AnswerQuestionPage 
            userID={userData.userID} 
            addAnswertoQuestionServer={addAnswertoQuestionServer} 
            postAnswer={postAnswer} 
            setPickedQuestion={setPickedQuestion} 
            pickQuestion={pickQuestion} 
            addAnswerToQuestion={addAnswerToQuestion} 
            question={pickQuestion.question} 
            answers={answers} setAnswers={setAnswers} 
            setCurrentPage={setCurrentPage}
          />}
        {(currentPage === "profile") && <ProfilePage 
          questions={fullQuestions} 
          answers={answers} 
          comments={[]} 
          users={users}
          tags={tags}
          userData={userData}
          deleteUserByID={deleteUserByID}
          setCurrentPage={setCurrentPage}
          setPickedQuestionByID={setPickedQuestionByID}
          getAnswerByID={getAnswerByID}
        /> }
        {/* edit question page */}
        {(currentPage === "editQuestion") && <EditQuestionPage
          setQuestions={setQuestions}
          questions={fullQuestions}
          setPage={setCurrentPage}
          createTags={createTags}
          putQuestion={putQuestion}
          deleteQuestion={deleteQuestion}
          server={server}
          postTag={postTag}
          userID={userData.userID}
          // edit q specific info
          currentTitle={pickQuestion.question.title}
          currentText={pickQuestion.question.text}
          currentTags={pickQuestion.tags}
          currentQuestionID={pickQuestion.question._id}
        />}

      </div>
    </div>
  );
}