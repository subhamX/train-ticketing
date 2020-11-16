import React, { useState } from "react";
import { Form, Input, Button, Alert, Typography } from "antd";
import AuthLayout from "../authLayout";

import "./register.component.css";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../services/api";
import { LOGIN_SUCCESS } from "../../../services/constants";
import { useHistory } from "react-router-dom";

function Register() {
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = async (payload: any) => {
    try {
      setIsLoading(true);
      let res = await registerUser(payload);
      if (res.data.error === true) {
        throw Error(res.data.message);
      }
      // successfully registered
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
        <Typography.Title style={{ textAlign: "center" }}>Register</Typography.Title>
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
            name="first_name"
            label="First Name"
            rules={[
              {
                required: true,
                message: "Please input your First Name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[
              {
                required: true,
                message: "Please input your Last Name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: "Please enter a valid Username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
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
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "The two passwords that you entered do not match!"
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AuthLayout>
  );
}

export default Register;
