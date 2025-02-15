import CardSlider from "./CardSliders.tsx";
import styled from "styled-components";

export default function Slider({ movies }) {
    const getMoviesFromRange = (from, to) => {
        return movies.slice(from, to);
    };
    return (
        <Container>
            <CardSlider data={getMoviesFromRange(0, 10)} title="Trending Now" />
            <CardSlider data={getMoviesFromRange(10, 20)} title="Popular Movies" />
            <CardSlider data={getMoviesFromRange(20, 30)} title="Editors Choice"/>
            <CardSlider data={getMoviesFromRange(30, 40)} title="Top Picks"/>
            <CardSlider data={getMoviesFromRange(40, 50)} title="Featured Movies" />
            <CardSlider data={getMoviesFromRange(50, 60)} title="Must Watch" />
        </Container>
    );
}

const Container = styled.div``;
