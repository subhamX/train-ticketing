import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Auth/Login/login.component";
import Register from "./components/Auth/Register/register.component";
import Landing from "./components/Landing/landing.component";
import { useSelector } from "react-redux";
import Train from "./components/Trains/trains.component";
import TrainInfo from "./components/Trains/TrainInfo/trainInfo.component";
import TicketSearch from "./components/Tickets/ticketSearch/ticketSearch.component";
import TicketSearchResults from "./components/Tickets/ticketSearchResult/ticketSearchResult.component";
import BookTickets from "./components/Tickets/book/book.component";
import { useDispatch } from "react-redux";
import { checkUserAuthStatus } from "./services/actions/auth";
import NonAuthRoute from "./components/NonAuthRoute/nonAuthRoute";
import PrivateRoute from "./components/PrivateRoute/privateRoute";
import UserProfile from "./components/Profile/profile.component";
import Loader from "./components/Loader/loader.component";
import AddTrain from "./components/Admin/AddTrain/addTrain.component";
import AdminHome from "./components/Admin/Home";
import AddNewBookingInstance from "./components/Admin/AddNewBookingInstance/addNewBookingInstance.component";
import AddNewCoach from "./components/Admin/AddCoach/addCoach.component";
import Error from "./components/Error/error.component";
import About from "./components/About/About.component";

function App() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(
    (state: any) => state.stateReducer
  );

  useEffect(() => {
    dispatch(checkUserAuthStatus());
  }, [dispatch]);

  
  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <Error />;
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
        {/* Admin Route */}
        <PrivateRoute adminRoute={true} exact path="/admin/">
          <AdminHome />
        </PrivateRoute>
        <PrivateRoute adminRoute={true} exact path="/admin/trains/add/">
          <AddTrain />
        </PrivateRoute>
        <PrivateRoute
          adminRoute={true}
          exact
          path="/admin/trains/instance/add/"
        >
          <AddNewBookingInstance />
        </PrivateRoute>
        <PrivateRoute adminRoute={true} exact path="/admin/coaches/add/">
          <AddNewCoach />
        </PrivateRoute>

        <NonAuthRoute exact path="/trains/info/:train_id">
          <TrainInfo />
        </NonAuthRoute>
        <Route path="/tickets/search/" exact>
          <TicketSearch />
        </Route>

        <PrivateRoute exact path="/tickets/book/">
          <BookTickets />
        </PrivateRoute>
        <Route path="/about/" component={About} />
        <Route path="/tickets/listing/">
          <TicketSearchResults />
        </Route>
        <Route path="/" component={Landing} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
