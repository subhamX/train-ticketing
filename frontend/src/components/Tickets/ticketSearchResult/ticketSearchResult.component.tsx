import React, { useEffect, useState } from "react";
import {
  Button,
  Alert,
  Spin,
  Col,
  message,
  Form,
  DatePicker,
} from "antd";
import moment from "moment";
import { useHistory, useLocation } from "react-router-dom";
import { extractStationCode } from "../ticketSearch/ticketSearch.component";
import Head from "../../Head/head.component";
import "./ticketSearchResult.component.css";
import { queryTrainsInstances } from "../../../services/api";
import momentDurationFormatSetup from "moment-duration-format";
import { TrainDetails } from "../book/book.component";
import { AutoInput } from "../AutoInput";
import { useDispatch, useSelector } from "react-redux";
import { getCities } from "../../../services/actions/tickets";

momentDurationFormatSetup(moment as any);

function AllTrains() {
  const [isLoading, setisLoading] = useState(true);
  const [trains, setTrains] = useState([]);
  const [oldFormValue, setoldFormValue] = useState({});
  const cities = useSelector((state: any) => state.ticketsReducer.cities);
  const dispatch = useDispatch();

  const location = useLocation();

  useEffect(() => {
    let params = new URLSearchParams(location.search);
    dispatch(getCities());
    let source = params.get("source") ?? "";
    let dest = params.get("dest") ?? "";
    let date = params.get("date") ?? "";

    // TODO: Check if date etc all are in correct format
    if (source === "" || dest === "" || date === "") {
      message.error(
        `Invalid source city or destination city or date of journey`,
        2
      );
    } else {
      form.setFieldsValue({
        source,
        destination: dest,
        journey_date: moment(date, ["DD-MM-YYYY", "DD/MM/YYYY"]),
      });
      // get data
      getData(source, dest, date);
    }
  }, [location.search]);

  const getData = (source: string, destination: string, date: string) => {
    setoldFormValue({ source, destination, date });
    setisLoading(true);
    setTrains([]);
    queryTrainsInstances({ source, destination, date })
      .then((e) => {
        if (e.data.error === true) {
          throw Error(e.data.message);
        }
        setTrains(e.data.data);
        setisLoading(false);
      })
      .catch((err) => {
        message.error(err.message, 2);
        setisLoading(false);
      });
  };
  const history=useHistory();
  const onChangeHandler = (key: any, value: any) => {
    let newObject: any = {};
    newObject[key] = value;
    form.setFieldsValue(newObject);
  };
  const [form] = Form.useForm();
  const handleSubmitWrapper = async (payload: {
    source: string;
    destination: string;
    journey_date: any;
  }) => {
    if (payload === oldFormValue) {
      message.error("Please change the fields", 2);
    } else {
      if (payload.source === payload.destination) {
        message.error("Source and Destination cannot be same", 2);
        return;
      }
      let date = moment(payload.journey_date).format("DD-MM-YYYY");
      payload.journey_date = date;

      history.push(
        `/tickets/listing?source=${extractStationCode(
          payload.source
        )}&dest=${extractStationCode(payload.destination)}&date=${
          payload.journey_date
        }`
      );
    }
  };
  return (
    <div className="trains">
      <Head />
      <div className="train-list-wrapper">
        <h1>Train Results</h1>
        <Form
          form={form}
          layout={"horizontal"}
          className="train-form-results"
          onFinish={handleSubmitWrapper}
        >
          <Form.Item
            label="Source"
            name="source"
            rules={[
              {
                required: true,
                message: "Please select a valid source city!",
              },
            ]}
          >
            <AutoInput
              initialVal={form.getFieldValue("source")}
              data={cities}
              placeholder="New Delhi"
              classNme="source"
              onChangeHandler={onChangeHandler}
            />
          </Form.Item>
          <Form.Item
            label="Destination"
            name="destination"
            rules={[
              {
                required: true,
                message: "Please select a valid destination city!",
              },
            ]}
          >
            <AutoInput
              initialVal={form.getFieldValue("destination")}
              data={cities}
              placeholder="Rupnagar"
              classNme="destination"
              onChangeHandler={onChangeHandler}
            />
          </Form.Item>
          <div className="date-input">
            <Form.Item
              label="Journey Date:"
              className="date-input"
              name="journey_date"
              rules={[
                {
                  required: true,
                  message: "Please select a journey date",
                },
              ]}
            >
              <DatePicker
                className="journey_date"
                disabledDate={(current) =>
                  current && current < moment().subtract(1, "day")
                }
              />
            </Form.Item>
          </div>
          <br />
          <Form.Item>
            <Button loading={isLoading} htmlType="submit" type="primary">
              Search For Trains
            </Button>
          </Form.Item>

          <br />
        </Form>
        {isLoading ? (
          <Spin tip="Loading Trains"></Spin>
        ) : (
          <>
            {trains && trains.length === 0 ? (
              <Alert
                style={{ width: "80%", padding: "30px", textAlign: "center" }}
                message="No Trains Found"
                type="warning"
              />
            ) : null}
            <div className="train-list-item">
              {trains &&
                trains.map((train: any) => {
                  return <TrainListItem key={train.train_number} {...train} />;
                })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AllTrains;

function TrainListItem(props: any) {
  const history = useHistory();

  return (
    <div>
      <TrainDetails {...props}>
        <Col span={24}>
          <Button
            type="primary"
            onClick={() => {
              message.loading("Redirecting to bookings portal", 0.5);
              setTimeout(() => {
                history.push({
                  pathname: "/tickets/book/",
                  state: {
                    ...props,
                  },
                });
              }, 500);
            }}
          >
            Book Now
          </Button>
        </Col>
      </TrainDetails>

      {/* <Col span={24} style={{ textAlign: "left" }}>
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
                <hr />
                
              </Row>
            </div>
          }
        />
      </Col> */}
    </div>
  );
}
