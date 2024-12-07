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
        const { error } = await supabase.auth.signInWithPassword({
            email: username,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            navigate('*'); // Route to a protected dashboard or main page
        }
    };

    return (
        <>
            
            <div className="container">
                <div className="form">
                    <h1
                      className="login"
                    >LOGIN</h1>
                    <h4>Username</h4>
                    <input
                        className="input"
                        type="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <br />
                    <h4>Password</h4>
                    <input
                        className="input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
                    <button onClick={handleLogin} 
                    className='LoginButton'>
                      Login</button>
                    <h3>
                        Don't have an account?{' '}
                        <a onClick={() => navigate('/signup')} className='SignupButton'>Sign up here</a>
                    </h3>
                </div>
                {error && <p className="error">{error}</p>}
                <br />
            </div>
        </>
    );
}

export default Login;
