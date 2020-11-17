import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Alert,
  Form,
  Row,
  Tag,
  Col,
  message,
  Input,
  Space,
  InputNumber,
  Select,
  Radio,
  Descriptions,
} from "antd";
import moment from "moment";
import { useHistory, useLocation } from "react-router-dom";

import Head from "../../Head/head.component";
import "./book.component.css";
import { EnvironmentFilled } from "@ant-design/icons";
import momentDurationFormatSetup from "moment-duration-format";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Option } from "antd/lib/mentions";
import { bookTicket, BookTicketSchema } from "../../../services/api";

momentDurationFormatSetup(moment as any);

interface dataSchema {
  train_name: string;
  train_number: string;
  source: string;
  destination: string;
  source_departure_time: string;
  journey_duration: string;
  sleeper_ticket_fare: string;
  ac_ticket_fare: string;
  booking_end_time: string;
  booking_start_time: string;
  journey_date: string;
  available_ac_tickets: string;
  available_sleeper_tickets: string;
}

function BookTickets() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const location = useLocation();
  const data: dataSchema = location.state as any;

  useEffect(() => {
    if (!data.train_number || !data.journey_date) {
      message.error(`Invalid Access`, 4);
      setTimeout(() => {
        history.push("/tickets/search/");
      }, 2500);
    }
  }, []);

  const history = useHistory();
  const [form] = Form.useForm();

  async function delay(seconds: number) {
    await new Promise((res, rej) => {
      setTimeout(() => {
        res(1);
      }, seconds * 1000);
    });
  }
  const handleSubmit = async (payload: any) => {
    try {
      setIsLoading(true);
      if (payload.passengers === undefined) {
        throw Error("Atleast add one passenger to continue");
      }

      message.warning(`Processing your details`, 2);
      await delay(1);

      message.loading(`Generating transaction Number`, 2);
      let transaction_number = Math.random()
        .toString(36)
        .substr(2, 8)
        .repeat(2);
      await delay(1);

      message.info(`Thank you for your payment`, 2);
      await delay(1);

      message.loading(`Booking Tickets`, 2);

      let numberOfPassengers = payload.passengers.length;
      let ticket_fare =
        ((payload.type === "Sleeper"
          ? data.sleeper_ticket_fare
          : data.ac_ticket_fare) as any) * numberOfPassengers;
      let reqPayload: BookTicketSchema = {
        ticket_fare,
        train_number: data.train_number,
        journey_date: new Date(data.journey_date),
        transaction_number,
        type: payload.type,
        passengers: payload.passengers,
        booking_type: 0,
      };
      let res = await bookTicket(reqPayload);
      if (res.data.error === true) {
        throw Error(res.data.message);
      }

      message.success(`Successfully booked tickets!`, 4);
      setTimeout(() => {
        history.push("/profile/");
      }, 2500);
    } catch (err) {
      setErrors(err.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="trains">
      <Head />
      <div className="train-list-wrapper">
        <h1>Add Passenger Details</h1>
        <>
          <div className="train-list-item">
            <TrainDetails {...data} />
          </div>

          <div className="form-wrapper">
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
                label="Coach Type"
                name="type"
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  <Radio.Button value="AC">AC</Radio.Button>
                  <Radio.Button value="Sleeper">Sleeper</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.List
                name="passengers"
                rules={[
                  {
                    validator: async (_, passengers) => {
                      if (!passengers || passengers.length < 1) {
                        return Promise.reject(
                          new Error(
                            "At least 1 passengers is needed to continue booking"
                          )
                        );
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <div className="main-wrapper">
                    {fields.map((field) => {
                      return (
                        <Space
                          key={field.key}
                          align="baseline"
                          className="passenger_instance_wrapper"
                        >
                          <Form.Item
                            className="passenger_instance"
                            shouldUpdate={(prevValues, curValues) =>
                              prevValues.area !== curValues.area ||
                              prevValues.sights !== curValues.sights
                            }
                          >
                            {() => (
                              <Form.Item
                                {...field}
                                label="Name"
                                name={[field.name, "passenger_name"]}
                                fieldKey={[field.fieldKey, "passenger_name"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Add a valid name",
                                  },
                                ]}
                              >
                                <Input />
                              </Form.Item>
                            )}
                          </Form.Item>
                          <Form.Item
                            {...field}
                            label="Age"
                            name={[field.name, "passenger_age"]}
                            fieldKey={[field.fieldKey, "passenger_age"]}
                            rules={[
                              {
                                required: true,
                                message: "Add a valid age",
                              },
                            ]}
                          >
                            <InputNumber />
                          </Form.Item>
                          <Form.Item
                            name={[field.name, "passenger_gender"]}
                            fieldKey={[field.fieldKey, "passenger_gender"]}
                            label="Gender"
                            rules={[
                              {
                                required: true,
                                message: "Enter a valid value",
                              },
                            ]}
                          >
                            <Select placeholder="Select" allowClear>
                              <Option value="male">male</Option>
                              <Option value="female">female</Option>
                              <Option value="other">other</Option>
                            </Select>
                          </Form.Item>
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                          />
                        </Space>
                      );
                    })}

                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add a passenger
                      </Button>
                      <br />
                      <div style={{ marginTop: "5px" }}>
                        <Form.ErrorList errors={errors} />
                      </div>
                    </Form.Item>
                  </div>
                )}
              </Form.List>

              <Form.Item style={{ textAlign: "center" }}>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  Proceed to payment
                </Button>
              </Form.Item>
            </Form>
          </div>
        </>
      </div>
    </div>
  );
}

export default BookTickets;

export function TrainDetails(props: any) {
  let {
    train_number: train_num,
    train_name,
    source: src,
    destination: dest,
    journey_duration,
    source_departure_time,
    sleeper_ticket_fare,
    ac_ticket_fare,
    journey_date,
    booking_end_time,
    booking_start_time,
    available_sleeper_tickets,
    available_ac_tickets,
    children,
  } = props;
  const rowStyle = {
    padding: "6px",
    fontSize: "1.1em",
  };

  return (
    <Card bodyStyle={{ padding: "12px 12px 12px 12px" }} hoverable={true}>
      <Row style={rowStyle}>
        <Col span={20}>
          <Tag color="#108ee9" style={{ fontSize: "1em" }}>
            {train_num}
          </Tag>
          <span style={{ fontWeight: "bold" }}>- {train_name}</span>
        </Col>
        <Col span={4}>
          <div className="seats-col-block">
            <Row>
              <Tag color={available_sleeper_tickets > 0 ? "#40960b" : "red"}>
                SL
              </Tag>
            </Row>
            <Row>
              <Tag color={available_ac_tickets > 0 ? "#40960b" : "red"}>AC</Tag>
            </Row>
          </div>
        </Col>
      </Row>
      <Row style={rowStyle}>
        <Col className="src-dest-row" span={8}>
          <div>
            <EnvironmentFilled />
            <span style={{ paddingLeft: "5px" }}>{src}</span>
          </div>
        </Col>
        <Col className="src-dest-row" style={{ textAlign: "center" }} span={8}>
          ...
        </Col>
        <Col className="src-dest-row" span={8} style={{ textAlign: "left" }}>
          <div>
            <EnvironmentFilled />
            <span style={{ paddingLeft: "5px" }}>{dest}</span>
          </div>
        </Col>
      </Row>
      <Col
        span={24}
        style={{ textAlign: "left" }}
        className="train-desc-wrapper"
      >
        <Descriptions layout="vertical" bordered={true}>
          <Descriptions.Item label="Journey Duration:">{`${moment
            .duration(journey_duration)
            .format("h [hours], m [minutes]")}`}</Descriptions.Item>
          <Descriptions.Item label="Available Sleeper Tickets Count:">
            {available_sleeper_tickets}
          </Descriptions.Item>
          <Descriptions.Item label="Available AC Tickets Count:">
            {available_ac_tickets}
          </Descriptions.Item>
          <Descriptions.Item label=" Source Departure Time:">
            {source_departure_time}
          </Descriptions.Item>
          <Descriptions.Item label="Journey Date:">
            {new Date(journey_date).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label=" Booking Start Time:">
            {" "}
            {new Date(booking_start_time).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label=" Booking End Time:">
            {new Date(booking_end_time).toLocaleString()}
          </Descriptions.Item>

          <Descriptions.Item label="Sleeper Ticket Fare:">
            {sleeper_ticket_fare}
          </Descriptions.Item>
          <Descriptions.Item label="AC Ticket Fare">
            {ac_ticket_fare}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag color={"#40960b"}>Active</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Col>
      <Col>
        <div style={{ textAlign: "right", marginTop: "15px" }}>{children}</div>
      </Col>
    </Card>
  );
}
