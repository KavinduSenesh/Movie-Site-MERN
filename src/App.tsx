import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Movie from "./pages/Movie.tsx";
import Player from "./pages/player.tsx";
import MoviePage from "./pages/MoviePage.tsx";
import TVSeriesPage from "./pages/TVSeriesPage.tsx";

export default function app(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/login"} element={<Login/>}></Route>
                <Route path={"/signup"} element={<Signup/>}></Route>
                <Route path={"/"} element={<Movie/>}></Route>
                <Route path={"player"} element={<Player/>}></Route>
                <Route path={"/movie"} element={<MoviePage/>}/>
                <Route path={"/series"} element={<TVSeriesPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}