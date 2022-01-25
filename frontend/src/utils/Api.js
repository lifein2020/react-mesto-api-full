class Api {
  constructor ({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  // Обработка ответа с сервера
  _getResponse(response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(`Ошибка: ${response.status}`);
  }

  // Получение данных пользователя(моих)
  getUserInfo() {
    return fetch(this.baseUrl + 'users/me', {
      headers: {
        ...this.headers,
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      }
    }).then(this._getResponse);
  }
 
  // Получение данных всех карточек
  getCardsList() {
    return fetch(this.baseUrl + 'cards', { // либо `${this.baseUrl}cards` и в результате конкатенации получается https://mesto.nomoreparties.co/v1/cohort-26/cards
      headers: {
        ...this.headers,
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      }
    }).then(this._getResponse);
  }

  // Добавление карточек
  postAddCard({ card_name, card_image_link }) {
    return fetch(`${this.baseUrl}cards`, {
      method: 'POST',
      body: JSON.stringify({
        name: card_name,
        link: card_image_link
      }),
      headers: {
        ...this.headers,
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      }
    }).then(this._getResponse);
  }

  // Редактирование профиля
  patchUserInfo({userName, userDescription}) {
    return fetch(this.baseUrl + 'users/me', { //`${this.baseUrl}users/me`
      method: 'PATCH',
      body: JSON.stringify({
        name: userName,
        about: userDescription,
      }),
      headers: {
        ...this.headers,
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      }
    })
    .then(this._getResponse);
  }

  // Смена аватара
  patchAvatarUser({ avatarUrl }) {
    return fetch(this.baseUrl + 'users/me/avatar', { //`${this.baseUrl}users/me/avatar`
      method: 'PATCH',
      body: JSON.stringify({
        avatar: avatarUrl
      }),
      headers: {
        ...this.headers,
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      }
    })
    .then(this._getResponse);
  }

  // Удаление карточки
  deleteCard(id) {
    return fetch(`${this.baseUrl}cards/${id}`, {
      method: 'DELETE',
      headers: {
        ...this.headers,
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      }
    })
    .then(this._getResponse);
  }

  // Поставить лайк
  /*putLikeCard(id) {
    return fetch(`${this.baseUrl}cards/likes/${id}`, {
      method: 'PUT',
      headers: this.headers
    })
    .then(this._getResponse);
  }

  // Удалить лайк:
  //--------- 2 вариант рабочий----------
  deliteLikeCard(id) {
    return fetch(`${this.baseUrl}cards/${id}/likes`, {
      method: 'DELETE',
      headers: this.headers
    })
    .then(this._getResponse);
  }*/

  //-------- 1 вариант рабочий---------
  changeLikeCardStatus(id, isLiked) {
    return fetch(`${this.baseUrl}cards/${id}/likes`, {
      method: isLiked ? 'DELETE' : 'PUT', //если карточка уже лайкнута(черный лайк), то удалить лайк, иначе поставить
      headers: {
        ...this.headers,
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      }
    })
    .then(this._getResponse);
  }
}

const api = new Api({
  baseUrl: 'https:q//api.mesto.zhivtsova.nomoredomains.rocks/',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;