import React, { useState } from 'react';
import '../stylesheets/MainPage.css';

export default function TagsPage({ questions, tags, setPickedTag }) {
  // eslint-disable-next-line no-unused-vars
  const [currentPage, setCurrentPage] = useState(null);


  const calculateQuestionsCount = (tagId) => {
    // console.log(tags)
    return questions.filter((question) => question.tags.includes(tagId)).length;
  };


  return (
    <div>
      {currentPage !== "askQuestion" && (
        <div className="tagsContainer">
          {tags.map((tag, tagIndex) => (
            <div key={tagIndex} className="tag tagWidth">
              <a href="#" onClick={()=>{setPickedTag(tag)}} className="tag-link" >
                {tag.name}
              </a>
              <div className="tag-questions">
                {calculateQuestionsCount(tag._id)} questions
              </div>
            </div>
          ))
         }
        </div>
      )}
      {/* {currentPage === "askQuestion" && <AskQuestion />} */}
    </div>
  );
}