import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Login from "./components/Auth/Login/login.component";
import Register from "./components/Auth/Register/register.component";
import Landing from "./components/Landing/landing.component";
import { useDispatch } from "react-redux";
import { checkUserAuthStatus } from "./services/actions/auth";
import NonAuthRoute from "./components/NonAuthRoute/nonAuthRoute";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserAuthStatus());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Switch>
        <NonAuthRoute path="/auth/login/">
          <Login />
        </NonAuthRoute>
        <NonAuthRoute path="/auth/register/">
          <Register />
        </NonAuthRoute>
        <Route path="/" component={Landing} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
