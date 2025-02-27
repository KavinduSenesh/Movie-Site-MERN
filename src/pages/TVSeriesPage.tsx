import styled from "styled-components";
import Navbar from "../components/Navbar.tsx";
import {useEffect, useState} from "react";
import SelectGenre from "../components/SelectGenre.tsx";
import {useDispatch, useSelector} from "react-redux";
import Slider from "../components/Slider.tsx";
import {useNavigate} from "react-router-dom";
import {fetchMovies, getGenres} from "../../store";
import {onAuthStateChanged} from "firebase/auth";
import {firebaseAuth} from "../utils/firebase-config.ts";

export default function TVSeriesPage(){
    const [isScrolled, setIsScrolled] = useState(false);
    const genres = useSelector((state) => state.movie.genres);
    const movies = useSelector((state) => state.movie.movies);
    const genresLoaded = useSelector((state: any) => state.movie.genresLoaded);
    const [user, setUser] = useState(undefined);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!genres.length) {
            dispatch(getGenres());
        }
    }, [dispatch, genres.length]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser.uid);
            } else {
                navigate("/login");
            }
        });

        return () => unsubscribe(); // Cleanup function
    }, [navigate]);

    useEffect(() => {
        if (genresLoaded) {
            dispatch(fetchMovies({ genres, type: "tv" }));
        }
    }, [genresLoaded, dispatch, genres]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.pageYOffset !== 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll); // Cleanup function
        };
    }, []);

    // onAuthStateChanged(firebaseAuth, (currentUser) => {
    //     if (currentUser) setUser(currentUser.uid);
    //     else navigate("/login");
    // });

    // window.onscroll = () => {
    //     setIsScrolled(window.pageYOffset === 0 ? false : true);
    //     return () => (window.onscroll = null);
    // };

    return(
        <Container>
            <Navbar isScrolled={isScrolled}/>
            <div className={"data"}>
                <SelectGenre genres={genres} type={"tv"}/>
                {movies.length ? (
                    <Slider movies={movies}/>
                ) : (
                    <h1 className={"not-available"}>
                        No TV Series Available!
                    </h1>
                )}
            </div>
        </Container>
    );
}

const Container = styled.div`
    .data{
        margin-top: 8rem;
        .not-available{
            text-align: center;
            margin-top: 4rem;
        }
    }
`;
