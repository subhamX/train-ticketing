import React from "react";
import Head from "../Head/head.component";
import { Card, Avatar, Table, Tag } from "antd";
import "./profile.component.css";
import { useSelector } from "react-redux";

function UserProfile() {
  const user = useSelector((state: any) => state.authReducer.user);
  return (
    <div>
      <Head />
      <div className="profile-container">
        <Card className="profile-card">
          <Card.Meta
            title={`Hello ${user.first_name}`}
            avatar={
              <Avatar
                size={80}
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              />
            }
          ></Card.Meta>
          <Table
            pagination={false}
            dataSource={[
              {
                key: "1",
                attribute: "First Name",
                value: user.first_name,
              },
              {
                key: "2",
                attribute: "Last Name",
                value: user.last_name,
              },
              {
                key: "3",
                attribute: "UserName",
                value: user.username,
              },
              {
                key: "4",
                attribute: "Email",
                value: user.email,
              },
              {
                key: "5",
                attribute: "Is Admin",
                value: user.is_admin ? 'True': 'False',
              },
            ]}
            showHeader={false}
            columns={[
              {
                title: null,
                dataIndex: "attribute",
                key: "attribute",
                render: (text) => <div>{text}</div>,
              },
              {
                title: null,

                dataIndex: "value",
                key: "value",
                render: (text) => <Tag color="green">{text}</Tag>,
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}

export default UserProfile;
