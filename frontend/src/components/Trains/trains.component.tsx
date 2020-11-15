import React from "react";
import { Card, Row, Col, Tag, Divider, Skeleton } from "antd";
import { EnvironmentFilled } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

import Head from "../Head/head.component";
import "./trains.component.css";

function AllTrains() {
  const history = useHistory();
  return (
    <div className="trains">
      <Head />
      <div className="train-list-wrapper">
        <h1>Trains</h1>
        <div className="train-list-item">
          <TrainListItem history={history} />
        </div>
        <div className="train-list-item">
          <TrainListItem history={history} />
        </div>
        <div className="train-list-item">
          <TrainListItem history={history} />
        </div>
        <div className="train-list-item">
          <TrainListItem history={history} />
        </div>
        <div className="train-list-item">
          <TrainListItem history={history} />
        </div>
        <div className="train-list-item">
          <TrainListItem history={history} />
        </div>
        <div className="train-list-item">
          <TrainListItem history={history} />
        </div>
      </div>
    </div>
  );
}

export default AllTrains;

function TrainListItem({ history }: any) {
  const cardStyle = {
    width: "60vw",
    height: "15vh",
  };

  const rowStyle = {
    marginLeft: "2.0vw",
    marginRight: "2.0vw",
    padding: "6px",
    fontSize: "1.1em",
  };

  // update all the vals
  const train_num = 134;
  const train_name = "Hello World Train";
  const src = " src";
  const dest = " dest";

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
      style={cardStyle}
      bodyStyle={{ padding: "12px 12px 12px 12px" }}
      hoverable={true}
      onClick={() => {
        history.push(`info/${train_num}`);
      }}
    >
      <Row>
        <Col span={20}>
          <Row style={rowStyle}>
            <Tag color="#108ee9" style={{ fontSize: "1em" }}>
              {train_num}
            </Tag>
            <span>- {train_name}</span>
          </Row>
          <Row style={rowStyle}>
            <Col className="src-dest-row" span={20}>
              <div>
                <EnvironmentFilled />
                {src}
              </div>
              <div>...</div>
              <div>
                <EnvironmentFilled />
                {dest}
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={4} className="seats-col">
          <div className="seats-col-block">
            {ACAvail}
            {SLAvail}
          </div>
        </Col>
      </Row>
    </Card>
  );
}
