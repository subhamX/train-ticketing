import React, { CSSProperties, useEffect, useState } from "react";
import { Card, Button, Alert, Spin, Row, Tag, Col, message } from "antd";
import moment from "moment";
import { useHistory, useLocation } from "react-router-dom";

import Head from "../../Head/head.component";
import "./ticketSearchResult.component.css";
import { EnvironmentFilled } from "@ant-design/icons";
import { queryTrainsInstances } from "../../../services/api";
import momentDurationFormatSetup from "moment-duration-format";

momentDurationFormatSetup(moment as any);

function AllTrains() {
  const [isLoading, setisLoading] = useState(true);
  const [trains, setTrains] = useState([]);

  const location = useLocation();

  useEffect(() => {
    let params = new URLSearchParams(location.search);

    let source = params.get("source") ?? "";
    let dest = params.get("dest") ?? "";
    let date = params.get("date") ?? "";

    if (source === "" || dest === "" || date === "") {
      message.error(
        `Invalid source city or destination city or date of journey`,
        4
      );
      setTimeout(() => {
        history.push("/tickets/search/");
      }, 2500);
    } else {
      // get data
      queryTrainsInstances({ source, destination: dest, date })
        .then((e) => {
          if (e.data.error === true) {
            throw Error(e.data.message);
          }
          setTrains(e.data.data);
          setisLoading(false);
        })
        .catch((err) => {
          message.error(err.message, 4);
          setTimeout(() => {
            history.push("/tickets/search/");
          }, 2500);
        });
    }
  }, []);

  const history = useHistory();

  return (
    <div className="trains">
      <Head />
      <div className="train-list-wrapper">
        <h1>Train Results</h1>
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

let keyStyle: CSSProperties = { fontWeight: "bold" };

function TrainListItem(props: any) {
  let {
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
  } = props;
  const rowStyle = {
    padding: "6px",
    fontSize: "1.1em",
  };
  const history = useHistory();

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
                <hr />
                <Col span={24}>
                  <Button
                    type="primary"
                    onClick={() => {
                      history.push({
                        pathname: "/tickets/book/",
                        state: {
                          ...props,
                        },
                      });
                    }}
                  >
                    Book Now
                  </Button>
                </Col>
              </Row>
            </div>
          }
        />
      </Col>
    </Card>
  );
}
