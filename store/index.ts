import { configureStore, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_KEY, TMDB_BASE_URL } from "../src/utils/constants";

interface Genre {
    id: number;
    name: string;
}

interface Movie {
    id: number;
    name: string;
    image: string;
    genres: string[];
}

interface MovieState {
    movies: Movie[];
    genresLoaded: boolean;
    genres: Genre[];
}

const initialState: MovieState = {
    movies: [],
    genresLoaded: false,
    genres: [],
};

export const getGenres = createAsyncThunk<Genre[]>(
    "movie/genres",
    async () => {
        const { data: { genres }
        } = await axios.get(
            "https://api.themoviedb.org/3/genre/movie/list?api_key=e5a20ef29dab251e5cf834431dc4a8d0"
        );
        return genres;
    }
);

const createArrayFromRawData = (array, moviesArray: Movie[], genres: Genre[]) => {
    array.forEach((movie) => {
        const movieGenres: string[] = [];
        movie.genre_ids.forEach((genre: number) => {
            const name = genres.find(({ id }) => id === genre);
            if (name) movieGenres.push(name.name);
        });
        if (movie.backdrop_path)
            moviesArray.push({
                id: movie.id,
                name: movie?.original_name ? movie.original_name : movie.original_title,
                image: movie.backdrop_path,
                genres: movieGenres.slice(0, 3),
            });
    });
};

const getRawData = async (api: string, genres: Genre[], paging = false): Promise<Movie[]> => {
    const moviesArray: Movie[] = [];
    for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
        const { data: { results } } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
        createArrayFromRawData(results, moviesArray, genres);
    }
    return moviesArray;
};

interface FetchDataByGenreArgs {
    genre: number;
    type: string;
}

export const fetchDataByGenre = createAsyncThunk<Movie[], FetchDataByGenreArgs>(
    "movie/genre",
    async ({ genre, type }, thunkAPI) => {
        const { movie: { genres } } = thunkAPI.getState() as { movie: MovieState };
        return getRawData(
            `https://api.themoviedb.org/3/discover/${type}?api_key=e5a20ef29dab251e5cf834431dc4a8d0&with_genres=${genre}`,
            genres
        );
    }
);

interface FetchMoviesArgs {
    type: string;
}

export const fetchMovies = createAsyncThunk<Movie[], FetchMoviesArgs>(
    "movie/trending",
    async ({ type }, thunkAPI) => {
        const { movie: { genres } } = thunkAPI.getState() as { movie: MovieState };
        return getRawData(
            `${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
            genres,
            true
        );
    }
);

export const getUsersLikedMovies = createAsyncThunk<Movie[], string>(
    "movie/getLiked",
    async (email) => {
        const { data: { movies } } = await axios.get(`http://localhost:5000/api/user/liked/${email}`);
        return movies;
    }
);

interface RemoveMovieFromLikedArgs {
    movieId: number;
    email: string;
}

export const removeMovieFromLiked = createAsyncThunk<Movie[], RemoveMovieFromLikedArgs>(
    "movie/deleteLiked",
    async ({ movieId, email }) => {
        const { data: { movies } } = await axios.put("http://localhost:5000/api/user/remove", {
            email,
            movieId,
        });
        return movies;
    }
);

const MovieSlice = createSlice({
    name: "Movie",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getGenres.fulfilled, (state, action: PayloadAction<Genre[]>) => {
            state.genres = action.payload;
            state.genresLoaded = true;
        });
        builder.addCase(fetchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
            state.movies = action.payload;
        });
        builder.addCase(fetchDataByGenre.fulfilled, (state, action: PayloadAction<Movie[]>) => {
            state.movies = action.payload;
        });
        builder.addCase(getUsersLikedMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
            state.movies = action.payload;
        });
        builder.addCase(removeMovieFromLiked.fulfilled, (state, action: PayloadAction<Movie[]>) => {
            state.movies = action.payload;
        });
    },
});

export const store = configureStore({
    reducer: {
        movie: MovieSlice.reducer,
    },
});

// export const { setGenres, setMovies } = MovieSlice.actions;
