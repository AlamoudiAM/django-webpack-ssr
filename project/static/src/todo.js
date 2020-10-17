import React, { Component } from "react";
import ReactDOM from "react-dom";
import 'antd/dist/antd.css';
import { Input } from 'antd';

const todoList = JSON.parse(document.getElementById('todo-list').textContent);
console.log(todoList);

class Form extends Component {
  constructor() {
    super();

    this.state = {
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { value } = event.target;
    this.setState({
        value: value
    });
  }

  render() {
    return (<div>
        <Input placeholder="Basic usage" />  
      </div>
    );
  }
}

ReactDOM.render(<Form />, document.getElementById("container"));
