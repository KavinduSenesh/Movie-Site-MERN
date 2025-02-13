import {useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import backgroundImage from "../assets/home2.jpg";
// import MovieLogo from "../assets/homeTitle.webp";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";

function Movie() {
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    onAuthStateChanged(firebaseAuth, (currentUser) => {
        if (!currentUser) navigate("/login");
    });

    window.onscroll = () => {
        setIsScrolled(window.pageYOffset === 0 ? false : true);
        return () => (window.onscroll = null);
    };

    return (
        <Container>
            <Navbar isScrolled={isScrolled} />
            <div className="hero">
                <img
                    src={backgroundImage}
                    alt="background"
                    className="background-image"
                />
                <div className="container">
                    {/*<div className="logo">*/}
                    {/*    <img src={MovieLogo} alt="Movie Logo" />*/}
                    {/*</div>*/}
                    <div className="buttons flex">
                        <button
                            onClick={() => navigate("/player")}
                            className="flex j-center a-center"
                        >
                            <FaPlay />
                            Play
                        </button>
                        <button className="flex j-center a-center">
                            <AiOutlineInfoCircle />
                            More Info
                        </button>
                    </div>
                </div>
            </div>
        </Container>
    );
}

const Container = styled.div`
  background-color: black;
  .hero {
    position: relative;
    .background-image {
      filter: brightness(60%);
    }
    img {
      height: 100vh;
      width: 100vw;
    }
    .container {
      position: absolute;
      bottom: 5rem;
      .logo {
        img {
          width: 100%;
          height: 100%;
          margin-left: 5rem;
        }
      }
      .buttons {
        margin: 5rem;
        gap: 2rem;
        button {
          font-size: 1.4rem;
          gap: 1rem;
          border-radius: 0.2rem;
          padding: 0.5rem;
          padding-left: 2rem;
          padding-right: 2.4rem;
          border: none;
          cursor: pointer;
          transition: 0.2s ease-in-out;
          &:hover {
            opacity: 0.8;
          }
          &:nth-of-type(2) {
            background-color: rgba(109, 109, 110, 0.7);
            color: white;
            svg {
              font-size: 1.8rem;
            }
          }
        }
      }
    }
  }
`;
export default Movie;
