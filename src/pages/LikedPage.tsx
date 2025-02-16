import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {getUsersLikedMovies} from "../../store";
import {onAuthStateChanged} from "firebase/auth";
import {firebaseAuth} from "../utils/firebase-config.ts";
import styled from "styled-components";
import Navbar from "../components/Navbar.tsx";
import Card from "../components/Card.tsx";

export default function LikedPage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const movies = useSelector((state) => state.movie.movies || []);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");

    const initialState = {
        movies: []
    };


    useEffect(() => {
        if (email) {
            dispatch(getUsersLikedMovies(email));
        }
    }, [email]);

    window.onscroll = () => {
        setIsScrolled(window.pageYOffset === 0 ? false : true);
        return () => (window.onscroll = null);
    };

    onAuthStateChanged(firebaseAuth, (currentUser) => {
        if (currentUser) setEmail(currentUser.email);
        else navigate("/login");
    });

    return (
        <Container>
            <Navbar isScrolled={isScrolled}/>
            <div className={"content flex column"}>
                <h1>My list</h1>
                <div className={"grid flex"}>
                    {
                        movies.map((movie, index) => {
                            return(
                                <Card
                                    movieData={movie}
                                    index={index}
                                    key={movie.id}
                                    isLiked={true}
                                />
                            );
                        })
                    }
                </div>
            </div>
        </Container>
    );
}

const Container = styled.div`
    .content{
        margin: 2.3rem;
        margin-top: 8rem;
        gap: 3rem;
        h1{
            margin-left: 3rem;
        }
        .grid{
            flex-wrap: wrap;
            gap: 1rem;
        }
    }
`;
