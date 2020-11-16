import { Content } from "antd/lib/layout/layout";
import React, { useState } from "react";
import Head from "../Head/head.component";
import "./landing.component.css";
import SubwaySvg from "../../assets/images/subway.svg";
import TravelTogetherSvg from "../../assets/images/travel_together.svg";
import { Button } from "antd";
import { Link } from "react-router-dom";

function AppView() {
  return (
    <div>
      <Head />
      <Content className="wrapper">
        {/* <img src={SubwaySvg} /> */}
        <div className="info-wrapper">
          <div className="catchy">Let's travel with safety!</div>
          <div className="keypoints">
            <p className="point">Choose which seat to book</p>
            <p className="point">Easy cancellation</p>
            <Link to="/tickets/search/">
              <Button className='action-btn' type="primary" size="large" shape="round" >
                Book Now
              </Button>
            </Link>
          </div>
        </div>
        <img
          src={TravelTogetherSvg}
          className="img-illustration"
          alt="travel together"
        />
      </Content>
    </div>
  );
}

export default AppView;
