import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Alert,
  Typography,
  InputNumber,
  DatePicker,
} from "antd";
import "./addNewBookingInstance.component.css";
import Head from "../../Head/head.component";
import { useHistory } from "react-router-dom";
import moment from 'moment';
import { addNewBookingInstance } from "../../../services/api";

function AddNewBookingInstance() {
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  const handleSubmit = async (payload: any) => {
    try {
      setIsLoading(true);
      let endTime=moment(payload.booking_end_time);
      let startTime=moment(payload.booking_start_time);
      if(startTime.isAfter(endTime)){
        setErrors('Start Time should be less than end time');
      }
      payload.booking_end_time=endTime.toISOString();
      payload.booking_start_time=startTime.toISOString();

      console.log(payload)
      let res = await addNewBookingInstance(payload);
      if (res.data.error === true) {
        throw Error(res.data.message);
      }
      history.push("/");
    } catch (err) {
      setErrors(err.message);
    }
    setIsLoading(false);

  };

  const [form] = Form.useForm();
  return (
    <div>
      <Head />
      <div className="form-wrapper">
        <Typography.Title style={{ textAlign: "center" }}>
          Add Train Booking Instance
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
            name="train_number"
            label="Train Number"
            rules={[
              {
                required: true,
                message: "Please enter the Train Number!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="journey_date"
            label="Journey Date"
            rules={[
              {
                required: true,
                message: "Please enter the Journey Date!",
              },
            ]}
          >
                        <DatePicker/>

          </Form.Item>

          <Form.Item
            label="Number Of AC Coaches"
            rules={[
              {
                required: true,
                message: "Please enter a valid value!",
              },
            ]}
            name="number_of_ac_coaches"
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Number Of Sleeper Coaches"
            rules={[
              {
                required: true,
                message: "Please enter a valid value!",
              },
            ]}
            name="number_of_sleeper_coaches"
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="AC Coach ID"
            rules={[
              {
                required: true,
                message: "Please enter a valid value!",
              },
            ]}
            name="ac_coach_id"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Sleeper Coach ID"
            rules={[
              {
                required: true,
                message: "Please enter a valid value!",
              },
            ]}
            name="sleeper_coach_id"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="booking_start_time"
            label="Booking Start Time"
            rules={[
              {
                required: true,
                message: "Please enter a valid value!",
              },
            ]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item
            name="booking_end_time"
            label="Booking End Time"
            rules={[
              {
                required: true,
                message: "Please enter a valid value!",
              },
            ]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Add Train
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default AddNewBookingInstance;
