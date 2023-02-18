import React from 'react'
import './TaskAdder.css'
import {
    Form,
    Button,
    Input,
    DatePicker
} from 'antd';
import { useState, useEffect } from 'react';
import TextArea from "antd/es/input/TextArea";
import { v4 as uuidv4 } from 'uuid';

function TaskAdder(props) {
    const [form] = Form.useForm();
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState(null);
    const [dateAdded, setDateAdded] = useState(new Date());
    const [formValues, setFormValues] = useState({});
    const { setShowModal } = props;

    const submitForm = (event) => {
        event.preventDefault();
        if (taskName !== '' || deadline !== null) {
            const id_1 = uuidv4();
            setFormValues(
                {
                    id: id_1,
                    taskName: taskName,
                    description: description,
                    deadline: deadline,
                    dateAdded: dateAdded
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
        }
    }

    useEffect(() => {
        updateTaskList();

    }, [formValues]);

    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };



    return (
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
    )
}

export default TaskAdder
