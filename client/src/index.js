import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import 'gestalt/dist/gestalt.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import {getToken} from './utils';

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Checkout from './components/Checkout';
import Navbar from './components/Navbar';
import Brews from './components/Brews';

const PrivateRoute = ({ component: Component, ...rest}) => (
  <Route {...rest} render={props => (
    getToken() !== null
    ? <Component {...props} />
    : <Redirect 
        to={{
          pathname: '/sign-in',
          state: {from: props.location}
        }}
      />
  )} />
)

const Root = () => (
  <Router>
    <React.Fragment>
      <Navbar />
      <Switch>
        <Route component={SignIn} path="/sign-in" />
        <Route component={SignUp} path="/sign-up" />
        <PrivateRoute component={Checkout} path="/checkout" />
        <Route component={Brews} path="/:brandId/brews" />
        <Route component={App} path="/" />
      </Switch>
    </React.Fragment>
  </Router>
)

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
