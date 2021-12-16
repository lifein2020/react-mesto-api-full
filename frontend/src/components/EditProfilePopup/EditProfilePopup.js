import {useState, useEffect} from 'react';
import React from 'react';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import PopupWithForm from '../PopupWithForm/PopupWithForm';

function EditProfilePopup({ isOpen, onClose, onUpdateUser}) {

    // управляемые компоненты (input)
    const [userName, setUserName] = useState(''); 
    function handleChangeName(e) {
        setUserName(e.target.value);
    }
    const [userDescription, setUserDescription] = useState(''); 
    function handleChangeDescription(e) {
        setUserDescription(e.target.value);
    }

    //Чтобы подставить в форму текущие значения:
    //1. подписываемся на контекст
    const currentUser = React.useContext(CurrentUserContext); 

    //2. после загрузки текущего пользователя из API его данные будут использованы в управляемых компонентах.
    useEffect(() => {
        setUserName(currentUser.name);
        setUserDescription(currentUser.about);
    }, [currentUser, isOpen]); //Нужно еще следить за isOpen (за состоянием открытия), чтобы вставлять в инпуты данные пользователя, иначе, если мы удалим информацию из инпутов и просто закроем попап, то при следующем открытии инпуты будут пустые (без данных пользователя)

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();
        // Передаём значения управляемых компонентов во внешний обработчик
        onUpdateUser({ userName, userDescription });
    }

    return (
        <PopupWithForm
            name="edit"
            id="formEdit"
            title="Редактировать профиль"
            button="save"
            titleButton="Сохранить"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <input
            type="text"
            className="popup__input popup__input_user_name"
            id="name-input"
            name="name"
            required
            placeholder="Имя"
            minLength="2"
            maxLength="40"
            value={userName || ''}
            onChange={handleChangeName}
            />
            <span
            className="popup__error name-input-error"
            >
            </span>
            <input
            type="text"
            className="popup__input popup__input_user_job"
            id="job-input"
            name="job"
            required
            placeholder="Род занятий"
            minLength="2"
            maxLength="200"
            value={userDescription || ''}
            onChange={handleChangeDescription}
            />
            <span
            className="popup__error job-input-error"
            >
            </span>
        </PopupWithForm>  
    )
}

export default EditProfilePopup;




