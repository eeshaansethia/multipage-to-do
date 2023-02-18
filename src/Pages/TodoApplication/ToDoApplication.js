import React from 'react'
import './ToDoApplication.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ToDoApplication() {

  const navigate = useNavigate();

  const checkUserToken = () => {
    const userToken = localStorage.getItem('todo_token');
    if (userToken && userToken !== 'undefined') {

    }
    else {
      navigate('/');
    }
  }
  useEffect(() => {
    checkUserToken();
  }, []);
  return (
    <div>

    </div>
  )
}
