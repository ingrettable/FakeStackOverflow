// upvote button 

import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(fas)
// button headers (upvote and downvote)
export default function VoteButtons({ 
    handleUpvote, 
    handleDownvote, 
    upvoted_by,
    downvoted_by,
    voteCount, 
    userData 
  }) {
  const minReputationPoints = 50;
  console.log("vote buttons", userData, upvoted_by, downvoted_by, voteCount)

  const voteAllowed = userData.isLoggedIn && userData.reputation > minReputationPoints;
  const upvoteAllowed = voteAllowed && !upvoted_by.includes(userData.userID);
  const downvoteAllowed = voteAllowed && !downvoted_by.includes(userData.userID);

  return (
    <div className="SortButtonsHeaderContainer">
      <UpvoteButton handleUpvote={handleUpvote} upvoteAllowed={upvoteAllowed} />
      <h1>{voteCount}</h1>
      <DownvoteButton handleDownvote={handleDownvote} downvoteAllowed={downvoteAllowed}  />
    </div>
  );
}

// upvote button
function UpvoteButton({ handleUpvote, upvoteCount, upvoteAllowed }) {
  const className = "buttonStyle" + (upvoteAllowed ? "" : " disabledButton");
  return (
    <div>
      <button className={className} onClick={handleUpvote}>
          <FontAwesomeIcon icon="fa-solid fa-arrow-up" />
      </button>
      <p>{upvoteCount}</p>
    </div>
  );
}

// downvote button
function DownvoteButton({ handleDownvote, downvoteCount, downvoteAllowed }) {
  const className = "buttonStyle" + (downvoteAllowed ? "" : " disabledButton");
  // console.log("downvote button", className)
  return (
    <div>
      <button className={className} onClick={handleDownvote}>
      <FontAwesomeIcon icon="fa-solid fa-arrow-down" />
        {/* <i class="fa-solid fa-arrow-down"></i> */}
      </button>
      <p>{downvoteCount}</p>
    </div>
  );
}