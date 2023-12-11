export default function DeleteButton({ funct }) {
  return (
    <div className="delete">
      <button className="buttonStyle" onClick={funct}>
        Delete
      </button>
    </div>
  );
}