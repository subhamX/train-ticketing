import React from "react";
import { Result } from "antd";

function Error() {
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
        <Result
          status="500"
          title="500"
          subTitle="Sorry, something went wrong. Our servers are down! ☹"
        />
      </div>
    </>
  );
}

export default Error;
