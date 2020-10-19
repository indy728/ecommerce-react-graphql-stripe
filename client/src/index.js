import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import 'gestalt/dist/gestalt.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Checkout from './components/Checkout';
import Navbar from './components/Navbar';

const Root = () => (
  <Router>
    <React.Fragment>
      <Navbar />
      <Switch>
        <Route component={SignIn} path="/sign-in" />
        <Route component={SignUp} path="/sign-up" />
        <Route component={Checkout} path="/checkout" />
        <Route component={App} path="/" />
      </Switch>
    </React.Fragment>
  </Router>
)

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
