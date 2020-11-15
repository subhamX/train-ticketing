import React from "react";
import Head from "../Head/head.component";
import { Card, Avatar, Table, Tag, Typography, Alert } from "antd";
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
            title={<Typography.Title>{`Hello ${user.first_name}`}</Typography.Title>}
            avatar={
              <Avatar
                size={80}
                src="https://img.icons8.com/pastel-glyph/128/000000/person-male.png"
              />
            }
          ></Card.Meta>
          <br/>
          <Alert message='Please find your details below'/>
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
