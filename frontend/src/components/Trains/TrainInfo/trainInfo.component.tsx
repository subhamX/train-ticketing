import React from "react";
import { useParams } from "react-router-dom";

import Head from "../../Head/head.component";

function TrainInfo() {
  const { train_id }: any = useParams();
  return (
    <div>
      <Head />
      <h1>{train_id}</h1>
    </div>
  );
}

export default TrainInfo;
