import styled from "styled-components";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import { useState } from "react";
import { firebaseAuth} from "../utils/firebase-config.ts";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {useNavigate} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
    });

    const handleSignIn = async () => {
        try {
            setLoading(true);
            setError(null);
            const { email, password } = formValues;
            await createUserWithEmailAndPassword(firebaseAuth, email, password);
            console.log("user saved");
        } catch (err) {
            console.log(err);
            setError(err.message || "Failed to sign up. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useState(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (currentUser) {
                navigate("/");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    return (
        <Container $showPassword={showPassword}>
            <BackgroundImage />
            <div className={"content"}>
                <Header login/>
                <div className={"body flex column a-center j-center"}>
                    <div className={"text flex column"}>
                        <h1>Your favorite content all in one place.</h1>
                        <h4>Search, discover, and enjoy on any device.</h4>
                        <h6>Ready to start? Enter your email to create your account today.</h6>
                    </div>
                    <div className="form-container">
                        {error && <div className="error">{error}</div>}
                        <div className="form">
                            <input
                                type="email"
                                placeholder="Email Address"
                                onChange={(e) =>
                                    setFormValues({
                                        ...formValues,
                                        [e.target.name]: e.target.value,
                                    })
                                }
                                name="email"
                                value={formValues.email}
                            />
                            {showPassword && (
                                <input
                                    type="password"
                                    placeholder="Password"
                                    onChange={(e) =>
                                        setFormValues({
                                            ...formValues,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                    name="password"
                                    value={formValues.password}
                                />
                            )}
                            {!showPassword ? (
                                <button
                                    onClick={() => setShowPassword(true)}
                                    className="get-started-btn"
                                >
                                    Get Started
                                </button>
                            ) : (
                                <button
                                    onClick={handleSignIn}
                                    disabled={loading || !formValues.email || !formValues.password}
                                    className="signup-btn"
                                >
                                    {loading ? "Signing up..." : "Sign Up"}
                                </button>
                            )}
                        </div>

                        <div className="login-link">
                            Already have an account? <span onClick={() => navigate("/login")}>Log in</span>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

const Container = styled.div<{$showPassword: boolean}>`
    position: relative;
    height: 100vh;
    width: 100vw;
    overflow-x: hidden;
    
    .content{
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.6);
        display: grid;
        grid-template-rows: 15vh 85vh;
        .body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2rem;
            padding: 0 1rem;

            .text {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                text-align: center;
                max-width: 900px;
                margin: 0 auto;
                color: white;

                h1 {
                    font-size: 3rem;
                    font-weight: 700;
                    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);

                    @media (max-width: 768px) {
                        font-size: 2rem;
                        padding: 0;
                    }
                }

                h4 {
                    font-size: 1.5rem;
                    font-weight: 400;

                    @media (max-width: 768px) {
                        font-size: 1.2rem;
                    }
                }

                h6 {
                    font-size: 1.2rem;
                    font-weight: 400;
                    color: #ddd;

                    @media (max-width: 768px) {
                        font-size: 1rem;
                    }
                }
            }

            .form-container {
                width: 100%;
                max-width: 800px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;

                .error {
                    padding: 0.7rem 1rem;
                    background-color: rgba(255, 0, 0, 0.2);
                    border: 1px solid #e50914;
                    border-radius: 0.3rem;
                    color: white;
                    text-align: center;
                    width: 100%;
                    max-width: 800px;
                }

                .form {
                    display: grid;
                    grid-template-columns: ${({ $showPassword }) => $showPassword ? "1fr 1fr" : "2fr 1fr"};
                    width: 100%;
                    gap: 0.5rem;

                    @media (max-width: 768px) {
                        grid-template-columns: 1fr;
                    }

                    input {
                        color: black;
                        padding: 1.5rem;
                        font-size: 1.2rem;
                        border: none;
                        border-radius: 0.3rem;
                        transition: all 0.3s;

                        &:focus {
                            outline: none;
                            box-shadow: 0 0 0 2px #e50914;
                        }
                    }

                    button {
                        padding: ${({ $showPassword }) => $showPassword ? "0" : "1.5rem 1rem"};
                        background-color: #e50914;
                        border: none;
                        cursor: pointer;
                        color: white;
                        border-radius: 0.3rem;
                        font-weight: 600;
                        font-size: 1.2rem;
                        transition: all 0.3s;

                        &:hover {
                            background-color: #f40612;
                            transform: scale(1.02);
                        }

                        &:disabled {
                            background-color: #99373b;
                            cursor: not-allowed;
                            transform: none;
                        }
                    }

                    .get-started-btn {
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .signup-btn {
                        height: 200%;
                        grid-column: span 2;

                        @media (max-width: 768px) {
                            grid-column: span 1;
                            padding: 1.5rem 1rem;
                        }
                    }
                }

                .login-link {
                    margin-top: 1rem;
                    text-align: center;
                    color: #ddd;

                    span {
                        color: #e50914;
                        cursor: pointer;
                        font-weight: 500;

                        &:hover {
                            text-decoration: underline;
                        }
                    }
                }
            }
        }
    }

    @media (max-width: 768px) {
        .content .body .text h1 {
            padding: 0;
        }
    }
`;
