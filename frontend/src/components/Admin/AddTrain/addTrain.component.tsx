import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Alert,
  Typography,
  Space,
  DatePicker,
} from "antd";


import "./addTrain.component.css";
import { useHistory } from "react-router-dom";
import Head from "../../Head/head.component";
import { addNewTrain } from "../../../services/api";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

momentDurationFormatSetup(moment as any);

function AddTrain() {
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  const handleSubmit = async (payload: any) => {
    try {
      setIsLoading(true);
      let res = await addNewTrain({
        train_name: payload.train_name,
        train_number: payload.train_number.trim(),
        source: payload.source,
        destination: payload.destination,
        source_departure_time: payload.source_departure_time,
        sleeper_ticket_fare: payload.sleeper_ticket_fare,
        ac_ticket_fare: payload.ac_ticket_fare,        
        journey_duration: payload.journey_timeline,
      });

      if (res.data.error === true) {
        throw Error(res.data.message);
      }
      history.push("/");
    } catch (err) {
      setErrors(err.message);
      setIsLoading(false);
    }
  };

  function onOk(value: any) {
    let sourceDeparture = null,
      destinationArrival = null;
    if (value[0]) sourceDeparture = moment(value[0]._d);
    if (value[1]) destinationArrival = moment(value[1]._d);

    let journeyDur = moment.duration(destinationArrival?.diff(sourceDeparture));
    form.setFieldsValue({
      source_departure_time: sourceDeparture?.format("HH:mm:ss"),
      journey_duration: journeyDur.format(
        "h [hours], m [minutes]"
      ),
      journey_timeline: journeyDur.toISOString(),
    });
  }
  const { RangePicker } = DatePicker;
  const [form] = Form.useForm();
  return (
    <div>
      <Head />
      <div className="form-wrapper">
        <Typography.Title style={{ textAlign: "center" }}>
          Add Train
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
            name="train_name"
            label="Train Name"
            rules={[
              {
                required: true,
                message: "Please enter the Train Name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="source"
            label="Source Station"
            rules={[
              {
                required: true,
                message: "Please enter a valid Source City!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="destination"
            label="Destination Station"
            rules={[
              {
                required: true,
                message: "Please enter a valid Destination City!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="sleeper_ticket_fare"
            label="Sleeper Ticket Fare"
            rules={[
              {
                required: true,
                message: "Please enter a valid Sleeper Ticket Fare!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="ac_ticket_fare"
            label="AC Ticket Fare"
            rules={[
              {
                required: true,
                message: "Please enter a valid AC Ticket Fare!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          
          <Form.Item
            name="journey_timeline"
            label="Train Journey Timeline"
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
                placeholder={["Start Time", "End Time"]}
              />
              <Alert
                message={
                  "Please note that dates won't be stored and will be used to calculate the total journey time only"
                }
              />
            </Space>
          </Form.Item>
          <Form.Item name="source_departure_time" label="Source Departure Time">
            <Input disabled />
          </Form.Item>
          <Form.Item name="journey_duration" label="Journey Duration">
            <Input disabled />
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

export default AddTrain;
