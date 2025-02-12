import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Movie from "./pages/Movie.tsx";

export default function app(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/login"} element={<Login/>}></Route>
                <Route path={"/signup"} element={<Signup/>}></Route>
                <Route path={"/"} element={<Movie/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}