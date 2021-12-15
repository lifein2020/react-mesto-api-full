import { useRef, useEffect } from 'react';
import PopupWithForm from '../PopupWithForm/PopupWithForm';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {

    const urlInput = useRef();

    //устанавливаем в поле ввода ссылку по умолчанию при открытии попапа
    useEffect(() => {
        const currentUrlInput = urlInput.current;
        currentUrlInput.value = '';
    }, [isOpen]) 

    function handleSubmit(e) {
        e.preventDefault();
    
        onUpdateAvatar({
          avatarUrl: urlInput.current.value /* значение инпута, полученное с помощью рефа*/
        });
        // очищаем инпут после успешного добавления информации
        urlInput.current.value = '';
      } 

    return (
        <PopupWithForm
            name="avatar"
            id="formAvatar"
            title="Обновить аватар"
            button="save"
            titleButton="Сохранить"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <input
            type="url"
            className="popup__input popup__input_avatar_link"
            id="avatar-link-input"
            name="avatar_link"
            autoComplete="on"
            required
            placeholder="Ссылка на аватар"
            //value="https://somewebsite.com/someimage.jpg"
            ref={urlInput}
            />
            <span
            className="popup__error avatar-link-input-error"
            >
            </span>
        </PopupWithForm>
    )
}

export default EditAvatarPopup;

