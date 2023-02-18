import React from 'react'
import './ToDoApplication.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
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
import CheckIcon from '@mui/icons-material/Check';
import useMediaQuery from '@mui/material/useMediaQuery';
import TextArea from "antd/es/input/TextArea";
import { v4 as uuidv4 } from 'uuid';

export default function ToDoApplication() {

  const navigate = useNavigate({});
  const [data, setData] = useState(false);
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [dateAdded, setDateAdded] = useState(new Date());
  const [formValues, setFormValues] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 6 });
  const [taskEditName, setTaskEditName] = useState('');
  const [descriptionEdit, setDescriptionEdit] = useState('');
  const [deadlineEdit, setDeadlineEdit] = useState(null);
  const [idEdit, setIdEdit] = useState('');

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  {/* This function gets the data from the local storage and sets it to the data variable.*/ }
  const getData = () => {
    const userToken = localStorage.getItem('todo_token');
    let todo_data = JSON.parse(userToken);
    let todoActualData = todo_data.Tasks;
    todoActualData.filter((item) => 'key' in item);
    todoActualData.filter((item) => item.status !== "Pending");
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
  {/* This function marks a particular task as completed*/ }
  const markCompleteHandler = (id) => {
    const newData = data.map((item) => {
      if (item.key === id) {
        return { ...item, status: "Completed" };
      } else {
        return item;
      }
    });
    const userToken = localStorage.getItem('todo_token');
    let todo_data = JSON.parse(userToken);
    todo_data.Tasks = newData;
    localStorage.setItem('todo_token', JSON.stringify(todo_data));
    setData(newData);
  }

  const editTaskHandler = (id) => {
    setShowEditModal(true);
    setIdEdit(id);
  }

  {/* This function marks a particular task as incomplete*/ }
  const markInCompleteHandler = (id) => {
    const newData = data.map((item) => {
      if (item.key === id) {
        return { ...item, status: "Pending" };
      } else {
        return item;
      }
    });
    const userToken = localStorage.getItem('todo_token');
    let todo_data = JSON.parse(userToken);
    todo_data.Tasks = newData;
    localStorage.setItem('todo_token', JSON.stringify(todo_data));
    setData(newData);
  }

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
          status: "Pending",
          taskName: taskName,
          description: description,
          deadline: date,
          dateAdded: dateCreated
        }
      );
      form.resetFields();
    }
  };

  const submitEditForm = (event) => {
    event.preventDefault();
    let date = deadlineEdit.toISOString().substring(0, 10);
    const newData = data.map((item) => {
      if (item.key === idEdit) {
        return { ...item, taskName: taskEditName, description: descriptionEdit, deadline: date };
      } else {
        return item;
      }
    });
    const userToken = localStorage.getItem('todo_token');
    let todo_data = JSON.parse(userToken);
    todo_data.Tasks = newData;
    localStorage.setItem('todo_token', JSON.stringify(todo_data));
    setData(newData);
    setShowEditModal(false);
    editForm.resetFields();
  }



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

  {/* Adding the columns for tbale*/ }
  const columns = [
    {
      title: "Task Name",
      dataIndex: "taskName",
      key: "taskName",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 220,
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
      sorter: (a, b) => new Date(a.deadline) - new Date(b.deadline)
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      ellipsis: true,
      sorter: (a, b) => a.status === 'Pending' ? -1 : 1,
      render: (text) => {
        if (text === 'Pending') {
          return <span style={{ color: 'red', fontWeight: '600' }}>{text}</span>;
        }
        else if (text === 'Completed') {
          return <span style={{ color: 'green', fontWeight: '600' }}>{text}</span>;
        }
        return text;
      },
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      fixed: matches ? "right" : "",
      render: (record) => {
        return (
          <Space justify="space-between">
            <Tooltip color="#333333" placement="bottom" title="Edit">
              <Popconfirm
                onConfirm={() => {
                  editTaskHandler(record.key);
                }}
                title="Edit?"
              >
                <EditIcon style={{ cursor: "pointer" }} />
              </Popconfirm>
            </Tooltip>
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

            {/* This is the code for the mark complete and mark pending buttons */}
            {
              record.status === "Pending" ? <Tooltip color="#333333" placement="bottom" title="Mark Complete">
                <Popconfirm
                  onConfirm={() => {
                    markCompleteHandler(record.key)
                  }}
                  title="Mark Complete?"
                >
                  <CheckIcon
                    style={{ cursor: "pointer" }}
                  />
                </Popconfirm>
              </Tooltip>
                : <Tooltip color="#333333" placement="bottom" title="Mark Pending">
                  <Popconfirm
                    onConfirm={() => {
                      markInCompleteHandler(record.key)
                    }}
                    title="Mark Pending?"
                  >
                    <ClearIcon style={{ cursor: "pointer" }} />
                  </Popconfirm>
                </Tooltip>
            }


          </Space>
        );
      },
    },
  ];




  return (
    <div className='app-container'>
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
      <div className="table-container">
        <Table
          style={{ margin: "5rem 5rem" }}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>

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
              <Button className='modal-buttons' type="primary" htmlType="submit" onClick={submitForm} form={Form}>Add Task</Button>
              <Button className='modal-buttons' type="primary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            </div>
          </Form>

        </div>
      </Modal>
      {/* This is the modal that pops up when the user clicks on the edit button */}
      <Modal
        style={{ width: "100vw" }}
        centered={true}
        footer={<></>}
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
      >
        <div className='form-container'>
          <h1 className="modal-heading">Edit Task</h1>
          <Form
            name='task-editor-form'
            autoComplete="off"
            form={editForm}
            id="task-editor-form"
            style={{
              maxWidth: 600,
            }}
          >
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
                value={taskEditName}
                onChange={(e) =>
                  setTaskEditName(e.target.value)
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
                value={descriptionEdit}
                onChange={(e) =>
                  setDescriptionEdit(e.target.value)
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
                value={deadlineEdit}
                onChange={(date) => {
                  setDeadlineEdit(date)
                }}
              />
            </Form.Item>
            <div className="button-container">
              <Button className='modal-buttons' type="primary" htmlType="submit" onClick={submitEditForm} form={editForm}>Edit Task</Button>
              <Button className='modal-buttons' type="primary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            </div>
          </Form>
        </div>


      </Modal>


    </div>
  )
}
