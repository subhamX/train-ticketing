import React, { useEffect, useState } from "react";
import Head from "../Head/head.component";
import {
  Card,
  Avatar,
  Table,
  Typography,
  Alert,
  List,
  Button,
  Spin,
  Collapse,
  Divider,
  Switch,
  Form,
  message,
  Descriptions,
} from "antd";
import "./profile.component.css";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelTicketsAction,
  getAllTicketsAction,
  getTicketsInfoAction,
} from "../../services/actions/tickets";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import Modal from "antd/lib/modal/Modal";
import { LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

momentDurationFormatSetup(moment as any);
const { Panel } = Collapse;

function UserProfile() {
  const { user, tickets, tickets_list_loading: ticketsLoading } = useSelector(
    (state: any) => {
      return {
        user: state.authReducer.user,
        tickets: state.ticketsReducer.tickets,
        tickets_list_loading: state.ticketsReducer.tickets_list_loading,
      };
    }
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllTicketsAction());
  }, []);

  return (
    <div>
      <Head />
      <div className="profile-container">
        <Card className="profile-card">
          <Card.Meta
            title={
              <div
                style={{ fontSize: "1.75rem" }}
              >{`Hello ${user.first_name}`}</div>
            }
            avatar={
              <Avatar
                size={80}
                src="https://img.icons8.com/pastel-glyph/128/000000/person-male.png"
              />
            }
          ></Card.Meta>
          <Alert message="Please find your details below" />
          <Divider />

          <Descriptions bordered size="middle">
            <Descriptions.Item label="First Name" span={24}>
              {user.first_name}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name" span={24}>
              {user.last_name}
            </Descriptions.Item>
            <Descriptions.Item label="UserName" span={24}>
              {user.username}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={24}>
              {user.email}
            </Descriptions.Item>
            <Descriptions.Item label="Is Admin" span={24}>
              {user.is_admin ? "True" : "False"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
      <br />

      <div style={{ width: "80vw", maxWidth: "800px", margin: "auto" }}>
        <Typography.Title>My Tickets</Typography.Title>
        {tickets && tickets.length !== 0 ? (
          <Alert
            type="success"
            message="Tap on any card to see the passenger details"
          />
        ) : (
          <Alert
            type="warning"
            message={
              <div>
                No tickets found! Click <Link to="/tickets/search/">here</Link>{" "}
                to book a new ticket
              </div>
            }
          />
        )}
        <Divider dashed={true} />
        {!ticketsLoading ? (
          <div>
            <List
              itemLayout="vertical"
              size="large"
              dataSource={tickets}
              renderItem={(item: any) => {
                return (
                  <Collapse className="ticket-wrapper">
                    <Panel
                      showArrow={false}
                      key={item.pnr_number}
                      header={
                        <List.Item key={item.pnr_number}>
                          <List.Item.Meta
                            avatar={
                              <Avatar src="https://img.icons8.com/clouds/100/000000/train.png" />
                            }
                            title={
                              <div>
                                <span style={{ color: "rosybrown" }}>
                                  PNR Number:
                                </span>{" "}
                                {item.pnr_number.toUpperCase()}
                              </div>
                            }
                            description={
                              <div
                                style={{ color: "#007bff", fontWeight: "bold" }}
                              >
                                <span>Train Number: </span>
                                {item.train_number}
                              </div>
                            }
                          />
                          <div className="ticket_item_wrapper">
                            <div className="ticket_item">
                              <span>Train Name: </span>
                              {item.train_name}
                            </div>
                            <div className="ticket_item">
                              <span>Source: </span>
                              {item.source}
                            </div>

                            <div className="ticket_item">
                              <span>Destination: </span>
                              {item.destination}
                            </div>
                            <div className="ticket_item">
                              <span>Ticket Fare: </span>
                              {item.ticket_fare}
                            </div>

                            <div className="ticket_item">
                              <span>Journey Date: </span>
                              {new Date(item.journey_date).toLocaleDateString()}
                            </div>

                            <div className="ticket_item">
                              <span>Journey Duration: </span>
                              {`${moment
                                .duration(item.journey_duration)
                                .format("h [hours], m [minutes]")}`}
                            </div>

                            <div className="ticket_item">
                              <span>Source Departure Time: </span>
                              {item.source_departure_time}
                            </div>

                            <div className="ticket_item">
                              <span>Refund Amount: </span>
                              {item.refund_amount}
                            </div>
                            <div className="ticket_item">
                              <span>Transaction Number: </span>
                              {item.transaction_number.toUpperCase()}
                            </div>
                          </div>
                          <div
                            className=""
                            style={{
                              color: "blue",
                              marginTop: "5px",
                              textAlign: "left",
                            }}
                          >
                            <span>Time of Booking: </span>
                            {new Date(item.time_of_booking).toLocaleString()}
                          </div>
                        </List.Item>
                      }
                    >
                      <Passengers pnrNumber={item.pnr_number} />
                    </Panel>
                  </Collapse>
                );
              }}
            />
            ,
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Spin indicator={antIcon} />
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;

const columns = [
  {
    title: "Name",
    dataIndex: "passenger_name",
  },
  {
    title: "Age",
    dataIndex: "passenger_age",
  },
  {
    title: "Gender",
    dataIndex: "passenger_gender",
    render: (text: any) => `${text.toUpperCase()}`,
  },
  {
    title: "Seat No.",
    dataIndex: "seat_number",
    render: (text: any) => `${text}`,
  },
  {
    title: "Coach No.",
    dataIndex: "coach_number",
    render: (text: any) => `${text}`,
  },
];
//
// const config = ;
function Passengers(props: any) {
  const { pnrNumber } = props;
  const [modal, contextHolder] = Modal.useModal();

  const dispatch = useDispatch();
  const [cancelTicket, setcancelTicket] = useState(false);
  const [cancelPayload, setcancelPayload] = useState([] as any);
  const {
    activeInstances,
    cancelledInstances,
    loaded,
    isCancelling,
  } = useSelector((state: any) => {
    let tempInstance: [] | any = state.ticketsReducer.berths[pnrNumber];
    let cancelledInstances: [] | any = [],
      activeInstances: [] | any = [];
    if (tempInstance) {
      tempInstance = tempInstance.map((e: any) => {
        return { ...e, key: `${e.coach_number}_${e.seat_number}` };
      });
      cancelledInstances = tempInstance.filter((e: any) => {
        return e.is_cancelled === 1;
      });
      activeInstances = tempInstance.filter((e: any) => {
        return e.is_cancelled === 0;
      });
    }
    return {
      loaded:
        state.ticketsReducer.loadingTickets.find(
          (e: any) => e === pnrNumber
        ) === undefined,
      isCancelling:
        state.ticketsReducer.isCancellingTicket.find(
          (e: any) => e === pnrNumber
        ) !== undefined,
      activeInstances,
      cancelledInstances,
    };
  });
  useEffect(() => {
    dispatch(getTicketsInfoAction(pnrNumber));
  }, []);

  const handleSubmit = async () => {
    try {
      dispatch(
        cancelTicketsAction({ pnr_number: pnrNumber, seats: cancelPayload })
      );
    } catch (err) {
      message.error(err.message, 2);
    }
  };
  return (
    <>
      {loaded ? (
        <>
          {" "}
          <div>
            {activeInstances && activeInstances.length !== 0 ? (
              <>
                <Form.Item label="Cancel Tickets View" valuePropName="checked">
                  <Switch
                    style={{ marginLeft: "5px" }}
                    onChange={(e) => {
                      setcancelTicket(e);
                    }}
                  />
                </Form.Item>
                <Divider />
                <Alert message="Confirmed Seats" type="warning" />
                <Table
                  scroll={{ x: true }}
                  loading={!loaded}
                  rowSelection={
                    cancelTicket
                      ? {
                          type: "checkbox",
                          onChange: (e) => {
                            let selected: any = [];
                            e.forEach((elem: any) => {
                              let [coach_number, seat_number] = elem.split("_");
                              seat_number = parseInt(seat_number);
                              selected.push({
                                coach_number,
                                seat_number,
                              });
                            });
                            setcancelPayload(selected);
                          },
                        }
                      : undefined
                  }
                  columns={columns}
                  dataSource={activeInstances}
                  pagination={false}
                />
                {cancelTicket ? (
                  <>
                    <Divider />

                    <Button
                      type="primary"
                      disabled={cancelPayload.length === 0}
                      loading={isCancelling}
                      onClick={async () => {
                        modal.confirm({
                          title:
                            "Are you sure you want to delete the selected tickets? This action is irreversible!",
                          onOk() {
                            handleSubmit();
                          },
                        });
                      }}
                    >
                      Cancel Tickets
                    </Button>
                  </>
                ) : null}
              </>
            ) : null}

            {cancelledInstances && cancelledInstances.length !== 0 ? (
              <>
                <Divider />
                <Alert message="Cancelled Seats" type="warning" />
                <Table
                  scroll={{ x: true }}
                  loading={!loaded}
                  columns={columns}
                  dataSource={cancelledInstances}
                  pagination={false}
                />
              </>
            ) : null}

            {contextHolder}
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <Spin indicator={antIcon} />
        </div>
      )}
    </>
  );
}
