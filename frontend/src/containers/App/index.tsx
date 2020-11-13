import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';


import LoginView from '../AuthView/LoginView';
import RegisterView from '../AuthView/RegisterView';
import AppView from '../AppView';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/auth/login" component={LoginView} />
        <Route exact path="/auth/register" component={RegisterView} />
        <Route path="/" component={AppView} />
      </Switch>
    </BrowserRouter>
  );
}


export default App;
