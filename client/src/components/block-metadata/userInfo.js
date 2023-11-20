export default function UserInfo({ user, time }) {
  return (
    <div className="questionUserInfoSidebar">
      <p>
        <span className="username">{user}</span> asked {time}
      </p>
    </div>
  )
}