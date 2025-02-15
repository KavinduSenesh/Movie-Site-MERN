import styled from "styled-components";

export default function Card({movieData, isLiked = false}){
    return(
        <Container>
            <img src={`https://image.tmdb.org/t/p/w500${movieData.image}`} alt=""/>
        </Container>
    )
}

const Container = styled.div`
    
`