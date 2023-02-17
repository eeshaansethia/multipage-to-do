import React from 'react'
import './Landing.css'
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReactAnimatedCursor from 'react-animated-cursor';
import { Input, Button } from 'antd';
import { useState } from 'react';

export default function Landing() {
    const [name, setName] = useState('');

    const handleNameChange = (e) => {
        setName(e.target.value);
        console.log(name)
    };

    let todo_token = {
        PersonName: '',
    };

    const handleOnLandingButtonClick = () => {
        if (name.length > 0) {
            todo_token['PersonName'] = name;
            localStorage.setItem('todo_token', JSON.stringify(todo_token));
        }
    }

    return (
        <div className='landing-container'>
            {/* Adding an animated curson using external library */}
            <ReactAnimatedCursor
                innerSize={20}
                outerSize={45}
                color='255,255,255'
                outerAlpha={0.2}
                innerScale={0.5}
                outerScale={1.1}
                trailingSpeed={5}
                hasBlendMode={true}
            />

            <div className="landing-logo-container">
                <ListAltIcon className='landing-logo' style={{
                    fontSize: 100,
                    color: '#ff1361',
                }} font-size='large' />

                {/*The name Wrike was taken from the AI name finding application https://namelix.com/ */}
                <h1 className='landing-logo-text'>WRIKE</h1>
            </div>

            <h1 className='landing-heading'>
                Welcome To Your
                <br />
                <span className='landing-heading-span'><span className='landing-heading-span-large'>T</span>o - <span className='landing-heading-span-large'>D</span>o </span>
                <br />
                Application
            </h1>

            <p className='landing-text'><em><strong>Wrike</strong></em> is a simple to-do application that allows you to create, edit, and delete tasks.</p>

            <div className='landing-input-container'>
                <Input placeholder='Enter your name' className='landing-input' value={name} onChange={handleNameChange} />
                <Button type='primary' className='glow-on-hover-landing' onClick={handleOnLandingButtonClick}>Lets Go!</Button>
            </div>
        </div>
    )
}