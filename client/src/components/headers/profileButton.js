export default function ProfileButton({ setProfilePage, isLoggedIn }) {
  const className = isLoggedIn ? "buttonStyle " : "buttonStyle disabledButton";
  return (
    <div className="profile">
    <button className={className} onClick={setProfilePage}> 
      Profile </button>
    </div>
  )
}