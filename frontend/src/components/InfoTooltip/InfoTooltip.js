function InfoTooltip({ isOpen, onClose, message }) {
    return (
        <div className={isOpen ? `popup popup_type_infoTooltip popup_is-opened` : `popup popup_type_infoTooltip`}>
            <div className="popup__container popup__container_infoTooltip">
                <button type="button" className="popup__close popup__close_infoTooltip" onClick={onClose}></button>
                <img className="popup__container_image" src={message.image} alt={message.image}/>
                <h2 className="popup__title_sign">{message.text}</h2>
            </div>
        </div>
    )
} 

export default InfoTooltip;
