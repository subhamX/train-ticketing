import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Alert,
  Typography,
  InputNumber,
  DatePicker,
  Space,
} from "antd";
import "./addNewBookingInstance.component.css";
import Head from "../../Head/head.component";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { addNewBookingInstance } from "../../../services/api";
const { RangePicker } = DatePicker;

function AddNewBookingInstance() {
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [dates, setdates] = useState([] as any);
  const history = useHistory();

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      let {booking_timeline, ...payload}=data;
      let endTime = moment(dates[1]);
      let startTime = moment(dates[0]);
      if (startTime.isAfter(endTime)) {
        setErrors("Start Time should be less than end time");
        return;
      }
      payload.booking_end_time = endTime.toISOString();
      payload.booking_start_time = startTime.toISOString();

      let res = await addNewBookingInstance(payload);
      if (res.data.error === true) {
        throw Error(res.data.message);
      }
      setIsLoading(false);

      history.push("/");
    } catch (err) {
      setErrors(err.message);
      setIsLoading(false);
    }
  };

  const [form] = Form.useForm();

  function onOk(value: any) {
    let booking_start_time = null,
      booking_end_time = null;
    if (value[0])
      booking_start_time = moment(value[0]._d).format("YYYY-MM-DD HH:mm:ss");
    if (value[1])
      booking_end_time = moment(value[1]._d).format("YYYY-MM-DD HH:mm:ss");
    setdates([booking_start_time, booking_end_time]);
    form.setFieldsValue({
      booking_timeline: value[0] && value[1],
    });
  }
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
            <DatePicker />
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
            name="booking_timeline"
            label="Booking Timeline"
            rules={[
              {
                required: true,
                message: "Please choose a valid journey duration!",
              },
            ]}
          >
            <Space direction="vertical" size={12}>
              <RangePicker
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                onOk={onOk}
                placeholder={["Booking Start Time", "Booking End Time"]}
              />
            </Space>
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
