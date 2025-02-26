import { signOut } from "firebase/auth";
import {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo1.png";
import { firebaseAuth } from "../utils/firebase-config";
import {FaPowerOff, FaSearch, FaSignOutAlt} from "react-icons/fa";
import {searchMovies} from "../utils/api.ts";

type NavbarProps = {
    isScrolled: boolean;
}

export default function Navbar({ isScrolled } : NavbarProps) {
    const [showSearch, setShowSearch] = useState(false);
    const [inputHover, setInputHover] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [activeLink, setActiveLink] = useState("Home");

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

    useEffect(() => {
        // Set active link based on current path
        const currentPath = window.location.pathname;
        const current = links.find(link => currentPath === link.link || currentPath.startsWith(link.link + "/"));
        if (current) setActiveLink(current.name);
    }, []);

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
                                <li key={name} className={activeLink === name ? "active" : ""}>
                                    <Link to={link} onClick={() => setActiveLink(name)}>
                                        {name}
                                        {activeLink === name && <div className="underline"></div>}
                                    </Link>
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
                            aria-label={"Search"}
                        >
                            <FaSearch />
                        </button>
                        <input
                            type="text"
                            placeholder="Search for movies or shows..."
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
                    <button onClick={() => signOut(firebaseAuth)}
                            className={"logout-btn"}
                            aria-label={"Logout"}
                    >
                        <FaSignOutAlt />
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
        right: 0;
        width: 280px;
        background-color: rgba(15, 15, 15, 0.95);
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10;
        max-height: 400px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-track {
            background: rgba(37, 34, 34, 0.2);
            border-radius: 10px;
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
        }
    }

    .search-item {
        display: flex;
        text-decoration: none;
        color: white;
        transition: all 0.2s ease-in-out;
        border-radius: 6px;
        padding: 6px;
    }

    .search-item:hover {
        background-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
    }

    .movie-card {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
    }

    .movie-card img {
        width: 50px;
        height: 75px;
        object-fit: cover;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: transform 0.2s ease;
    }

    .no-poster {
        width: 50px;
        height: 75px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #2a2a2a;
        border-radius: 6px;
        font-size: 10px;
        color: #aaa;
    }

    .movie-info {
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .movie-info h4 {
        font-size: 14px;
        margin: 0;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .movie-info p {
        font-size: 12px;
        margin: 4px 0 0;
        color: #FFD700;
        font-weight: 600;
    }

    .scrolled {
        background-color: rgba(10, 10, 10, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
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

        &:not(.scrolled) {
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
        }

        .left {
            gap: 2.5rem;

            .brand {
                img {
                    height: 4rem;
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
                    transition: transform 0.3s ease;

                    &:hover {
                        transform: scale(1.05);
                    }
                }
            }

            .links {
                list-style-type: none;
                gap: 2.5rem;

                li {
                    position: relative;
                    transition: transform 0.2s ease;

                    &:hover {
                        transform: translateY(-2px);
                    }

                    &.active a {
                        font-weight: 600;
                    }

                    a {
                        color: white;
                        text-decoration: none;
                        font-size: 1.05rem;
                        letter-spacing: 0.3px;
                        padding: 0.5rem 0;
                        transition: color 0.3s ease;
                        display: flex;
                        flex-direction: column;
                        align-items: center;

                        &:hover {
                            color: #f34242;
                        }

                        .underline {
                            height: 3px;
                            width: 100%;
                            background: #f34242;
                            position: absolute;
                            bottom: -8px;
                            left: 0;
                            border-radius: 3px;
                        }
                    }
                }
            }
        }

        .right {
            gap: 1.5rem;

            .logout-btn {
                background-color: transparent;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;

                &:hover {
                    background-color: rgba(243, 66, 66, 0.1);
                    transform: translateY(-2px);
                }

                &:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(243, 66, 66, 0.5);
                }

                svg {
                    color: #f34242;
                    font-size: 1.3rem;
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
                }
            }

            .search {
                display: flex;
                gap: 0.4rem;
                align-items: center;
                justify-content: center;
                padding: 0.2rem;
                padding-left: 0.5rem;
                border-radius: 30px;
                transition: all 0.3s ease;
                position: relative;

                button {
                    background-color: transparent;
                    border: none;
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;

                    &:hover {
                        background-color: rgba(255, 255, 255, 0.1);
                    }

                    &:focus {
                        outline: none;
                    }

                    svg {
                        color: white;
                        font-size: 1.3rem;
                        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
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
                    font-size: 0.95rem;

                    &::placeholder {
                        color: rgba(255, 255, 255, 0.6);
                    }

                    &:focus {
                        outline: none;
                    }
                }
            }

            .show-search {
                border: 1px solid rgba(255, 255, 255, 0.2);
                background-color: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

                input {
                    width: 200px;
                    opacity: 1;
                    visibility: visible;
                    padding: 0.6rem;
                }

                button {
                    &:hover {
                        background-color: rgba(255, 255, 255, 0.05);
                    }
                }
            }
        }
    }

    @media (max-width: 768px) {
        nav {
            padding: 0 2rem;

            .left .links {
                gap: 1.5rem;
            }

            .right .show-search input {
                width: 150px;
            }
        }
    }
`;
