import React, { useEffect, useState } from "react";
import {  Button, Alert, Spin,  Col, message } from "antd";
import moment from "moment";
import { useHistory, useLocation } from "react-router-dom";

import Head from "../../Head/head.component";
import "./ticketSearchResult.component.css";
import { queryTrainsInstances } from "../../../services/api";
import momentDurationFormatSetup from "moment-duration-format";
import { TrainDetails } from "../book/book.component";

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


function TrainListItem(props: any) {
  const history = useHistory();

  return (
    <div>
      <TrainDetails {...props}>
        <Col span={24}>
          <Button
            type="primary"
            onClick={() => {
              message.loading('Redirecting to bookings portal', 0.5)
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
