import React from "react";
import { Card, Form, Input, Button, DatePicker, Typography } from "antd";
import moment from "moment";
import { useHistory } from "react-router-dom";

import Head from "../../Head/head.component";
import "./ticketSearchResult.component.css";

function TicketSearch() {
  return (
    <div>
      <Head />
      <div className="ts-container">
        <SearchCard />
      </div>
    </div>
  );
}

export default TicketSearch;

function SearchCard() {
  const history = useHistory();
  const HandleSubmit = (payload: any) => {
    let date = moment(payload.journey_date).format("DD-MM-YYYY");
    payload.journey_date = date;
    history.push(
      `listing?source=${payload.source}&dest=${payload.destination}&date=${payload.journey_date}`
    );
  };

  return (
    <div>
      <Card
        className="search-card"
        style={{ height: "57vh", padding: "0 0 0 0" }}
      >
        <Card className="search-card-inside" style={{ height: "50vh" }}>
          <Typography.Title
            style={{ textAlign: "center", paddingBottom: "10px" }}
          >
            Search Trains
          </Typography.Title>
          <Form
            name="search_trains"
            className="search-form"
            autoComplete="off"
            onFinish={HandleSubmit}
          >
            <div className="card-form">
              <div className="card-input-row">
                <div className="src-input">
                  <span>From: </span>
                  <Form.Item
                    name="source"
                    rules={[
                      { required: true, message: "Please select a City!" },
                    ]}
                  >
                    <Input placeholder="City name" />
                  </Form.Item>
                </div>
                <div className="dest-input">
                  <span>To:</span>
                  <Form.Item
                    name="destination"
                    rules={[
                      { required: true, message: "Please select a city!" },
                    ]}
                  >
                    <Input placeholder="City name" />
                  </Form.Item>
                </div>
                <div className="date-input">
                  <span>Journey Date:</span>
                  <Form.Item
                    name="journey_date"
                    rules={[
                      {
                        required: true,
                        message: "Please select a journey date",
                      },
                    ]}
                  >
                    <DatePicker
                      disabledDate={(current) => (
                        current && current < moment().subtract(1, "day")
                      )}
                    />
                  </Form.Item>
                </div>
              </div>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  <strong>Search</strong>
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Card>
      </Card>
    </div>
  );
}
