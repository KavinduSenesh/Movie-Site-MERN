import {configureStore, createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import axios from "axios";
import {API_KEY, TMDB_BASE_URL} from "../src/utils/constants.ts";

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
        const {
            data: { genres },
        } = await axios.get(
            `${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}`
        );
        return genres;
    }
);

const createArrayFromRawData = (
    array: any[],
    moviesArray: Movie[],
    genres: Genre[]
): void => {
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

const getRawData = async (
    api: string,
    genres: Genre[],
    paging: boolean = false
): Promise<Movie[]> => {
    const moviesArray: Movie[] = [];
    for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
        const {
            data: { results },
        } = await axios.get<{ results: any[] }>(`${api}${paging ? `&page=${i}` : ""}`);
        createArrayFromRawData(results, moviesArray, genres);
    }
    return moviesArray;
};

interface GenreType {
    genre: string;
    type: string;
}

export const fetchDataByGenre = createAsyncThunk<Movie[], GenreType>(
    "movie/genre",
    async ({ genre, type }, thunkAPI) => {
        const {
            movie: { genres },
        } = thunkAPI.getState() as { movie: MovieState };
        return getRawData(
            `https://api.themoviedb.org/3/discover/${type}?api_key=3d39d6bfe362592e6aa293f01fbcf9b9&with_genres=${genre}`,
            genres
        );
    }
);

export const fetchMovies = createAsyncThunk<Movie[], { type: string }>(
    "movie/trending",
    async ({ type }, thunkAPI) => {
        const {
            movie: { genres },
        } = thunkAPI.getState() as { movie: MovieState };
        const data = await getRawData(
            `${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
            genres,
            true
        );
        return data;
    }
);


export const getUsersLikedMovies = createAsyncThunk<Movie[], string>(
    "movie/getLiked",
    async (email) => {
        const {
            data: { movies },
        } = await axios.get(`http://localhost:5000/api/user/liked/${email}`);
        return movies;
    }
);

export const removeMovieFromLiked = createAsyncThunk<Movie[], { movieId: number; email: string }>(
    "movie/deleteLiked",
    async ({ movieId, email }) => {
        const {
            data: { movies },
        } = await axios.put("http://localhost:5000/api/user/remove", {
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
