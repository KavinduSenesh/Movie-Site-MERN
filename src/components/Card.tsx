import styled from "styled-components";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import video from "../assets/Disney.mp4";
import {RiThumbDownFill, RiThumbUpFill} from "react-icons/ri";
import {BsBookmarkPlus, BsCheck} from "react-icons/bs";
import {AiOutlinePlus} from "react-icons/ai";
import {BiChevronDown} from "react-icons/bi";
import {useDispatch} from "react-redux";
import {firebaseAuth} from "../utils/firebase-config.ts";
import {onAuthStateChanged} from "firebase/auth";
import axios from "axios";
import {removeMovieFromLiked} from "../../store";

type CardProps = {
    movieData: {
        id: number;
        name: string;
        image: string;
        genres: string[];
    };
    isLiked?: boolean;
};

export default React.memo(function Card({movieData, isLiked = false}: CardProps){
    const [isHovered, setIsHovered] = useState(false);
    const navigate= useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [isMounted, setIsMounted] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(isLiked);

    onAuthStateChanged(firebaseAuth, (currentUser) => {
        if (currentUser) {
            setEmail(currentUser.email);
        } else navigate("/login");
    });

    useEffect(() => {
        setIsMounted(false);

        return () => {
            setIsMounted(true); // Reset the flag when the component mounts again
        };
    }, []);

    useEffect(() => {
        let timer;
        if (showAlert) {
            timer = setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [showAlert]);

    const addToList = async () => {
        try {
            await axios.post("http://localhost:5000/api/user/add", {
                email,
                data: movieData,
            });
            if (isMounted){
                setIsBookmarked(true);
                setShowAlert(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleLike = () => {
        if (!liked) {
            setLiked(true);
            setDisliked(false);
        } else {
            setLiked(false);
        }
    };

    const handleDislike = () => {
        if (!disliked) {
            setDisliked(true);
            setLiked(false);
        } else {
            setDisliked(false);
        }
    };

    return(
        <Container
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
                 alt="show"
            />
            {
                isHovered && (
                    <div className={"hover"}>
                        <div className={"image-video-container"}>
                            <img src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
                                 alt="show"
                                 onClick={() => navigate(`/movie/${movieData.id}`)}
                            />
                            <video src={video} autoPlay loop muted onClick={() => navigate("/player")}/>
                        </div>
                        <div className={"info-container flex column"}>
                            <h3 className={"name"}
                                onClick={() => navigate(`/movie/${movieData.id}`)}>
                                {movieData.name}
                            </h3>
                            <div className={"icons flex j-between"}>
                                <div className={"controls flex"}>
                                    {/*<IoPlayCircleSharp*/}
                                    {/*    title={"play"}*/}
                                    {/*    onClick={() => navigate("/player")}*/}
                                    {/*/>*/}

                                    <RiThumbUpFill
                                        title={"like"}
                                        onClick={handleLike}
                                        style={{ color: liked ? "green" : "white", cursor: "pointer" }}
                                    />
                                    <RiThumbDownFill
                                        title={"Dislike"}
                                        onClick={handleDislike}
                                        style={{ color: disliked ? "red" : "white", cursor: "pointer" }}
                                    />
                                    {isBookmarked ? (
                                        <BsCheck
                                            title={"Bookmarked"}
                                            style={{ cursor: "default" }}
                                        />
                                    ) : (
                                        <AiOutlinePlus
                                            title={"Add to list"}
                                            onClick={addToList}
                                            style={{ cursor: "pointer" }}
                                        />
                                    )}
                                </div>
                                <div className={"info"}>
                                     <BiChevronDown
                                         title={"More info"}
                                         onClick={() => navigate(`/movie/${movieData.id}`)}
                                     />
                                </div>
                            </div>
                            <div className={"genres flex"}>
                                <ul className={"flex"}>
                                    {movieData.genres.map((genre) =>
                                    {
                                        <li key={genre}>{genre}</li>
                                    }
                                )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )
            }
            {showAlert && (
                <AlertContainer>
                    <div className="alert-content">
                        <BsBookmarkPlus className="bookmark-icon" />
                        <div className="alert-text">
                            <h4>{movieData.name}</h4>
                            <p>Added to your list!</p>
                        </div>
                    </div>
                </AlertContainer>
            )}
        </Container>
    );
});

const AlertContainer = styled.div`
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.95) 100%);
    border-left: 4px solid #e50914;
    color: white;
    padding: 15px 20px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    min-width: 280px;
    animation: slideIn 0.3s ease-out forwards;
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .alert-content {
        display: flex;
        align-items: center;
    }
    
    .bookmark-icon {
        font-size: 24px;
        color: #e50914;
        margin-right: 15px;
    }
    
    .alert-text {
        h4 {
            margin: 0 0 5px 0;
            font-weight: 600;
        }
        
        p {
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
        }
    }
`;

const Container = styled.div`
    max-width: 230px;
    width: 230px;
    height: 100%;
    cursor: pointer;
    position: relative;
    img{
        border-radius: 0.2rem;
        width: 100%;
        height: 100%;
        z-index: 10;
    }
    .hover{
        z-index: 90;
        height: max-content;
        width: 20rem;
        position: absolute;
        top: -18vh;
        left: 0;
        border-radius: 0.3rem;
        box-shadow: rgba(0, 0, 0, 0.75) 0px 3px 10px;
        background-color: #181818;
        transition: 0.3s ease-in-out;
        .image-video-container{
            position: relative;
            height: 140px;
            img{
                width: 100%;
                height: 140px;
                object-fit: cover;
                border-radius: 0.3rem;
                top: 0;
                z-index: 4;
                position: absolute;
            }
            video{
                width: 100%;
                height: 140px;
                object-fit: cover;
                border-radius: 0.3rem;
                top: 0;
                z-index: 5;
                position: absolute;
            }
        }
        .info-container{
            padding: 1rem;
            gap: 0.5rem;
        }
        .icons {
            .controls{
                display: flex;
                gap: 1rem;
            }
            svg{
                font-size: 2rem;
                cursor: pointer;
                transition: 0.3s ease-in-out;
                &:hover{
                    color: #b8b8b8;
                }
            }
        }
        .genres{
            ul{
                 gap: 1rem;
                li{
                    padding-right: 0.7rem;
                    &:first-of-type{
                        list-style-type: none;
                    }
                }
            }
        }
    }
`
