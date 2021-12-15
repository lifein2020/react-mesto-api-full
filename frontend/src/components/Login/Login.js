import {useState} from 'react';

function Login({onLogin}) {

    const [userEmail, setUserEmail] = useState('');
    function handleChangeUserEmail(e) {
        setUserEmail(e.target.value);
    }

    const [userPassword, setUserPassword] = useState('');
    function handleChangeUserPassword(e) {
        setUserPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();

        onLogin(
            {
                password: userPassword, 
                email: userEmail
            }
        );
        setUserEmail('');
        setUserPassword('');
    }

    return(
        <div className="form">
            <h2 className="form__title">Вход</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email"
                    className="form__input"
                    id="email-input"
                    name="email"
                    autoComplete="on"
                    required
                    placeholder="Email"
                    value={userEmail}
                    onChange={handleChangeUserEmail}
                />
                <input 
                    type="password"
                    className="form__input"
                    id="password-input"
                    name="password"
                    autoComplete="off"
                    required
                    placeholder="Пароль"
                    value={userPassword}
                    onChange={handleChangeUserPassword}
                ></input>
                <button type="submit" className="form__button">Войти</button>
            </form>
        </div>
    )
}

export default Login