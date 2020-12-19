import React, { useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Tag,
  Spin,
  Collapse,
  Button,
  Alert,
  Descriptions,
} from "antd";
import { EnvironmentFilled, BranchesOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

import Head from "../Head/head.component";
import "./trains.component.css";
import { useDispatch, useSelector } from "react-redux";
import { getTrainInstance, getTrains } from "../../services/actions/trains";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

momentDurationFormatSetup(moment as any);

const { Panel } = Collapse;

function AllTrains() {
  let { trains, fetching_trains: is_loading } = useSelector(
    (state: any) => state.trainsReducer
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTrains());
  }, [dispatch]);

  const container = {
    width: "100vw",
    height: "fit-content",
    maxWidth: "800px",
  };
  const history = useHistory();
  return (
    <div className="trains">
      <Head />
      <div className="train-list-wrapper">
        <h1>Trains</h1>
        {is_loading ? (
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
              <Collapse bordered={false} className="collapse_card_wrapper">
                {trains &&
                  trains.map((train: any) => {
                    return (
                      <Panel
                        style={container}
                        showArrow={false}
                        key={train.train_number}
                        header={<TrainListItem history={history} {...train} />}
                      >
                        <TrainInstances
                          trainNumber={train.train_number}
                          {...train}
                          history={history}
                        />
                      </Panel>
                    );
                  })}
              </Collapse>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AllTrains;

function TrainInstances(props: any) {
  let { trainNumber, history, ...extra } = props;
  const dispatch = useDispatch();
  const { instances, loaded } = useSelector((state: any) => {
    return {
      loaded:
        state.trainsReducer.train_instances_loading.find(
          (e: any) => e === trainNumber
        ) === undefined,
      instances: state.trainsReducer.instances[trainNumber],
    };
  });
  useEffect(() => {
    dispatch(getTrainInstance(trainNumber));
  }, [dispatch, trainNumber]);

  return (
    <div>
      {!loaded ? (
        <div style={{ textAlign: "center" }}>
          <Spin tip="Loading Train Instances"></Spin>
        </div>
      ) : (
        <>
          {instances && instances.length === 0 ? (
            <Alert message="No Booking Instances Found" type="warning" />
          ) : null}
          <div className="trains-wrapper">
            {instances &&
              instances.map((data: any, index: any) => {
                let {
                  journey_date,
                  available_ac_tickets,
                  booking_start_time,
                  booking_end_time,
                  status,
                  available_sleeper_tickets,
                } = data;
                return (
                  <>
                    <Card
                      key={index}
                      className="train_instance_card"
                    >
                      <Descriptions
                        layout="vertical"
                        bordered={true}
                        size="small"
                        column={1}
                        title={
                          <>
                            {" "}
                            <BranchesOutlined />
                            {index + 1}{" "}
                          </>
                        }
                      >
                        <Descriptions.Item label="Available Sleeper Tickets Count:">
                          {available_sleeper_tickets}
                        </Descriptions.Item>
                        <Descriptions.Item label="Available AC Tickets Count:">
                          {available_ac_tickets}
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

                        <Descriptions.Item label="Status">
                          {data.status === "active" ? (
                            <>
                              <Button
                                type="primary"
                                onClick={() => {
                                  history.push({
                                    pathname: "/tickets/book/",
                                    state: {
                                      ...extra,
                                      ...data,
                                    },
                                  });
                                }}
                              >
                                Book Now
                              </Button>
                            </>
                          ) : (
                            <Button
                              style={{
                                color:
                                  data.status === "inactive" ? "grey" : "red",
                              }}
                              disabled={true}
                            >
                              {status.toUpperCase()}
                            </Button>
                          )}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                    {/* <Divider  className='train_instance_divider'/> */}
                  </>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}

function TrainListItem({
  history,
  train_number: train_num,
  train_name,
  source: src,
  destination: dest,
  journey_duration,
  sleeper_ticket_fare,
  ac_ticket_fare,
  source_departure_time,
}: any) {
  const rowStyle = {
    padding: "6px",
    fontSize: "1.1em",
  };

  // show if AC coach is in the train
  const ACAvail = true ? (
    <Row>
      <Tag color="#40960b">AC</Tag>
    </Row>
  ) : null;

  // show if SL coach is in the train
  const SLAvail = true ? (
    <Row>
      <Tag color="#40960b">SL</Tag>
    </Row>
  ) : null;

  return (
    <Card
      hoverable
      className="train_instance_card_wrapper"
      bodyStyle={{ padding: "12px 12px 12px 12px" }}
    >
      <Row style={rowStyle}>
        <Col span={20}>
          <Tag color="#108ee9" style={{ fontSize: "1em" }}>
            {train_num}
          </Tag>
          <span style={{ fontWeight: "bold" }}>- {train_name}</span>
        </Col>
        <Col span={4}>
          <div className="seats-col-block">
            {ACAvail}
            {SLAvail}
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
      <Col span={24}>
        <div style={{}}>
          <Descriptions layout="vertical" bordered={true}>
            <Descriptions.Item label="Journey Duration:">{`${moment
              .duration(journey_duration)
              .format("h [hours], m [minutes]")}`}</Descriptions.Item>
            <Descriptions.Item label="Sleeper Ticket Fare:">
              {sleeper_ticket_fare}
            </Descriptions.Item>
            <Descriptions.Item label="AC Ticket Fare">
              {ac_ticket_fare}
            </Descriptions.Item>
            <Descriptions.Item label=" Source Departure Time:">
              {source_departure_time}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Col>
      <Col
        span={24}
        style={{
          color: "grey",
          fontSize: "12px",
          fontStyle: "italic",
          textAlign: "center",
          marginTop: "8px",
        }}
      >
        Tap on this card to look for available booking instances
      </Col>
    </Card>
  );
}
