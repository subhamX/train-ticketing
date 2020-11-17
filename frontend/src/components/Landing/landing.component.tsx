import { Content } from "antd/lib/layout/layout";
import React from "react";
import Head from "../Head/head.component";
import "./landing.component.css";
import TravelTogetherSvg from "../../assets/images/travel_together.svg";
import { Button } from "antd";
import { Link } from "react-router-dom";

function AppView() {
  return (
    <div>
      <Head />
      <Content className="wrapper">
        <div className="info-wrapper">
          <div className="catchy">Let's travel with safety!</div>
          <div className="keypoints">
            <p className="point">Book your train tickets hassle-free from the comfort of your home</p>
            <p className="point">Quick process that makes travelling more enjoyable</p>
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
