import { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import styled from "styled-components";
import { getMovieDetails } from "../utils/api.ts";

export default function MovieDetails() {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<any>(null);
    const [trailer, setTrailer] = useState<string | null>(null);
    const [showTrailer, setShowTrailer] = useState<boolean>(false);

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
        
    }, [id]);

    if (!movie) return <h2>Loading...</h2>;

    return (
        <Container>
            <div className="movie-details">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <div className="details">
                    <h1>{movie.title} ({movie.release_date?.split("-")[0]})</h1>
                    <p><strong>Overview:</strong> {movie.overview}</p>
                    <p><strong>Genres:</strong> {movie.genres.map((g: any) => g.name).join(", ")}</p>
                    <p><strong>Runtime:</strong> ⏳ {movie.runtime} minutes</p>
                    <p><strong>Rating:</strong> ⭐ {movie.vote_average.toFixed(1)}</p>

                    {trailer && (
                        <div className="trailer">
                            <h3>🎥 Official Trailer</h3>
                            <iframe
                                width="100%"
                                height="315"
                                src={`https://www.youtube.com/embed/${trailer}`}
                                title="Movie Trailer"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}

                    <h3>🎭 Top Cast</h3>
                    <div className="cast">
                        {movie.credits?.cast.slice(0, 6).map((actor: any) => (
                            <div key={actor.id} className="actor">
                                <img src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} alt={actor.name} />
                                <p>{actor.name} <br /><small>{actor.character}</small></p>
                            </div>
                        ))}
                    </div>

                    <h3>🎬 Similar Movies</h3>
                    <div className="similar-movies">
                        {movie.similar?.results.slice(0, 5).map((sim: any) => (
                            <Link key={sim.id} to={`/movie/${sim.id}`} className="similar-movie">
                                <img src={`https://image.tmdb.org/t/p/w200${sim.poster_path}`} alt={sim.title} />
                                <p>{sim.title}</p>
                            </Link>
                        ))}
                    </div>

                    <h3>📺 Where to Watch</h3>
                    <p>{movie["watch/providers"]?.results?.US?.flatrate?.map((provider: any) => provider.provider_name).join(", ") || "Not available for streaming"}</p>

                </div>
            </div>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: black;
    color: white;
    .movie-details {
        display: flex;
        gap: 20px;
        max-width: 800px;
        img {
            width: 300px;
            border-radius: 10px;
        }
        .details {
            display: flex;
            flex-direction: column;
            gap: 10px;
            .trailer {
                margin-top: 15px;
            }
            iframe {
                border-radius: 10px;
                max-width: 100%;
            }
            h3{
                margin-top: 15px;
            }
            .cast, .similar-movies {
                display: flex;
                gap: 10px;
                overflow-x: auto;
            }
            .actor, .similar-movie {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100px;
                text-align: center;
            }
            .actor img, .similar-movie img {
                width: 80px;
                height: 80px;
                border-radius: 50%;
            }
        }
    }
`;
