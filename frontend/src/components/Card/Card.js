import React from 'react';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';

function Card(props) {
    //Подписываемся на контекст CurrentUserContext
    const currentUser = React.useContext(CurrentUserContext);

    //Показать иконку удаления:
    // Определяем, являемся ли мы владельцем текущей карточки
    // const isOwn = props.card.owner._id === currentUser._id; // 12спринт
    const isOwn = props.card.owner === currentUser._id;
    //console.log(props.card);
    //console.log(props.card.owner);
    //console.log(currentUser._id);

    // Создаём переменную, которую после зададим в `className` для кнопки удаления
    const cardDeleteButtonClassName = (
     `element__trash ${isOwn ? 'element__trash_visible' : 'element__trash'}` 
    ); 
  
    // Определить, поставили ли мы уже «лайк» этой карточке:
    // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
    const isLiked = props.card.likes.some(i => i.id === currentUser._id);
    //console.log(props.card.likes.[0]);
    //console.log(props.card.likes.[1]);

    // Создаём переменную, которую после зададим в `className` для кнопки лайка
    const cardLikeButtonClassName = (
        `element__like ${isLiked ? 'element__like_active' : 'element__like'}`
    );    

    const likeCounter =  props.card.likes.length;

    function handleCardClick() {
        props.onCardClick(props.card);
      } 

    function handleLikeClick() {
        props.onCardLike(props.card);
    }

    function handleDeleteClick() {
        props.onCardDelete(props.card);
    }

    return (
            <article className="element">
                <img className="element__image" src={props.card.link} alt={props.card.name} onClick={handleCardClick} />
                <button className={cardDeleteButtonClassName} type="button" onClick={handleDeleteClick}></button>
                <div className="element__text">
                    <h2 className="element__title">{props.card.name}</h2>
                    <div className="element__group">
                        <button className={cardLikeButtonClassName} type="button" onClick={handleLikeClick}></button>
                        <div className="element__count">{likeCounter}</div>
                    </div>
                </div>
            </article>
    );
}
    
export default Card;

