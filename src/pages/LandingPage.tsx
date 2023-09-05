import React, { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import phrases from '../phrases';
import '../css/LandingPage.css';

const exampleImage = require('../images/output.jpg');

interface LandingPageProps {}

const LandingPage: FC<LandingPageProps> = () => {
const navigate = useNavigate();
const getRandomPhrase = (): string => { 
const phraseArray = Object.values(phrases);
return phraseArray[Math.floor(Math.random() * phraseArray.length)] as string; 
};

const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
event.preventDefault();
const usernameInput = event.currentTarget.querySelector('#username-input') as HTMLInputElement;
const passwordInput = event.currentTarget.querySelector('#password-input') as HTMLInputElement;
const username = usernameInput.value;
const password = passwordInput.value;

try {
const response = await fetch('http://localhost:8080/accounts/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
});

const responseData = await response.text();

if (response.ok && responseData === "Authenticated successfully") {
  
  localStorage.setItem('username', username);
    console.log('Navigating to /village');
    navigate('/village');
} else {
    console.error('Login error:', responseData);
    alert('Login failed. Please check your credentials.');
}
} catch (error) {
console.error("Error during login or data fetch:", error);
alert("An error occurred. Please try again.");
console.error('Network error:', error);
alert('There was a network error. Please try again.');
}};

return (
<div className="landing-page">
<div className="container">
<div className="sidebar">
<button className="sidebar-button">Home</button>
<Link to="/create-account">
    <button className="sidebar-button">Create an Account</button>
</Link>
<Link to="/rules">
    <button className="sidebar-button">Rules</button>
</Link>
<Link to="/leaderboard">
    <button className="sidebar-button">Leaderboard</button>
</Link>
</div>
<div className="center">
<p className="game-desc">Engage in epic battles, strategize, build your village, and rise to the top!</p>
<img className="logo" src={exampleImage} alt="Cool Browser Game" />
<p className="welcome">Welcome to Cool Browser Games! Join now and begin your journey towards greatness.</p>
<form className="login-form" onSubmit={handleLogin}>
  <label htmlFor="username-input">Username:</label>
  <input type="text" id="username-input" required />
  <label htmlFor="password-input" style={{marginLeft: "10px"}}>Password:</label>
  <input type="password" id="password-input" required />
  <button type="submit" className="btn login-btn">Login</button>
</form>
<p className="motivational-phrase">"{getRandomPhrase()}"</p>
</div></div>
</div>

);
};


export default LandingPage;