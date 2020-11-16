import React, { CSSProperties, useEffect, useState } from "react";
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
  console.log(Object.keys(location.state as any));
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
      console.log(payload);

      message.warning(`Processing your details`, 2);
      await delay(1);

      message.loading(`Generating transaction Number`, 2);
      let transaction_number = Math.random()
        .toString(36)
        .substring(5)
        .repeat(2);
      await delay(1);

      message.info(`Thank you for your payment`, 2);
      await delay(1);

      message.loading(`Booking Tickets`, 2);
      await delay(1);

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
        <h1>Submit Passenger Details</h1>
        <>
          <div className="train-list-item">
            <TrainDetails {...data} />
          </div>

          <div>
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
                      console.log(passengers);
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
                  <div className='main-wrapper'>
                    {fields.map((field) => {
                      return (
                        <Space
                          key={field.key}
                          align="baseline"
                          className="passenger_instance_wrapper"
                        >
                          <Form.Item
                          className='passenger_instance'
                            shouldUpdate={(prevValues, curValues) =>
                              prevValues.area !== curValues.area ||
                              prevValues.sights !== curValues.sights
                            }
                          >
                            {() => (
                              <Form.Item
                                {...field}
                                label="Passenger Name"
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
                            label="Passenger Age"
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
                            rules={[{ required: true }]}
                          >
                            <Select
                              placeholder="Select a option"
                              allowClear
                            >
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

let keyStyle: CSSProperties = { fontWeight: "bold" };

function TrainDetails({
  train_number: train_num,
  train_name,
  source: src,
  destination: dest,
  journey_duration,
  sleeper_ticket_fare,
  ac_ticket_fare,
  journey_date,
  booking_end_time,
  booking_start_time,
  available_sleeper_tickets,
  available_ac_tickets,
}: any) {
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
      <Col span={24} style={{ textAlign: "left" }}>
        <Alert
          message={
            <div>
              <Col span={24}>
                <Row>
                  <Col style={keyStyle} span={8}>
                    Journey Duration:
                  </Col>
                  <Col span={16}>{`${moment
                    .duration(journey_duration)
                    .format("h [hours], m [minutes]")}
              `}</Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col style={keyStyle} span={8}>
                    Available Sleeper Tickets Count:
                  </Col>
                  <Col span={16}>{available_sleeper_tickets}</Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col style={keyStyle} span={8}>
                    Available AC Tickets Count:
                  </Col>
                  <Col span={16}>{available_ac_tickets}</Col>
                </Row>
              </Col>

              <Col span={24}>
                <Row>
                  <Col style={keyStyle} span={8}>
                    Sleeper Ticket Fare:
                  </Col>
                  <Col span={16}>{sleeper_ticket_fare}</Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col style={keyStyle} span={8}>
                    AC Ticket Fare
                  </Col>{" "}
                  <Col span={16}>{ac_ticket_fare}</Col>
                </Row>
              </Col>
              <Row>
                <Col span={24}>
                  <Row>
                    <Col style={keyStyle} span={8}>
                      Journey Date:
                    </Col>
                    <Col span={16}>
                      {new Date(journey_date).toLocaleDateString()}
                    </Col>
                  </Row>
                </Col>

                <Col span={24}>
                  <Row>
                    <Col style={keyStyle} span={8}>
                      Booking Start Time:{" "}
                    </Col>
                    <Col span={16}>
                      {new Date(booking_start_time).toLocaleString()}
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row>
                    <Col style={keyStyle} span={8}>
                      Booking End Time:{" "}
                    </Col>
                    <Col span={16}>
                      {new Date(booking_end_time).toLocaleString()}
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row>
                    <Col style={keyStyle} span={8}>
                      Status:{" "}
                    </Col>
                    <Col span={16}>
                      <Tag color={"#40960b"}>Active</Tag>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          }
        />
      </Col>
    </Card>
  );
}
