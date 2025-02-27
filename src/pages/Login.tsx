import {useEffect, useState} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // const handleLogin = async () => {
    //     try {
    //         await signInWithEmailAndPassword(firebaseAuth, email, password);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    const handleLogin = async () => {
        setLoading(true);
        setError(null); // Reset error state

        try {
            await signInWithEmailAndPassword(firebaseAuth, email, password);
        } catch (err: any) {
            setError(err.message || "Failed to log in. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (currentUser) {
                navigate("/");
            }
        });

        return () => unsubscribe(); // Cleanup function
    }, [navigate]);

    // onAuthStateChanged(firebaseAuth, (currentUser) => {
    //     if (currentUser) navigate("/");
    // });

    return (
        <Container>
            <BackgroundImage />
            <div className="content">
                <Header />
                <div className="form-container flex column a-center j-center">
                    <div className="form flex column a-center j-center">
                        <div className="title">
                            <h3>Login</h3>
                        </div>
                        <div className="container flex column">
                            {error && <p className="error">{error}</p>}
                            <input
                                type="text"
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                            <button onClick={handleLogin} disabled={loading}>
                                {loading ? "Logging in..." : "Login to your account"}
                            </button>
                            <div className="signup-link">
                                Don't have an account? <span onClick={() => navigate("/signup")}>Sign up</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
    
  .content {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.6);
    display: grid;
    grid-template-rows: 15vh 85vh;
      
    .form-container {
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: center;
       gap: 2rem;
       height: 85vh;

        .form {
            padding: 2.5rem;
            background-color: rgba(0, 0, 0, 0.85);
            width: 25vw;
            border-radius: 0.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2rem;
            color: white;
            box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
            transition: transform 0.3s ease;

            &:hover {
                transform: translateY(-5px);
            }

            .title {
                h3 {
                    font-size: 2rem;
                    font-weight: 600;
                    color: #e50914;
                    margin-bottom: 1rem;
                }
            }

            .container {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                width: 100%;

                .error {
                    padding: 0.7rem;
                    background-color: rgba(255, 0, 0, 0.2);
                    border: 1px solid #e50914;
                    border-radius: 0.3rem;
                    color: white;
                    text-align: center;
                }

                input {
                    padding: 1rem;
                    width: 100%;
                    border-radius: 0.3rem;
                    border: none;
                    background-color: #333;
                    color: white;
                    font-size: 1rem;
                    transition: all 0.3s;

                    &:focus {
                        outline: none;
                        background-color: #454545;
                    }

                    &::placeholder {
                        color: #aaa;
                    }
                }

                button {
                    padding: 1rem;
                    background-color: #e50914;
                    border: none;
                    cursor: pointer;
                    color: white;
                    border-radius: 0.3rem;
                    font-weight: 600;
                    font-size: 1.05rem;
                    transition: all 0.3s;
                    width: 100%;

                    &:hover {
                        background-color: #f40612;
                        transform: scale(1.02);
                    }

                    &:disabled {
                        background-color: #99373b;
                        cursor: not-allowed;
                    }
                }

                .signup-link {
                    text-align: center;
                    margin-top: 0.5rem;
                    color: #aaa;

                    span {
                        color: #e50914;
                        cursor: pointer;
                        font-weight: 500;
                        margin-left: 0.5rem;

                        &:hover {
                            text-decoration: underline;
                        }
                    }
                }
            }
        }

        @media (max-width: 768px) {
            .form {
                width: 80vw;
            }
        }
    }
  }
`;

export default Login;
