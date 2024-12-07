import './Login.css';
import React, { useState } from 'react';
import supabase from './supabase.js';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        const { error } = await supabase.auth.signUp({
            email: username,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            navigate('/login'); // Redirect to login after successful signup
        }
    };

    return (
        <>
            <div className="container">
                <div className="form">
                    <h1 className="login">SIGN UP</h1>
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
                    <button onClick={handleSignup} className="LoginButton">
                        Sign Up
                    </button>
                    <h3>
                        Already have an account?{' '}
                        <a onClick={() => navigate('/login')} className="SignupButton">
                            Log in here
                        </a>
                    </h3>
                </div>
                {error && <p className="error">{error}</p>}
                <br />
            </div>
        </>
    );
}

export default Signup;
