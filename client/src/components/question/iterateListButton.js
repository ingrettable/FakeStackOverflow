export default function IterateListButtons({ isDisabled, handleNextClick, handlePreviousClick }) {
  return (
    <div className="SortButtonsHeaderContainer">
      <PreviousButton handlePreviousClick={handlePreviousClick} isDisabled={isDisabled} />
      <NextButton handleNextClick={handleNextClick} />
    </div>
  )
}

function NextButton({ handleNextClick }) {
  return (
    <button
      className="buttonStyle"
      onClick={handleNextClick}
    >
      Next
    </button>
  )
}

function PreviousButton({ handlePreviousClick, isDisabled }) {
  // console.log(isDisabled);
  const className = isDisabled ? "buttonStyle disabledButton" : "buttonStyle";

  return (
    <button
      disabled={isDisabled}
      className={className}
      onClick={handlePreviousClick}
    >
      Previous
    </button>
  )
}