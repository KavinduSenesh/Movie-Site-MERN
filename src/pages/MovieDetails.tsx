import {useEffect, useRef, useState} from "react";
import {Link, useParams} from "react-router-dom";
import styled from "styled-components";
import { getMovieDetails } from "../utils/api.ts";
import {FaArrowLeft, FaChevronLeft, FaChevronRight, FaClock, FaPlayCircle, FaStar} from "react-icons/fa";

export default function MovieDetails() {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<any>(null);
    const [trailer, setTrailer] = useState<string | null>(null);
    const [showTrailer, setShowTrailer] = useState<boolean>(false);
    const castSliderRef = useRef<HTMLDivElement>(null);
    const [showFullOverview, setShowFullOverview] = useState<boolean>(false);

    const scrollCast = (direction: 'left' | 'right') => {
        if (castSliderRef.current) {
            const slider = castSliderRef.current;
            const scrollAmount = 140 + 14; // Actor width + gap
            const maxScroll = slider.scrollWidth - slider.clientWidth;

            let newScrollPosition = direction === 'left'
                ? slider.scrollLeft - scrollAmount
                : slider.scrollLeft + scrollAmount;

            newScrollPosition = Math.max(0, Math.min(newScrollPosition, maxScroll));

            slider.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const fetchMovie = async () => {
            if (id) {
                const data = await getMovieDetails(id);
                setMovie(data);

                // Get the first official YouTube trailer
                const trailerVideo = data.videos.results.find((video: any) =>
                    video.site === "YouTube" && video.type === "Trailer"
                );
                setTrailer(trailerVideo ? trailerVideo.key : null);
            }
        };
        fetchMovie();

        window.scrollTo(0, 0);
    }, [id]);

    if (!movie) return (
        <LoadingContainer>
            <div className="loading-spinner"></div>
            <h2>Loading movie details...</h2>
        </LoadingContainer>
    );

    return (
        <Container backdrop={movie.backdrop_path}>
            <div className="backdrop-overlay"></div>

            <div className="back-button">
                <Link to="/">
                    <FaArrowLeft /> Back to Browse
                </Link>
            </div>

            <div className="movie-content">
                <div className="poster-container">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="poster"
                    />

                    {trailer && (
                        <button
                            className="play-trailer"
                            onClick={() => setShowTrailer(true)}
                            aria-label="Play trailer"
                        >
                            <FaPlayCircle />
                            <span>Watch Trailer</span>
                        </button>
                    )}
                </div>

                <div className="details">
                    <h1>{movie.title} <span className="year">({movie.release_date?.split("-")[0]})</span></h1>

                    <div className="meta-info">
                        <div className="rating">
                            <FaStar />
                            <span>{movie.vote_average.toFixed(1)}</span>
                        </div>

                        <div className="runtime">
                            <FaClock />
                            <span>{movie.runtime} min</span>
                        </div>

                        <div className="genres">
                            {movie.genres.map((g: any) => (
                                <span key={g.id} className="genre-tag">{g.name}</span>
                            ))}
                        </div>
                    </div>

                    <div className={`overview ${showFullOverview ? 'expanded' : ''}`}>
                        <h3>Overview</h3>
                        <p>{movie.overview}</p>
                    </div>

                    <div className="providers">
                        <h3>Where to Watch</h3>
                        <div className="provider-list">
                            {movie["watch/providers"]?.results?.US?.flatrate?.length > 0 ? (
                                movie["watch/providers"].results.US.flatrate.map((provider: any) => (
                                    <div key={provider.provider_id} className="provider">
                                        {provider.provider_name}
                                    </div>
                                ))
                            ) : (
                                <div className="no-providers">Not available for streaming</div>
                            )}
                        </div>
                    </div>

                    <div className="cast-section">
                        <div className="cast-header">
                            <h3>Top Cast</h3>
                            <div className="cast-controls">
                                <button
                                    className="cast-arrow"
                                    onClick={() => scrollCast('left')}
                                    aria-label="Scroll cast left"
                                >
                                    <FaChevronLeft />
                                </button>
                                <button
                                    className="cast-arrow"
                                    onClick={() => scrollCast('right')}
                                    aria-label="Scroll cast right"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        </div>

                        <div className="cast-slider-container">
                            <div className="cast-slider" ref={castSliderRef}>
                                {movie.credits?.cast.slice(0, 12).map((actor: any) => (
                                    <div key={actor.id} className="actor">
                                        <div className="actor-image-container">
                                            {actor.profile_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                                    alt={actor.name}
                                                />
                                            ) : (
                                                <div className="no-photo">{actor.name.charAt(0)}</div>
                                            )}
                                        </div>
                                        <p className="actor-name">{actor.name}</p>
                                        <p className="character">{actor.character}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="slider-gradient-left"></div>
                            <div className="slider-gradient-right"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="similar-section">
                <h2>Similar Movies You Might Like</h2>
                <div className="similar-movies">
                    {movie.similar?.results.slice(0, 8).map((sim: any) => (
                        <Link key={sim.id} to={`/movie/${sim.id}`} className="similar-movie">
                            <div className="poster-wrapper">
                                {sim.poster_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${sim.poster_path}`}
                                        alt={sim.title}
                                    />
                                ) : (
                                    <div className="no-poster">{sim.title}</div>
                                )}
                                <div className="hover-info">
                                    <div className="rating">
                                        <FaStar />
                                        <span>{sim.vote_average.toFixed(1)}</span>
                                    </div>
                                    <div className="year">{sim.release_date?.split("-")[0] || "N/A"}</div>
                                </div>
                            </div>
                            <p className="title">{sim.title}</p>
                        </Link>
                    ))}
                </div>
            </div>

            {showTrailer && trailer && (
                <div className="trailer-overlay" onClick={() => setShowTrailer(false)}>
                    <div className="trailer-container" onClick={(e) => e.stopPropagation()}>
                        <button className="close-trailer" onClick={() => setShowTrailer(false)}>×</button>
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${trailer}?autoplay=1`}
                            title="Movie Trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </Container>
    );
}

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #0a0a0a;
    color: white;
    
    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        border-top-color: #f34242;
        animation: spin 1s ease-in-out infinite;
        margin-bottom: 1rem;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    
    h2 {
        font-size: 1.5rem;
        font-weight: 500;
    }
`;

const Container = styled.div<{ backdrop: string }>`
    min-height: 100vh;
    background-color: #0a0a0a;
    color: white;
    padding-top: 6.5rem; /* Same height as navbar */
    position: relative;
    overflow: hidden;

    .backdrop-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        //min-height: 100vh;
        height: 100vh;
        background: ${props => props.backdrop
                ? `linear-gradient(0deg, #0a0a0a 30%, rgba(10, 10, 10, 0.8) 60%, rgba(10, 10, 10, 0.6) 80%), 
               url(https://image.tmdb.org/t/p/original${props.backdrop}) no-repeat top center/cover`
                : 'none'};
        z-index: 0;
        pointer-events: none;
        //background-size: 2000% auto;
        background-position: center;
    }

    .back-button {
        position: fixed;
        top: 4rem;
        left: 4rem;
        z-index: 3;

        a {
            display: flex;
            align-items: center;
            color: white;
            text-decoration: none;
            font-size: 1rem;
            background-color: rgba(0, 0, 0, 0.5);
            padding: 0.6rem 1rem;
            border-radius: 30px;
            backdrop-filter: blur(8px);
            transition: all 0.3s ease;

            svg {
                margin-right: 0.5rem;
            }

            &:hover {
                background-color: rgba(243, 66, 66, 0.2);
                transform: translateY(-2px);
            }
        }
    }

    .movie-content {
        display: flex;
        max-width: 1200px;
        margin: 0 auto;
        padding: 3rem 4rem;
        position: relative;
        z-index: 1;

        @media (max-width: 900px) {
            flex-direction: column;
            align-items: center;
            padding: 2rem;
        }
    }

    .poster-container {
        flex: 0 0 320px;
        margin-right: 3rem;
        position: relative;

        @media (max-width: 900px) {
            margin-right: 0;
            margin-bottom: 2rem;
        }

        .poster {
            width: 100%;
            border-radius: 12px;
            box-shadow: 0 6px 30px rgba(0, 0, 0, 0.5);
            transition: transform 0.3s ease;

            &:hover {
                transform: scale(1.02);
            }
        }

        .play-trailer {
            position: absolute;
            bottom: 1.5rem;
            left: 50%;
            transform: translateX(-50%);
            background-color: #f34242;
            color: white;
            border: none;
            border-radius: 30px;
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(243, 66, 66, 0.3);

            &:hover {
                background-color: #e03131;
                transform: translateX(-50%) translateY(-5px);
            }

            svg {
                font-size: 1.2rem;
            }
        }
    }

    .details {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        h1 {
            font-size: 2.5rem;
            margin: 0;
            font-weight: 700;
            line-height: 1.2;

            .year {
                font-weight: 400;
                opacity: 0.8;
            }
        }

        .meta-info {
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
            align-items: center;

            .rating, .runtime {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1rem;

                svg {
                    color: #FFD700;
                }
            }

            .genres {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;

                .genre-tag {
                    background-color: rgba(255, 255, 255, 0.1);
                    padding: 0.4rem 0.8rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    transition: all 0.3s ease;

                    &:hover {
                        background-color: rgba(243, 66, 66, 0.2);
                        transform: translateY(-2px);
                    }
                }
            }
        }

        h3 {
            font-size: 1.3rem;
            margin: 0 0 0.8rem 0;
            font-weight: 600;
        }

        .overview p {
            font-size: 1rem;
            line-height: 1.6;
            margin: 0;
            opacity: 0.9;
            overflow: visible;
            white-space: normal;
        }
        
        .providers {
            .provider-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.8rem;

                .provider, .no-providers {
                    background-color: rgba(255, 255, 255, 0.1);
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;

                    &:hover {
                        background-color: rgba(255, 255, 255, 0.15);
                        transform: translateY(-2px);
                    }
                }
            }
        }
    }

    .cast-section {
        .cast-header {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 1rem;
            overflow: hidden;

            h3 {
                margin: 0;
            }

            .cast-controls {
                display: flex;
                gap: 0.5rem;
                justify-content: flex-start; 
                padding-left: 1rem;
                
                .cast-arrow {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: none;
                    background-color: rgba(255, 255, 255, 0.1);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;

                    &:hover {
                        background-color: rgba(243, 66, 66, 0.3);
                        transform: translateY(-2px);
                    }

                    &:active {
                        transform: translateY(0px);
                    }
                }
            }
        }

        .cast-slider-container {
            position: relative;
            margin: 0 -0.5rem;
            overflow: hidden;
            padding-left: 3rem;

            .slider-gradient-left, .slider-gradient-right {
                position: absolute;
                top: 0;
                bottom: 0;
                width: 60px;
                z-index: 2;
                pointer-events: none;
            }

            .slider-gradient-left {
                left: 0;
                background: linear-gradient(to right, #0a0a0a, rgba(10, 10, 10, 0));
            }

            .slider-gradient-right {
                right: 0;
                background: linear-gradient(to left, #0a0a0a, rgba(10, 10, 10, 0));
            }
        }

        .cast-slider {
            display: flex;
            gap: 1.2rem;
            overflow-x: hidden;
            padding: 1rem 0.5rem;
            -ms-overflow-style: none;  /* Hide scrollbar for IE and Edge */
            scrollbar-width: none;  /* Hide scrollbar for Firefox */
            scroll-behavior: smooth;
            position: relative;

            /* Hide scrollbar for Chrome, Safari and Opera */
            &::-webkit-scrollbar {
                display: none;
            }

            .actor {
                flex: 0 0 140px;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                transition: all 0.3s ease;

                &:hover {
                    transform: translateY(-5px);

                    .actor-image-container {
                        transform: scale(1.05);
                        box-shadow: 0 10px 25px rgba(243, 66, 66, 0.2);

                        &::after {
                            opacity: 1;
                        }
                    }
                }

                .actor-image-container {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    margin-bottom: 1rem;
                    overflow: hidden;
                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease;

                    &::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        border-radius: 50%;
                        box-shadow: inset 0 0 0 3px rgba(243, 66, 66, 0.3);
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    }

                    img, .no-photo {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    .no-photo {
                        background-color: #2a2a2a;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 2.5rem;
                        color: #aaa;
                    }
                }

                .actor-name {
                    font-weight: 600;
                    margin: 0;
                    font-size: 1rem;
                    color: white;
                }

                .character {
                    margin: 0.3rem 0 0 0;
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.7);
                }
            }
        }
    }
    .similar-section {
        padding: 3rem 4rem;
        position: relative;
        z-index: 1;

        @media (max-width: 900px) {
            padding: 2rem;
        }

        h2 {
            font-size: 1.8rem;
            margin: 0 0 1.5rem 0;
            font-weight: 600;
        }

        .similar-movies {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 1.5rem;

            .similar-movie {
                text-decoration: none;
                color: white;
                transition: transform 0.3s ease;

                &:hover {
                    transform: translateY(-8px);

                    .hover-info {
                        opacity: 1;
                    }
                }

                .poster-wrapper {
                    position: relative;
                    margin-bottom: 0.8rem;
                    border-radius: 8px;
                    overflow: hidden;
                    aspect-ratio: 2/3;

                    img, .no-poster {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: all 0.3s ease;
                    }

                    .no-poster {
                        background-color: #2a2a2a;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        padding: 1rem;
                        font-size: 0.9rem;
                    }

                    .hover-info {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
                        padding: 0.8rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        opacity: 0;
                        transition: opacity 0.3s ease;

                        .rating {
                            display: flex;
                            align-items: center;
                            gap: 0.3rem;
                            font-size: 0.85rem;

                            svg {
                                color: #FFD700;
                                font-size: 0.8rem;
                            }
                        }

                        .year {
                            font-size: 0.85rem;
                            opacity: 0.8;
                        }
                    }
                }

                .title {
                    margin: 0;
                    font-size: 0.95rem;
                    font-weight: 500;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
            }
        }
    }

    .trailer-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 2rem;

        .trailer-container {
            position: relative;
            width: 90%;
            max-width: 1000px;
            aspect-ratio: 16/9;

            .close-trailer {
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                z-index: 1001;
            }
        }
    }
`;
