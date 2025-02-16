import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {fetchMovies, getGenres} from "../../store";
import {onAuthStateChanged} from "firebase/auth";
import {firebaseAuth} from "../utils/firebase-config.ts";
import styled from "styled-components";
import Navbar from "../components/Navbar.tsx";
import Slider from "../components/Slider.tsx";
import NotAvailable from "../components/NotAvailable.tsx";
import SelectGenre from "../components/SelectGenre.tsx";

export default function MoviePage(){

    const [isScrolled, setIsScrolled] = useState(false);
    const movies = useSelector((state) => state.movie.movies);
    const genres = useSelector((state) => state.movie.genres);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { genresLoaded } = useSelector((state: any) => state.movie);

    useEffect(() => {
        dispatch(getGenres());
    }, [dispatch]);

    useEffect(() => {
        if (genresLoaded) {
            dispatch(fetchMovies({ type: 'movie' }));  // Change 'movie' to the type you need
        }
    }, [dispatch, genresLoaded]);

    window.onscroll = () => {
        setIsScrolled(window.pageYOffset === 0 ? false : true);
        return () => (window.onscroll = null);
    };

    onAuthStateChanged(firebaseAuth, (currentUser) => {
        // if (currentUser) navigate("/");
    });


    return (
        <Container>
            <div className={"navbar"}>
                <Navbar isScrolled={isScrolled}/>
            </div>
            <div className={"data"}>
                <SelectGenre genres={genres} type={"movie"}/>
                {
                    movies.length ? <Slider movies={movies} /> : <NotAvailable />
                }
            </div>
        </Container>
    )
}

const Container = styled.div`
    .data{
        margin-top: 8rem;
        .not-available{
            text-align: center;
            color: white;
            margin-top: 4rem;
        }
    }
`;