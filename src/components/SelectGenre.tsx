import { useDispatch } from "react-redux";
import styled from "styled-components";
import {fetchDataByGenre} from "../../store";
import {FaChevronDown} from "react-icons/fa";
export default function SelectGenre({ genres, type }) {
    const dispatch = useDispatch();

    return (
        <SelectContainer
            className="flex">
        <Select
            onChange={(e) => {
                dispatch(
                    fetchDataByGenre({
                        genres,
                        genre: e.target.value,
                        type,
                    })
                );
            }}
        >
            {genres.map((genre) => {
                return (
                    <option value={genre.id} key={genre.id}>
                        {genre.name}
                    </option>
                );
            })}
        </Select>
        <IconWrapper>
            <FaChevronDown />
        </IconWrapper>
        </SelectContainer>
    );
}

const SelectContainer = styled.div`  margin-left: 5rem;
    position: relative;
    margin-left: 5rem;
    width: auto;
    display: inline-block;
`;

const Select = styled.select`
    cursor: pointer;
    font-size: 1rem;
    padding: 0.6rem 2.5rem 0.6rem 1rem;
    background-color: rgba(15, 15, 15, 0.7);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 30px;
    appearance: none;
    outline: none;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    
    &:hover {
        background-color: rgba(40, 40, 40, 0.7);
        border-color: rgba(255, 255, 255, 0.3);
    }
    
    &:focus {
        box-shadow: 0 0 0 2px rgba(243, 66, 66, 0.3);
        border-color: rgba(243, 66, 66, 0.5);
    }
    
    option {
        background-color: #1a1a1a;
        color: white;
        padding: 10px;
    }
    
`;

const IconWrapper = styled . div `
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #f34242;
    font-size: 0.8rem;
    transition: transform 0.3s ease;

    ${SelectContainer}:hover & {
        transform: translateY(-50%) translateX(2px);
    }

    ${Select}:focus + & {
        transform: translateY(-50%) rotate(180deg);
    }
`;
