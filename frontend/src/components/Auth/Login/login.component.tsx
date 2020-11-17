import React, { useState } from "react";
import { Form, Input, Button, Alert, Typography } from "antd";
import AuthLayout from "../authLayout";

import "./login.component.css";

import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { loginUser } from "../../../services/api";
import { LOGIN_SUCCESS } from "../../../services/constants";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = async (payload: any) => {
    try {
      setIsLoading(true);
      let res = await loginUser(payload);
      if (res.data.error === true) {
        throw Error(res.data.message);
      }
      // successfully loggedin
      dispatch({ type: LOGIN_SUCCESS, payload: res.data.user });
      history.push("/");
    } catch (err) {
      setErrors(err.message);
      setIsLoading(false);
    }
  };

  const [form] = Form.useForm();
  return (
    <AuthLayout>
      <div className="form-wrapper">
        <Typography.Title style={{ textAlign: "center" }}>
          Login
        </Typography.Title>
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          onFinish={handleSubmit}
        >
          {errors ? (
            <Form.Item>
              <Alert message={errors} type="error" />
            </Form.Item>
          ) : null}
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AuthLayout>
  );
}

export default Login;
