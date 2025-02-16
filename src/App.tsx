import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Movie from "./pages/Movie.tsx";
import Player from "./pages/player.tsx";
import MoviePage from "./pages/MoviePage.tsx";

export default function app(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/login"} element={<Login/>}></Route>
                <Route path={"/signup"} element={<Signup/>}></Route>
                <Route path={"/"} element={<Movie/>}></Route>
                <Route path={"player"} element={<Player/>}></Route>
                <Route path={"/moviePage"} element={<MoviePage/>}/>
            </Routes>
        </BrowserRouter>
    );
}