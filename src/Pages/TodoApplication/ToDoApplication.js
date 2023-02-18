import React from 'react'
import './ToDoApplication.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  Modal,
  Tooltip,
  Space,
  Popconfirm,
  Table,
  Form,
  Button,
  Input,
  DatePicker
} from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
import useMediaQuery from '@mui/material/useMediaQuery';
import TextArea from "antd/es/input/TextArea";
import { v4 as uuidv4 } from 'uuid';

export default function ToDoApplication() {

  const navigate = useNavigate({});
  const [data, setData] = useState(false);
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [form] = Form.useForm();
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [dateAdded, setDateAdded] = useState(new Date());
  const [formValues, setFormValues] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 6 });

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  {/* This function gets the data from the local storage and sets it to the data variable.*/ }
  const getData = () => {
    const userToken = localStorage.getItem('todo_token');
    let todo_data = JSON.parse(userToken);
    let todoActualData = todo_data.Tasks;
    todoActualData.filter((item) => 'key' in item);
    setData(todoActualData);
    setName(todo_data.PersonName);
  }

  {
    /*This function checks if the user is logged in or not. 
    If not, it redirects to the login page. 
    If yes, it sets the data to the user's data.*/
  }

  const checkUserToken = () => {
    const userToken = localStorage.getItem('todo_token');
    if (userToken === null) {
      navigate('/');
    }
    else {
      getData();
    }
  }

  {/* This function deletes a particular task*/ }
  const taskDeleteHandler = (id) => {
    let newData = data.filter((item) => item.key !== id);
    const userToken = localStorage.getItem('todo_token');
    let todo_data = JSON.parse(userToken);
    todo_data.Tasks = newData;
    localStorage.setItem('todo_token', JSON.stringify(todo_data));
    setData(newData);
  };

  const submitForm = (event) => {
    event.preventDefault();

    {/* To make sure empty data is not been sent to the storage. */ }

    if (taskName !== '' || deadline !== null) {
      const id = uuidv4();
      let date = deadline.toISOString().substring(0, 10);
      let dateCreated = dateAdded.toISOString().substring(0, 10);
      setFormValues(
        {
          key: id,
          taskName: taskName,
          description: description,
          deadline: date,
          dateAdded: dateCreated
        }
      );
      form.resetFields();
    }
  };


  const updateTaskList = () => {
    if (Object.keys(formValues).length !== 0) {
      let userToken = localStorage.getItem('todo_token');
      userToken = JSON.parse(userToken);
      userToken.Tasks.push(formValues);
      console.log(userToken)
      localStorage.setItem("todo_token", JSON.stringify(userToken));
      setShowModal(false);
    }
  }


  const matches = useMediaQuery("(max-width:1040px)");

  {/* This function is called when the page is loaded, as well as whenever values of a function are changed, to rerender the table data*/ }
  useEffect(() => {
    updateTaskList();
    checkUserToken();

  }, [formValues]);

  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const columns = [
    {
      title: "Task Name",
      dataIndex: "taskName",
      key: "taskName",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Date Created",
      dataIndex: "dateAdded",
      key: "dateAdded",
      width: 130,
      ellipsis: true,
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      fixed: matches ? "right" : "",
      render: (record) => {
        return (
          <Space justify="space-between">
            {/* <Tooltip color="#333333" placement="bottom" title="Update">
              <img
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setShowModal(true);
                  productUpdateHandler(record.id);
                }}
                width="70%"
                alt="update"
                src={`${baseUrl}icons/update.png`}
              ></img>
            </Tooltip> */}
            <Tooltip color="#333333" placement="bottom" title="Delete">
              <Popconfirm
                onConfirm={() => {
                  taskDeleteHandler(record.key);
                }}
                title="Sure to delete?"
              >
                <DeleteIcon style={{ cursor: "pointer" }} />
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      },
    },
  ];




  return (
    <div>
      <div className="header">
        <div className="app-logo-container">
          {/* Code from Stack Overflow to use gradient in MaterialUI Icons */}
          <svg width={0} height={0}>
            <linearGradient id="linearColors" x1={1} y1={0} x2={1} y2={1}>
              <stop offset={0} stopColor="#D04943" />
              <stop offset={1} stopColor="#44107a" />
              <stop offset={2} stopColor="#ff1361" />
              <stop offset={3} stopColor="#666BE3" />
            </linearGradient>
          </svg>
          <ListAltIcon sx={{ fill: "url(#linearColors)" }} className='landing-logo' style={{
            fontSize: 50,
            color: '#ff1361',
          }} />

          {/*The name Wrike was taken from the AI name finding application https://namelix.com/ */}
          <h1 className='app-logo-text'>WRIKE</h1>
        </div>
        <h3 className="app-heading">To-Do Application</h3>
        <div className='app-name-container'>
          <p className="app-header-name">Welcome, <span>{name}</span>!</p>
          <LogoutIcon className="logout-icon" style={{
            color: '#eee',
            cursor: 'pointer',
          }}
            onClick={() => {
              localStorage.removeItem('todo_token');
              navigate('/');
            }} />
        </div>
      </div>

      <Table
        style={{ margin: "5rem 8rem" }}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <button className="plus-button" onClick={() => { setShowModal(true) }}>Add Task</button>

      {/* This is the modal that pops up when the user clicks on the plus button */}
      <Modal
        style={{ width: "100vw" }}
        centered={true}
        footer={<></>}
        open={showModal}
        onCancel={() => setShowModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className='form-container'>
          <h1 className="modal-heading">Add a Task</h1>
          <Form
            name='task-adder-form'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
            id="task-adder-form"
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}>
            <Form.Item
              name="taskName"
              label="Task Name"
              rules={[
                {
                  required: true,
                  message: 'Please input your task!',
                },
              ]}>
              <Input
                placeholder="Task Name"
                value={taskName}
                onChange={(e) =>
                  setTaskName(e.target.value)
                }
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: false,
                  message: 'Please input your description!',
                },
              ]}>
              <TextArea
                placeholder="Task Description"
                rows={9}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />
            </Form.Item>

            <Form.Item
              name="date"
              label="Deadline"
              rules={[
                {
                  required: true,
                  message: 'Please input your deadline date!',
                },
              ]}>
              <DatePicker
                value={deadline}
                onChange={(date) => {
                  setDeadline(date)
                }}
              />
            </Form.Item>
            <div className="button-container">
              <Button className='modal-buttons' type="primary" htmlType="submit" onClick={submitForm} form={form}>Add Task</Button>
              <Button className='modal-buttons' type="primary" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </Form>

        </div>
      </Modal>
    </div>
  )
}
