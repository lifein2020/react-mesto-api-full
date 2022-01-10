function Footer() {
    return (
        <footer className="footer">
            <h3 className="footer__title">&copy; 2022 Mesto Russia</h3>
        </footer>
       
        
    );
}
    
export default Footer;


/* Показывать только на главной странице
import { Route } from 'react-router-dom';

function Footer() {
    return (
        <Route path="/">
            <footer className="footer">
                <h3 className="footer__title">&copy; 2022 Mesto Russia</h3>
            </footer>
        </Route>
        
    );
}

В App.js при этом:
{loggedIn && <Footer />} 
 */