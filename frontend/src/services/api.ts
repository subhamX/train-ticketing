import Axios from "axios";

export async function loginFunc(username: String, password: String) {
  const config: Object = {
    method: "POST",
    url: "http://localhost:8000/auth/login/",
    withCredentials: true,
    data: {
      username: username,
      password: password,
    },
  };
  let res = await Axios(config);
  console.log(res);
  if (res.status === 200) {
    return true;
  }
  return false;
}
