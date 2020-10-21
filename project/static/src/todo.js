import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import axios from "axios";
import { Form, Input, Button, Checkbox, List, Skeleton, Modal } from "antd";
import { Typography } from "antd";
import { HighlightOutlined } from "@ant-design/icons";

const { Paragraph } = Typography;

// get initial data from django
const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;

// setup ajax for call
const ajaxIn = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 1000,
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

const ajaxOut = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 1000,
  headers: { "X-CSRFToken": csrftoken, "X-Requested-With": "XMLHttpRequest" },
});

var page = 1;

function ToDo() {
  const [list, setList] = useState([]);

  return (
    <>
      <div>total: {list.length}</div>
      <AddToDo list={list} setList={setList} />
      <ToDoList list={list} setList={setList} />
    </>
  );
}

function AddToDo({ list, setList }) {
  const [addTodoForm] = Form.useForm();
  const onFinish = (values) => {
    ajaxOut
      .post("/api/todo/", values)
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

  useEffect(() => {
    setLoading(true);
    ajaxIn
      .get("/api/todo/")
      .then((response) => {
        setList([...list, ...response.data]);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const updateTask = (id, task) => {
    setLoading(true);
    ajaxOut
      .put(`/api/todo/${id}/`, { task })
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

    ajaxOut
      .put(`/api/todo/${id}/`, { task, done: reversedOpt })
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
          ajaxOut
            .delete(`/api/todo/${deleteModalID}/`)
            .then(function(response) {
              setList(list.filter((item) => (item.id !== deleteModalID ? true : false)));
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
      >Are you sure ?</Modal>

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
