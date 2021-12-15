import React from 'react';
import pen from '../../images/pen.png';
import Card from '../Card/Card';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';

function Main(props) {
    const currentUser = React.useContext(CurrentUserContext);

    return(
        <main className="content">
            <nav className="profile">
                <div className="profile__container">
                    <img className="profile__avatar" src={currentUser.avatar} alt={currentUser.name} />
                    <div className="profile__overlay" onClick={props.onEditAvatar}>
                        <img className="profile__pen" src={pen} alt="Карандаш" />
                    </div>
                </div>
                <div className="profile-info">
                    <div className="profile-info__container">
                        <h1 className="profile-info__name">{currentUser.name}</h1>
                        <button className="profile-info__edit-button" type="button" name="send" onClick={props.onEditProfile}></button>
                    </div>
                    <p className="profile-info__activity">{currentUser.about}</p>
                </div>
                <button className="profile__add-button" type="button" onClick={props.onAddPlace}></button>
            </nav>

            <section className="elements">
                {props.cards.map(card => {
                        return (
                            <Card 
                                key={card._id} 
                                card={card} 
                                onCardClick={props.onCardClick} 
                                onCardLike={props.onLikeClick} 
                                onCardDelete={props.onDeleteClick}
                            />
                        )
                    })}
            </section>
        </main>
    );
}

export default Main;



