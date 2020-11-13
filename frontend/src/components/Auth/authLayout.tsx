import React from "react";
import { Layout } from "antd";

const { Header, Footer,  Content } = Layout;

function AuthLayout({ children }: any) {
  return (
    <Layout>
      <Header>Header</Header>
      <Content>{children}</Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}
export default AuthLayout;