import { Button } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../services/actions/auth";
import "./landing.component.css";

function AppView() {
  const user = useSelector((state: any) => state.authReducer.user);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Welcome onboard!</h1>
      <h2>
        {user
          ? `User ${user.username} is authenticated`
          : `User not authenticated`}
      </h2>

      {/* Performing conditional check */}
      {user ? (
        <Button onClick={() => dispatch(logoutUser())}>Logout</Button>
      ) : (
        <div>
          <Link to="/auth/login/">Login</Link>
          <Link to="/auth/register/">Register</Link>{" "}
        </div>
      )}
    </div>
  );
}

export default AppView;
