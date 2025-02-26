import styled from "styled-components";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import video from "../assets/Disney.mp4";
import {IoPlayCircleSharp} from "react-icons/io5";
import {RiThumbDownFill, RiThumbUpFill} from "react-icons/ri";
import {BsCheck} from "react-icons/bs";
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

    onAuthStateChanged(firebaseAuth, (currentUser) => {
        if (currentUser) {
            setEmail(currentUser.email);
        } else navigate("/login");
    });

    const addToList = async () => {
        try {
            await axios.post("http://localhost:5000/api/user/add", {
                email,
                data: movieData,
            });
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
                                    {
                                        isLiked ? (
                                            <BsCheck
                                                title={"Remove from list"}
                                                onClick={() =>
                                                    dispatch(
                                                        removeMovieFromLiked({ movieId: movieData.id, email })
                                                    )
                                                }
                                            />
                                        ) : (
                                            <AiOutlinePlus
                                                title={"Add to list"}
                                                onClick={addToList}
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
        </Container>
    );
});

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
