import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./loader.component.css";

const antIcon = (
  <LoadingOutlined
    style={{ fontSize: 90, color: "black", marginTop: "30vh" }}
    spin
  />
);

function Loader() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          textAlign: "center",
        }}
      >
        <Spin indicator={antIcon} />
      </div>
    </>
  );
}

export default Loader;
