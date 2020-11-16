import { message } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { RootState } from "../../services/reducers";

function PrivateRoute({ children, adminRoute, ...rest }: any) {
  const user = useSelector((state: RootState) => state.authReducer.user);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        (user && !adminRoute) || (adminRoute && user && user.is_admin) ? (
          children
        ) : (
          <RedirectUser messageText="Please authenticate with correct credentials to continue">
            <Redirect
              to={{
                pathname: "/",
                state: { from: location },
              }}
            />
          </RedirectUser>
        )
      }
    />
  );
}

export function RedirectUser({ children, messageText }: any) {
  useEffect(() => {
    message.info(messageText, 3);
  }, []);

  return <>{children}</>;
}

export default PrivateRoute;
