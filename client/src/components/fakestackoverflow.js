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

export default function FakeStackOverflow({ server }) {
  //const [WelcomePage, setWelcomePage] = useState('questions');
  const [fullQuestions, setFullQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [answers, setAnswers] = useState([])
  const [currentPage, setCurrentPage] = useState('questions');
  const [pickQuestion, setPickQuestion] = useState({});
  const [pickTag, setPickTag] = useState({});
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState({});

  // useEffect(() => {
  //   // Redirect to the WelcomePage if the screen is refreshed
  //   if (currentPage === 'login') {
  //     setWelcomePage('login');
  //   }
  // }, [currentPage]);

  // fetch questions
  const [qCount, setQcount] = useState(0);
  const qCountPP = () => setQcount(qCount + 1)
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${server}/posts/questions`);
        console.log(response.data)
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
  const aCountPP = () => setQcount(aCount + 1)
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
  const tCountPP = () => setQcount(tCount + 1)
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
          name: tagName.trim()
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

  return (
    <div className="page">
      <div className="head">
        <div className="profile">
        <button className="buttonStyle">
          Profile </button>
        </div>
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
        {(currentPage === "questions") && <QuestionHeader resetFilter={resetFilter} setAskQuestionsPage={setAskQuestionsPage} />}
        {(currentPage === "search") && <SearchHeader />}
        {(currentPage === "search") && <QuestionsPage questions={filteredQuestions} tags={tags} answers={answers} setPickedQuestion={setPickedQuestion} />}
        {(currentPage === "tags") && <TagHeader tags={tags} setAskQuestionsPage={setAskQuestionsPage} />}
        {(currentPage === "questionsByTag") && <QuestionsByTagsHeader tagName={pickTag} setAskQuestionsPage={setAskQuestionsPage} />}
        {(currentPage === "questionsByTag") && <QuestionsPage questions={filteredQuestions} tags={tags} answers={answers} setPickedQuestion={setPickedQuestion} />}
        {(currentPage === "questions") && <QuestionsPage resetFilter={resetFilter} questions={filteredQuestions} tags={tags} answers={answers} setPickedQuestion={setPickedQuestion} />}
        {(currentPage === "tags") && <TagsPage setPickedTag={setPickedTag} questions={fullQuestions} tags={tags} />}
        {(currentPage === "askQuestion") && <AskQuestionPage
          setQuestions={setQuestions}
          questions={fullQuestions}
          setPage={setCurrentPage}
          createTags={createTags}
          postQuestion={postQuestion}
          server={server}
          postTag={postTag}
        />
        }
        {(currentPage === "viewQuestion") && <ViewQuestionPage setCurrentPage={setCurrentPage} question={pickQuestion.question} answers={pickQuestion.answers} time={pickQuestion.time} tags={pickQuestion.tags} />}
        {(currentPage === "answerQuestion") && <AnswerInfo answers={answers} /> && <AnswerQuestionPage addAnswertoQuestionServer={addAnswertoQuestionServer} postAnswer={postAnswer} setPickedQuestion={setPickedQuestion} pickQuestion={pickQuestion} addAnswerToQuestion={addAnswerToQuestion} question={pickQuestion.question} answers={answers} setAnswers={setAnswers} setCurrentPage={setCurrentPage} />}
      </div>
    </div>
  );
}