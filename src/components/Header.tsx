import styled from "styled-components";
import logo from "../assets/logo1.png";
import {useNavigate} from "react-router-dom";

export default function Header(props){
    const navigate = useNavigate();
    return (
        <Container>
            <div className={"logo"}>
                <img src={logo} alt={"logo"}/>
            </div>
            <button onClick={() => navigate(props.login ? "/login" : "/signup")}>
                {props.login ? "Login" : "Signup"}
            </button>
        </Container>
    );
}

const Container = styled.div`
    padding: 0 4rem;
    .logo {
        img{
            height: 5rem;
        }
    }
    button{
        padding: 0.5rem 1rem;
        background-color: #e50914;
        border: none;
        cursor: pointer;
        color: white;
        border-radius: 0.2rem;
        font-weight: bolder;
        font-size: 1.05rem;
    }
`;