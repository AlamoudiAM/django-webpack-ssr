import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import axios from "axios";
import { Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BookOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./todo-react.css";

const { Header, Sider, Content } = Layout;

// get initial data from django
const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
const logout_url = JSON.parse(
  document.querySelector("#logout-url").textContent
);
const email = JSON.parse(document.querySelector("#email").textContent);

// setup ajax for call
const ajax = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 1000,
  headers: { "X-CSRFToken": csrftoken, "X-Requested-With": "XMLHttpRequest" },
});

var page = 1;

export default function({ children, whichNav }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <Layout style={{'height': '100%'}}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo">Todo App</div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[whichNav]}>
            <Menu.Item key="1" icon={<BookOutlined />}>
              Todo List
            </Menu.Item>
            <Menu.Item key="2" icon={<LogoutOutlined />}>
              <a href={logout_url}>Logout</a>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
            <span
              style={{
                float: "right",
                marginRight: "15px",
              }}
            >
              {email}
            </span>
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
            }}
          >
            {children}
          </Content>
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            by Abdulrahman Alamoudi
          </div>
        </Layout>
      </Layout>
    </>
  );
}
