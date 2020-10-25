import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  Checkbox,
  List,
  Skeleton,
  Modal,
  Layout,
  Menu,
} from "antd";
import { Typography } from "antd";
import {
  HighlightOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "./todo-react.css";

const { Header, Sider, Content } = Layout;
const { Paragraph } = Typography;

// get initial data from django
const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
const initialTodos = JSON.parse(
  document.querySelector("#initial-todos").textContent
);

// setup ajax for call
const ajax = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 1000,
  headers: { "X-CSRFToken": csrftoken, "X-Requested-With": "XMLHttpRequest" },
});

var page = 1;

function ToDo() {
  const [collapsed, setCollapsed] = useState(false);
  const [list, setList] = useState(initialTodos);

  return (
    <>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              nav 1
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              nav 2
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              nav 3
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
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
            }}
          >
            <div>total: {list.length}</div>
            <AddToDo list={list} setList={setList} />
            <ToDoList list={list} setList={setList} />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

function AddToDo({ list, setList }) {
  const [addTodoForm] = Form.useForm();
  const onFinish = (values) => {
    ajax
      .post("/todo/api/", values)
      .then(function(response) {
        setList([response.data, ...list]);
        // clear fields
        addTodoForm.setFieldsValue({
          task: undefined,
          done: false,
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  return (
    <>
      <Form
        name="basic"
        initialValues={{
          done: false,
        }}
        onFinish={onFinish}
        form={addTodoForm}
      >
        <Form.Item
          label="Task"
          name="task"
          rules={[
            {
              required: true,
              message: "Please add an item!",
            },
          ]}
        >
          <Input contentEditable={true} />
        </Form.Item>
        <Form.Item name="done" valuePropName="checked">
          <Checkbox>Done</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

function ToDoList({ list, setList }) {
  const [loading, setLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteModalID, setDeleteModalID] = useState(null);

  const updateTask = (id, task) => {
    setLoading(true);
    ajax
      .put(`/todo/api/${id}/`, { task })
      .then(function(response) {
        setList(
          list.map((item) => {
            if (item.id === id) item.task = task;
            return item;
          })
        );
        setLoading(false);
      })
      .catch(function(error) {
        console.log(error);
        setLoading(false);
      });
  };

  const updateIsDone = (id, task, done) => {
    setLoading(true);
    const reversedOpt = !done;

    ajax
      .put(`/todo/api/${id}/`, { task, done: reversedOpt })
      .then(function(response) {
        setList(
          list.map((item) => {
            if (item.id === id) item.done = !done;
            return item;
          })
        );
        setLoading(false);
      })
      .catch(function(error) {
        console.log(error);
        setLoading(false);
      });
  };

  const Text = ({ text, id }) => (
    <Paragraph
      editable={{
        icon: <HighlightOutlined />,
        tooltip: "Edit",
        onChange: updateTask.bind(null, id),
      }}
    >
      {text}
    </Paragraph>
  );

  return (
    <>
      <Modal
        visible={isDeleteModalVisible}
        onOk={() => {
          ajax
            .delete(`/todo/api/${deleteModalID}/`)
            .then(function(response) {
              setList(
                list.filter((item) =>
                  item.id !== deleteModalID ? true : false
                )
              );
              setLoading(false);
            })
            .catch(function(error) {
              console.log(error);
              setLoading(false);
            });
          setIsDeleteModalVisible(false);
        }}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setLoading(false);
        }}
      >
        Are you sure ?
      </Modal>

      <List
        className="demo-loadmore-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            actions={[
              <a
                key="list-loadmore-done"
                onClick={() => {
                  updateIsDone(item.id, item.task, item.done);
                }}
              >
                {item.done ? "Undone" : "Done"}
              </a>,
              <a
                key="list-loadmore-delete"
                onClick={() => {
                  setLoading(true);
                  setIsDeleteModalVisible(true);
                  setDeleteModalID(item.id);
                }}
              >
                Delete
              </a>,
            ]}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                title={
                  item.done ? (
                    <del>
                      <Text text={item?.task} id={item.id} />
                    </del>
                  ) : (
                    <Text text={item?.task} id={item.id} />
                  )
                }
                description={new Date(item?.created_time).toLocaleString()}
              />
            </Skeleton>
          </List.Item>
        )}
      />
    </>
  );
}

ReactDOM.render(<ToDo />, document.getElementById("add-todo"));
