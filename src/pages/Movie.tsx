import { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import backgroundImage from "../assets/home2.jpg";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getGenres, fetchMovies } from "../../store";
import Slider from "../components/Slider.tsx";
import {getMovieDetails} from "../utils/api.ts";  // Import fetchMovies

function Movie() {
    const [isScrolled, setIsScrolled] = useState(false);
    const movies = useSelector((state) => state.movie.movies);
    const genres = useSelector((state) => state.movie.genres);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [trailer, setTrailer] = useState<string | null>(null);
    const { genresLoaded } = useSelector((state: any) => state.movie);

    const TRANSFORMERS_ONE_ID = "698687";

    useEffect(() => {
        dispatch(getGenres());
    }, [dispatch]);

    useEffect(() => {
        // Fetch movies only after genres are loaded
        if (genresLoaded) {
            dispatch(fetchMovies({ genres, type: 'all' }));  // Change 'movie' to the type you need
        }
    }, [dispatch, genresLoaded, genres]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (!currentUser) navigate("/login");
        });
        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.pageYOffset !== 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // onAuthStateChanged(firebaseAuth, (currentUser) => {
    //     if (!currentUser) navigate("/login");
    // });
    //
    // window.onscroll = () => {
    //     setIsScrolled(window.pageYOffset === 0 ? false : true);
    //     return () => (window.onscroll = null);
    // };

    useEffect(() => {
        const fetchTrailer = async () => {
            const movieData = await getMovieDetails(TRANSFORMERS_ONE_ID);
            const trailerVideo = movieData.videos.results.find(
                (video: any) => video.site === "YouTube" && video.type === "Trailer"
            );
            setTrailer(trailerVideo ? trailerVideo.key : null);
        };
        fetchTrailer();
    }, []);

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
                    <div className="buttons flex">
                        <button
                            onClick={() => window.open("https://www.youtube.com/watch?v=0rmJXXKDrsM", "_blank")} className="flex j-center a-center"
                        >
                            <FaPlay />
                            Play
                        </button>
                        <button onClick={() => navigate(`/movie/${TRANSFORMERS_ONE_ID}`)} className="flex j-center a-center">
                            <AiOutlineInfoCircle />
                            More Info
                        </button>
                    </div>
                </div>
            </div>
            <Slider movies={movies}/>
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
