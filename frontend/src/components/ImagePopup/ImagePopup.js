function ImagePopup({card, onClose, active}) {
    return (
        <div className={(card && active)? "popup popup_type_image popup_is-opened" : "popup popup_type_image"}>
            <div className="popup__container-image">
                <button type="button" className="popup__close popup__close_image" onClick={onClose}></button>
                <img className="popup__image" src={card.link} alt={card.name} />
                <h2 className="popup__title-image">{card.name}</h2>
            </div>
        </div>
    );
}

export default ImagePopup;