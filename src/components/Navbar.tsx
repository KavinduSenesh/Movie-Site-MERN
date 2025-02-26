import { signOut } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo1.png";
import { firebaseAuth } from "../utils/firebase-config";
import { FaPowerOff, FaSearch } from "react-icons/fa";
import {searchMovies} from "../utils/api.ts";

type NavbarProps = {
    isScrolled: boolean;
}

export default function Navbar({ isScrolled } : NavbarProps) {
    const [showSearch, setShowSearch] = useState(false);
    const [inputHover, setInputHover] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length > 2) {
            const results = await searchMovies(query);
            setSearchResults(results);
        }else {
            setSearchResults([]);
        }
    }

    const links = [
        { name: "Home", link: "/" },
        { name: "TV Shows", link: "/series" },
        { name: "Movies", link: "/movie" },
        { name: "My List", link: "/list" },
    ];

    return (
        <Container>
            <nav className={`${isScrolled ? "scrolled" : ""} flex`}>
                <div className="left flex a-center">
                    <div className="brand flex a-center j-center">
                        <img src={logo} alt="Logo" />
                    </div>
                    <ul className="links flex">
                        {links.map(({ name, link }) => {
                            return (
                                <li key={name}>
                                    <Link to={link}>{name}</Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="right flex a-center">
                    <div className={`search ${showSearch ? "show-search" : ""}`}>
                        <button
                            onFocus={() => setShowSearch(true)}
                            onBlur={() => {
                                if (!inputHover) {
                                    setShowSearch(false);
                                }
                            }}
                        >
                            <FaSearch />
                        </button>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            onMouseEnter={() => setInputHover(true)}
                            onMouseLeave={() => setInputHover(false)}
                            onBlur={() => {
                                setShowSearch(false);
                                setInputHover(false);
                            }}
                        />
                        {
                            searchResults.length > 0 && (
                                <div className={"search-results"}>
                                    {
                                        searchResults.map((movie) => (
                                            <Link key={movie.id} to={`/movie/${movie.id}`} className={"search-item"}>
                                                <div className={"movie-card"}>
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                                        alt={movie.title}
                                                    />
                                                    <div className={"movie-info"}>
                                                        <h4>{movie.title}</h4>
                                                        <p>⭐ {movie.vote_average.toFixed(1)}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    }
                                </div>
                        )}
                    </div>
                    <button onClick={() => signOut(firebaseAuth)}>
                        <FaPowerOff />
                    </button>
                </div>
            </nav>
        </Container>
    );
}

const Container = styled.div`
    .search-results {
        position: absolute;
        top: 100%;
        left: 0;
        width: 250px;
        background-color: black;
        border: 1px solid white;
        z-index: 10;
        max-height: 300px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
    }

    .search-item {
        display: flex;
        text-decoration: none;
        color: white;
        transition: background-color 0.3s ease-in-out;
    }

    .search-item:hover {
        background-color: gray;
    }

    .movie-card {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .movie-card img {
        width: 50px;
        height: 75px;
        object-fit: cover;
        border-radius: 5px;
    }

    .movie-info {
        display: flex;
        flex-direction: column;
    }

    .movie-info h4 {
        font-size: 14px;
        margin: 0;
    }

    .movie-info p {
        font-size: 12px;
        margin: 0;
        color: yellow;
    }

    .scrolled {
        background-color: black;
    }
    nav {
        position: sticky;
        top: 0;
        height: 6.5rem;
        width: 100%;
        justify-content: space-between;
        position: fixed;
        top: 0;
        z-index: 2;
        padding: 0 4rem;
        align-items: center;
        transition: 0.3s ease-in-out;
        .left {
            gap: 2rem;
            .brand {
                img {
                    height: 4rem;
                }
            }
            .links {
                list-style-type: none;
                gap: 2rem;
                li {
                    a {
                        color: white;
                        text-decoration: none;
                    }
                }
            }
        }
        .right {
            gap: 1rem;
            button {
                background-color: transparent;
                border: none;
                cursor: pointer;
                &:focus {
                    outline: none;
                }
                svg {
                    color: #f34242;
                    font-size: 1.2rem;
                }
            }
            .search {
                display: flex;
                gap: 0.4rem;
                align-items: center;
                justify-content: center;
                padding: 0.2rem;
                padding-left: 0.5rem;
                button {
                    background-color: transparent;
                    border: none;
                    &:focus {
                        outline: none;
                    }
                    svg {
                        color: white;
                        font-size: 1.2rem;
                    }
                }
                input {
                    width: 0;
                    opacity: 0;
                    visibility: hidden;
                    transition: 0.3s ease-in-out;
                    background-color: transparent;
                    border: none;
                    color: white;
                    &:focus {
                        outline: none;
                    }
                }
            }
            .show-search {
                border: 1px solid white;
                background-color: rgba(0, 0, 0, 0.6);
                input {
                    width: 100%;
                    opacity: 1;
                    visibility: visible;
                    padding: 0.3rem;
                }
            }
        }
    }
`;
