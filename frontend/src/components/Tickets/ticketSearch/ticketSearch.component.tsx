import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Button,
  DatePicker,
  Typography,
  AutoComplete,
  Alert,
} from "antd";
import moment from "moment";
import { useHistory } from "react-router-dom";

import Head from "../../Head/head.component";
import "./ticketSearch.component.css";
import { useDispatch, useSelector } from "react-redux";
import { getCities } from "../../../services/actions/tickets";

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

export function extractStationCode(name:string){
  let code:any=(name.match(/(\(\w+\))/)as any) ;
  if(code==null){
    return name;
  }
  return code[0].slice(1, code[0].length-1)
}
function SearchCard() {
  const history = useHistory();
  const [form] = Form.useForm();
  const [errors, setErrors] = useState("");
  const cities = useSelector((state: any) => state.ticketsReducer.cities);

  const dispatch = useDispatch();

  const HandleSubmit = (payload: any) => {
    if (payload.source === payload.destination) {
      setErrors("Source and Destination cannot be same");
      return;
    }
    let date = moment(payload.journey_date).format("DD-MM-YYYY");
    payload.journey_date = date;
    
    history.push(
      `/tickets/listing?source=${extractStationCode(payload.source)}&dest=${extractStationCode(payload.destination)}&date=${payload.journey_date}`
    );
  };

  useEffect(() => {
    dispatch(getCities());
  }, [dispatch]);
  const onChangeHandler = (key: string, value: any) => {
    let newObject: any = {};
    newObject[key] = value;
    form.setFieldsValue(newObject);
  };
  return (
    <div>
      <Card
        className="search-card search-card-wrapper"
        style={{ height: "57vh", padding: "0 0 0 0" }}
      >
        <Card className="search-card-inside">
          <Typography.Title
            style={{ textAlign: "center", paddingBottom: "10px" }}
          >
            Search Trains
          </Typography.Title>
          {errors ? (
            <Form.Item>
              <Alert message={errors} type="error" />
            </Form.Item>
          ) : null}
          <Form
            form={form}
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
                    <AutoInput
                      cities={cities}
                      placeholder="Source City"
                      classNme="source"
                      onChangeHandler={onChangeHandler}
                    />
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
                    <AutoInput
                      cities={cities}
                      placeholder="City name"
                      classNme="destination"
                      onChangeHandler={onChangeHandler}
                    />
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
                      className="journey_date"
                      disabledDate={(current) =>
                        current && current < moment().subtract(1, "day")
                      }
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

const { Option } = AutoComplete;

const AutoInput = ({ cities, classNme, placeholder, onChangeHandler }: any) => {
  const [result, setResult] = useState<string[]>([]);
  const handleSearch = (value: string) => {
    let res: string[] = [];
    if (!value) {
      res = [];
    } else {
      res = cities.filter((e: string) => {
        return e.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      });
    }
    setResult(res);
  };
  return (
    <AutoComplete
      onChange={(e) => onChangeHandler(classNme, e)}
      onSearch={handleSearch}
      placeholder={placeholder}
      className={classNme}
    >
      {result.map((email: string) => (
        <Option key={email} value={email}>
          {email}
        </Option>
      ))}
    </AutoComplete>
  );
};
