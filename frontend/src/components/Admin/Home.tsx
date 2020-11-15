import { Button, List, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import Head from "../Head/head.component";

const adminRoutes = [
  {
    path: "/admin/trains/add/",
    name: "Add Trains",
  },
  {
    path: "/admin/coaches/add/",
    name: "Add Coaches",
  },
  {
    path: "/admin/trains/instance/add/",
    name: "Add Booking Instance",
  },
];
function AdminHome() {
  return (
    <div>
      <Head />
      <div style={{ width: "90vw", maxWidth: "500px", margin: "auto" }}>
        <Typography.Title style={{textAlign: 'center'}}>Admin Routes</Typography.Title>

        <List
          bordered
          dataSource={adminRoutes}
          renderItem={(item) => (
            <List.Item>
              <Link to={item.path}>
                <Button type="primary">{item.name}</Button>
              </Link>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}

export default AdminHome;
