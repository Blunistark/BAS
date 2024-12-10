import './Login.css';
import React, { useState } from 'react';
import supabase from './supabase.js';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const { data: session, error } = await supabase.auth.signInWithPassword({
                email: username,
                password,
            });

            if (error) {
                setError(error.message);
            } else {
                localStorage.setItem('userEmail', session.user.email);
                navigate('/MapScreen');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        }
    };

    return (
        <div className="container">
            <div className="form">
                <h1 className="login">Login</h1>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    className="input"
                    type="email"
                    placeholder="Enter your email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    className="input"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin} className="LoginButton">
                    Login
                </button>
                <p>
                    Don't have an account?{' '}
                    <span onClick={() => navigate('/signup')} className="SignupButton">
                        Sign up here
                    </span>
                </p>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
}

export default Login;
