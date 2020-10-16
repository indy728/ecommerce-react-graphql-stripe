import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Checkout from './components/Checkout';

const Root = () => (
  <Router>
    <Switch>
      <Route component={App} path="/" />
      <Route component={SignIn} path="/sign-in" />
      <Route component={SignUp} path="/sign-up" />
      <Route component={Checkout} path="/checkout" />
    </Switch>
  </Router>
)

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
