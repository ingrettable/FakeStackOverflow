
export default function ErrorPopup({ id, title, description, setErrors, errors }) {

  const removeErrorById = (id) => {
    setErrors(errors.filter(error => error.id !== id));
  }


  return (
    <>
      <div className="errorPopup">
        <div className="errorPopupContent">
          <p>
            <strong>{title}: </strong>{description}
            <button className="rightButton" onClick={() => removeErrorById(id)}>X</button>
          </p>
        </div>
      </div>
    </>
  )
}