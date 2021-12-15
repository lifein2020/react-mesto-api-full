function PopupWithForm(props) { // ({ name, isOpen, onClose, title, id, onSubmit, children, button, titleButton })
    return (
        <div className={props.isOpen ? `popup popup_type_${props.name} popup_is-opened` : `popup popup_type_${props.name}`}>
            <div className={`popup__container popup__container_${props.name}`}>
                <button type="button" className={`popup__close popup__close_${props.name}`}  onClick={props.onClose}></button>
                <h2 className="popup__title">{props.title}</h2>
                <form 
                    name={props.name} 
                    id={props.id} 
                    className={`popup__form popup__form_${props.name}`} 
                    action="#" 
                    autoComplete="off" 
                    //noValidate
                    onSubmit={props.onSubmit}
                >
                    {props.children}
                    <button type="submit" className={`popup__button popup__${props.button}`}>{props.titleButton}</button>
                </form>
            </div>
        </div>
    );
  }

  export default PopupWithForm;
