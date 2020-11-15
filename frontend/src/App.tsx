import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Auth/Login/login.component";
import Register from "./components/Auth/Register/register.component";
import Landing from "./components/Landing/landing.component";
import { useSelector } from "react-redux";
import Train from "./components/Trains/trains.component";
import TrainInfo from "./components/Trains/TrainInfo/trainInfo.component";
import { useDispatch } from "react-redux";
import { checkUserAuthStatus } from "./services/actions/auth";
import NonAuthRoute from "./components/NonAuthRoute/nonAuthRoute";
import PrivateRoute from "./components/PrivateRoute/privateRoute";
import UserProfile from "./components/Profile/profile.component";
import Loader from "./components/Loader/loader.component";

function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => state.stateReducer.isLoading);

  useEffect(() => {
    dispatch(checkUserAuthStatus());
  }, [dispatch]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <BrowserRouter>
      <Switch>
        <NonAuthRoute exact path="/auth/login/">
          <Login />
        </NonAuthRoute>
        <NonAuthRoute exact path="/auth/register/">
          <Register />
        </NonAuthRoute>
        <PrivateRoute path="/profile">
          <UserProfile />
        </PrivateRoute>
        <Route exact path="/trains/">
          <Train />
        </Route>
        <Route path="/" component={Landing} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
