import {API_KEY, TMDB_BASE_URL} from "./constants.ts";

export const searchMovies = async (query: string) => {
    if (!query) return [];

    try {
        const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching search results:", error);
        return [];
    }
};

export const getMovieDetails = async (id: string) => {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos,similar,watch/providers`);
    const data = await response.json();
    return data;
};

