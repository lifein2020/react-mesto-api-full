import { useState, useEffect } from 'react';
import {
  Route,
  Switch,
  Redirect,
  useHistory
} from 'react-router-dom';
import api from '../../utils/Api';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import kusto from '../../images/kusto.jpg';
import PopupWithForm from '../PopupWithForm/PopupWithForm';
import EditProfilePopup from '../EditProfilePopup/EditProfilePopup';
import EditAvatarPopup from '../EditAvatarPopup/EditAvatarPopup';
import AddPlacePopup from '../AddPlacePopup/AddPlacePopup';
import ImagePopup from '../ImagePopup/ImagePopup';
import Header from '../Header/Header';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import Register from '../Register/Register';
import Login from '../Login/Login';
import InfoTooltip from '../InfoTooltip/InfoTooltip';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import * as auth from '../../utils/auth.js';
import success from '../../images/success.svg';
import fail from '../../images/fail.svg';


function App() {

  //Для компонента Main:
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const handleEditProfileClick = () => {
    setIsEditProfileOpen(true);
  }

  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }

  const [isEditAvatarOpen, setIsEditAvatarOpen] = useState(false);
  const handleEditAvatarClick = () => {
    setIsEditAvatarOpen(true);
  }

  const [selectedCard, setIsSelectedCard] = useState({});
  const [isPreviewPopupOpened, setIsPreviewPopupOpened] = useState(false);
  function onCardClick(card) {
    setIsSelectedCard(card);
    setIsPreviewPopupOpened(true);
  }

  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [message, setMessage] = useState({image: "", text: ""});

  //Для компонентов папапов
  const handleAllPopupsClose = () => {
    setIsEditProfileOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarOpen(false);
    setIsSelectedCard({});
    setIsPreviewPopupOpened(false);
    setIsInfoTooltipOpen(false);
  }

  //Для компонента Main, чтобы потом перебросить в Card через props:
  //1.
  const [currentUser, setCurrentUser] = useState({name: 'Жак-Ив Кусто', about: 'Исследователь океана', avatar: kusto});
  const [cards, setCards] = useState([]);
  //2.
  useEffect(() => {
    Promise.all([api.getUserInfo(), api.getCardsList()])
    .then(([userData, cardsArray]) => {
      // console.log(userData);
      // console.log(cardsArray);
      setCurrentUser({
        name: userData.name, 
        about: userData.about, 
        avatar: userData.avatar,
        _id: userData._id,
      });
      setCards(cardsArray);
    })
    .catch((err) => {
      console.log(err);
    })
  }, []);

  //3.
  const handleCardLike = (card) => {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, isLiked)
    .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
    .catch((err) => {
      console.log(err);
    })
  }

  //4.
  const handleCardDelete = (card) => {
    api.deleteCard(card._id)
    .then(() => {
        setCards((state) =>  state.filter((c) => c._id !== card._id));
    })
    .catch((err) => {
      console.log(err);
    })
  }

  //Для компонента EditProfilePopup
  const handleUpdateUser = ({userName, userDescription}) => {
    // отправляем значения инпутов(то, что ввели)
    api.patchUserInfo({userName, userDescription}) 
    .then((dataProfile) => {
      setCurrentUser({
        name: dataProfile.name, 
        about: dataProfile.about,
        avatar: dataProfile.avatar, // чтобы аватар тоже отображался 
        _id: dataProfile._id, //чтобы лайки проставлялись после обновления профиля
      });
      //handleAllPopupsClose();
    })
    .then(() => {
      handleAllPopupsClose();
    })
    .catch((err) => {
      console.log(err);
    }) 
  }

  //Для компонента EditAvatarPopup
  const handleUpdateAvatar = ({ avatarUrl }) => {
    //отправляем то, что ввели в инпут
    api.patchAvatarUser({ avatarUrl })
    .then((dataProfile) => {
      setCurrentUser({
        avatar: dataProfile.avatar,
        //чтобы данные профиля тоже отображались 
        name: dataProfile.name, 
        about: dataProfile.about,
        _id: dataProfile._id,
      });
      handleAllPopupsClose();
    })
    .catch((err) => {
      console.log(err);
    })
  }

  //Для компонента AddPlacePopup
  function handleAddPlaceSubmit({ card_name, card_image_link }) {
    api.postAddCard({ card_name, card_image_link })
    .then(newCard => {
      setCards([newCard, ...cards]);
      handleAllPopupsClose();
    })
    .catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        handleAllPopupsClose();
      }
  }
    document.addEventListener('keydown', closeByEscape)
    return () => document.removeEventListener('keydown', closeByEscape)
  }, [])

  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('email');
  const history = useHistory();
  

  const authUser = (jwt) => {
    // console.log(jwt);
    return auth.getContent(jwt)
    .then((res) => {
      // console.log(res);
      if (res) {
        setLoggedIn(true);
        setUserEmail(res.data.email);
      }
    })
    .catch(err => console.log(err));
  };

  // если у пользователя есть токен в localStorage, проверит валидность токена
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    // console.log(jwt);
    if (jwt) {
      authUser(jwt);
    }
  }, [loggedIn]);

  //если пользователь авторизован, проходит в систему
  useEffect(() => {
    if (loggedIn) {
      history.push('/');
    }
  }, [loggedIn, history]);

  const handleRegister = ({ password, email }) => {
    return auth.register(password, email)
    .then(dataReg => {
      // console.log(dataReg);
      if (dataReg.data._id || dataReg.statusCode !== 400) {
        setUserEmail(dataReg.data.email);
        history.push('/sign-in');
        setIsInfoTooltipOpen(true);
        setMessage({ image: success, text: 'Вы успешно зарегистрировались!' });
      } else {
        return
      }
    })
    .catch( err => {
      setIsInfoTooltipOpen(true);
      setMessage({ image: fail, text: 'Что-то пошло не так! Попробуйте ещё раз.' });
      }
    )
  };

  const handleLogin = ({ password, email }) => {
    return auth.authorize(password, email)
    .then(dataLog => {
      if (dataLog.token || dataLog.statusCode === 200) {
        setLoggedIn(true); //чтобы ProtectedRoute отображал маршрут /
        localStorage.setItem('jwt', dataLog.token);
        history.push('/'); //очищаем стейт и перенаправляем пользователя на страницу /
        setUserEmail(email);
      } else {
          return
      }
    })
    .catch( err => {
      setIsInfoTooltipOpen(true);
      setMessage({ image: fail, text: 'Что-то пошло не так! Попробуйте ещё раз.' });
      }
    )
  };

  const onSignOut = () => {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    history.push('/login');
  }

  return (
    <>
      <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
          <Header 
              onSignOut={onSignOut}
              email={userEmail}
          />
          <Switch>
            <ProtectedRoute 
              exact 
              path="/" 
              loggedIn={loggedIn} 
              component={Main} 
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              cards={cards}
              onCardClick={onCardClick}
              onLikeClick={handleCardLike}
              onDeleteClick={handleCardDelete}
            />
            <Route path="/sign-up">
              <Register onRegister={handleRegister} />
            </Route>
            <Route path="/sign-in">
              <Login onLogin={handleLogin} />
            </Route>
            <Route>
            {loggedIn ? <Redirect to="/sign-in" /> : <Redirect to="/sign-up" />}
            </Route>
          </Switch>

          <Footer />
          
          <EditProfilePopup
          isOpen={isEditProfileOpen}
          onClose={handleAllPopupsClose}
          //currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
          >
          </EditProfilePopup>

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={handleAllPopupsClose}
            onAddPlace={handleAddPlaceSubmit}
          >
          </AddPlacePopup>

          <PopupWithForm
            name="confirm"
            id="formConfirm"
            title="Вы уверены?"
            button="button_confirm popup__save"
            titleButton="Да"
            onClose={handleAllPopupsClose}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarOpen}
            onClose={handleAllPopupsClose}
            onUpdateAvatar={handleUpdateAvatar}
          >
          </EditAvatarPopup>

          <ImagePopup card={selectedCard}
            onClose={handleAllPopupsClose}
            active={isPreviewPopupOpened}
          />

          <InfoTooltip 
            isOpen={isInfoTooltipOpen}
            onClose={handleAllPopupsClose}
            message={message}
          />
        </CurrentUserContext.Provider>
      </div>
    </>
  )
}

export default App;
