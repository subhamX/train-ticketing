import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { RootState } from "../../services/reducers";

function PrivateRoute({ children, adminRoute, ...rest }: any) {
  const user = useSelector((state: RootState) => state.authReducer.user);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        (user && !adminRoute) ||
        (adminRoute && user && user.is_admin) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
