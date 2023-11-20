import { useState } from 'react';
import SearchHeader from './searchHeader';

export default function SearchBar({ setQuestions, questions, findTagByID, setPickedSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  function hasTags(question, tagsArray) {
    if (tagsArray === null) {
      return true;
    }
    if (question === null) {
      return false;
    }

    if (tagsArray.length === 0) {
      return true;
    }
    if (question.tags.length === 0) {
      return false;
    }

    return question.tags.some(tagId => tagsArray.some(tag => findTagByID(tagId).name === tag));
  }

  const inputSearchTerm = (e) => {
    e.preventDefault();
    var newSearchTerm = e.target.value.toLowerCase();
    setSearchTerm(newSearchTerm);
  }

  const handleKeyPress = (e) => {
    console.log(e)
    var newSearchTerm = searchTerm;
    const tagRegex = /\[[^\]]+\]/g;
    const tags = searchTerm.match(tagRegex);
    e.preventDefault();
    let filteredQuestions = questions;
    // remove additional [] from tags
    if (tags !== null) {
      tags.forEach((tag, index) => {
        newSearchTerm = searchTerm.replaceAll(tag, "");
        tags[index] = tag.substring(1, tag.length - 1);
      });
    }
    newSearchTerm = newSearchTerm.trim();
    filteredQuestions = filteredQuestions.filter((question) => {
      if (newSearchTerm === "") {
        console.log(hasTags(question, tags), question, tags)
        return hasTags(question, tags);
      }
      return hasTags(question, tags) && (question.text.toLowerCase().includes(newSearchTerm) || question.title.toLowerCase().includes(newSearchTerm));
    });
    setQuestions(filteredQuestions);
    setPickedSearch();
    return false;
  }

  return (
    <div>
     
      <form id="searchForm" onSubmit={handleKeyPress}>
        <label htmlFor="searchInput"></label>
        <input type="text"
          value={searchTerm}
          onChange={inputSearchTerm}
          // onKeyUp={handleKeyPress}
          name="search"
          placeholder="Search..."
          id="searchInput" />
      </form>
    </div>

  )

}