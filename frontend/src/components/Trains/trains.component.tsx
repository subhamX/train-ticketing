import React, { CSSProperties, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Tag,
  Spin,
  Collapse,
  Button,
} from "antd";
import { EnvironmentFilled } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

import Head from "../Head/head.component";
import "./trains.component.css";
import { useDispatch, useSelector } from "react-redux";
import { getTrainInstance, getTrains } from "../../services/actions/trains";

const { Panel } = Collapse;

function AllTrains() {
  const {
    trains,
    fetching_trains: is_loading,
    fetching_train_instances: train_instance_loading,
  } = useSelector((state: any) => state.trainsReducer);
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
          <div className="train-list-item">
            <Collapse>
              {trains &&
                trains.map((train: any) => {
                  return (
                    <Panel
                      style={container}
                      showArrow={false}
                      key={train.train_number}
                      header={
                        <TrainListItem
                          history={history}
                          train_num={train.train_number}
                          train_name={train.train_name}
                          dest={train.destination}
                          src={train.source}
                        />
                      }
                    >
                      {train_instance_loading ? (
                        <Spin tip="Loading Trains"></Spin>
                      ) : (
                        <TrainInstances trainNumber={train.train_number} />
                      )}
                    </Panel>
                  );
                })}
            </Collapse>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllTrains;

function TrainInstances({ trainNumber }: any) {
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


  let keyStyle: CSSProperties = { fontWeight: "bold" };
  return (
    <div>
      {!loaded ? (
        <Spin></Spin>
      ) : (
        <>
          {instances &&
            instances.map((data: any, index: any) => {
              return (
                <Card style={{ fontSize: "15px" }} key={index}>
                  <Row>
                    <Col span={24}>
                      <Row>
                        <Col style={keyStyle} span={8}>
                          Sleeper Ticket Fare:
                        </Col>
                        <Col span={16}>{data.sleeper_ticket_fare}</Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row>
                        <Col style={keyStyle} span={8}>
                          Journey Date:
                        </Col>
                        <Col span={16}>
                          {new Date(data.journey_date).toLocaleDateString()}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row>
                        <Col style={keyStyle} span={8}>
                          AC Ticket Fare:
                        </Col>{" "}
                        <Col span={16}>{data.ac_ticket_fare}</Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row>
                        <Col style={keyStyle} span={8}>
                          Booking Start Time:{" "}
                        </Col>
                        <Col span={16}>
                          {new Date(data.booking_start_time).toLocaleString()}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row>
                        <Col style={keyStyle} span={8}>
                          Booking End Time:{" "}
                        </Col>
                        <Col span={16}>
                          {new Date(data.booking_end_time).toLocaleString()}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row>
                        <Col style={keyStyle} span={8}>
                          Status:{" "}
                        </Col>
                        <Col span={16}>
                          <Tag
                            color={
                              data.status === "active"
                                ? "#40960b"
                                : data.status === "inactive"
                                ? "grey"
                                : "red"
                            }
                          >
                            {data.status.toUpperCase()}
                          </Tag>
                        </Col>
                      </Row>
                    </Col>
                    <hr />
                    {data.status === "active" ? (
                      <Col span={24}>
                        <Button type="primary">Book Now</Button>
                      </Col>
                    ) : null}
                  </Row>
                </Card>
              );
            })}
        </>
      )}
    </div>
  );
}

function TrainListItem({ history, train_num, train_name, src, dest }: any) {
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
      <Col
        span={24}
        style={{ color: "grey", fontStyle: "italic", textAlign: "center" }}
      >
        Tap on this card to look for available booking instances
      </Col>
    </Card>
  );
}
