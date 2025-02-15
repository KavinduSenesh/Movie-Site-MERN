import {configureStore, createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {API_KEY, TMDB_BASE_URL} from "../src/utils/constants.ts";
import axios from "axios";
import {Await} from "react-router-dom";

const initialState = {
    movies: [],
    genresLoaded: false,
    genres: [],
};

export const getGenres = createAsyncThunk("movie/genres", async () => {
    const {
        data: { genres },
    } = await axios.get(
        `${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );
    return genres;
});

interface FetchMoviesArgs {
    type: string;
}

const getRawData = async (
    api,
                          genres,
                          paging = false) => {
    const moviesArray = [];
    for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
        const {
            data: { results },
        } = Await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
        createArrayFromRawData(results, genres, moviesArray);
    }
    return moviesArray;
};

export const fetchMovies = createAsyncThunk(
    "netflix/trending",
    async ({ type }: FetchMoviesArgs, { getState }) => {
        const state = getState() as RootState;
        const genres = state.movie.genres;
        return getRawData(
            `${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
            genres,
            true
        );
    }
);

const MovieSlice = createSlice({
    name: "Movie",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getGenres.fulfilled, (state, action) => {
            state.genres = action.payload;
            state.genresLoaded = true;
        })
    },
});

export const store = configureStore({
    reducer: {
        movie: MovieSlice.reducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

