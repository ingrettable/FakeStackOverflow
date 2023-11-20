export default function SortButtonHeader({ questionCount, handleSortClick, sortBy }) {
    return (
      <div className="SortButtonsHeaderContainer">
      <h2>{questionCount} Questions</h2>
      <SortButtons handleSortClick={handleSortClick} sortBy={sortBy} />
  </div>
    )
  }
  
  function SortButtons({ handleSortClick, sortBy }) {
    return (
      <div id="sortButtons" className="sortbuttonsContainer">
      <button
        className={`buttonStyle ${sortBy === 'newest'}`}
        onClick={() => handleSortClick('newest')}
      >
        Newest
      </button>
      <button
        className={`buttonStyle ${sortBy === 'activity'}`}
        onClick={() => handleSortClick('activity')}
      >
        Active
      </button>
      <button
        className={`buttonStyle ${sortBy === 'unanswered'}`}
        onClick={() => handleSortClick('unanswered')}
      >
        Unanswered
      </button>
    </div>
  
    )
  }