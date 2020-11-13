import React, { useState } from "react";
import { loginFunc } from "../../../services/api";

interface IUserName {
  username: String;
}
interface IPassword {
  password: String;
}

const onClickHandler = (username: IUserName, password: IPassword) => {
  let res = loginFunc(username.username, password.password);
};

function Login() {
  const [username, changeUsername] = useState<IUserName>({ username: "" });
  const [password, changePassword] = useState<IPassword>({ password: "" });

  const usernameOnChange = (username: String) => {
    changeUsername({ username: username });
  };
  const passwordOnChange = (password: String) => {
    changePassword({ password: password });
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="username"
        onChange={(val) => usernameOnChange(val.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        onChange={(val) => passwordOnChange(val.target.value)}
      />
      <button onClick={() => onClickHandler(username, password)}>Login</button>
    </div>
  );
}

export default Login;
