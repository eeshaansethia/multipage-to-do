import React from 'react'
import './ToDoApplication.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import { Modal } from 'antd';
import TaskAdder from './Components/TaskAdder';

export default function ToDoApplication() {

  const navigate = useNavigate({});
  const [data, setData] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const checkUserToken = () => {
    const userToken = localStorage.getItem('todo_token');
    if (userToken === null) {
      navigate('/');
    }
    else {
      let todo_data = JSON.parse(userToken);
      setData(todo_data);
    }
  }
  useEffect(() => {
    checkUserToken();
  }, []);

  let personName = data.PersonName;

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
          <p className="app-header-name">Welcome, <span>{personName}</span>!</p>
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

      <button className="plus-button" onClick={() => { setShowModal(true) }}>Add Task</button>
      <Modal
        style={{ width: "100vw" }}
        centered={true}
        footer={<></>}
        open={showModal}
        onCancel={() => setShowModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <TaskAdder setShowModal={setShowModal}/>
      </Modal>
    </div>
  )
}
