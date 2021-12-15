import logo from '../../images/logo.png';
import { Route, Link } from 'react-router-dom';

function Header({ onSignOut, email }) {

    function handleSignOut() {
        onSignOut();
    }

    return (
        <header className="header">
            <img src={logo} className="header__logo" alt="Лототип проекта Место" />
            <Route path="/sign-up">
                <Link className="header__sign-link" to="sign-in">Войти</Link>
            </Route>
            <Route path="/sign-in">
                <Link className="header__sign-link" to="sign-up">Регистрация</Link>
            </Route>
            <Route exact path="/">
                <div className="header__container">
                    <p className="header__user-email">{ email }</p>
                    <button className="header__logout" onClick={handleSignOut}>Выйти</button>
                </div>
            </Route>
        </header>
    );
}
    
export default Header;

