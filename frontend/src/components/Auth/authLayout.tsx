import React from "react";
import { Layout } from "antd";
import Head from "../Head/head.component";

const { Content } = Layout;

function AuthLayout({ children }: any) {
  return (
    <Layout>
      <Head/>
      <Content>{children}</Content>
    </Layout>
  );
}
export default AuthLayout;
