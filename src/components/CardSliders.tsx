import Card from "./Card.tsx";
import styled from "styled-components";
import React, {useEffect, useRef, useState} from "react";
import {AiOutlineLeft, AiOutlineRight} from "react-icons/ai";

type CardSliderProps = {
  data: { id: number; name: string}[];
  title: string;
};

export default React.memo(function CardSlider({data, title}: CardSliderProps){
    const [showControls, setShowControls] = useState(false);
    const [sliderPosition, setSliderPositions] = useState(0);
    const [maxPosition, setMaxPosition] = useState(4);
    const listRef = useRef<HTMLDivElement>(null);

    const handleDirection = (direction: "left" | "right") => {
        if (!listRef.current) return;

        // Define a single unit translation (card width + gap)
        const moveDistance = 230;  // Adjust if necessary to match card width

        if (direction === "left" && sliderPosition > 0) {
            setSliderPositions(sliderPosition - 1); // Move left
            listRef.current.style.transform = `translateX(${-(sliderPosition - 1) * moveDistance}px)`;
        }
        if (direction === "right" && sliderPosition < maxPosition) {
            setSliderPositions(sliderPosition + 1); // Move right
            listRef.current.style.transform = `translateX(${-(sliderPosition + 3.2) * moveDistance}px)`;
        }
    };


    useEffect(() => {
        if (listRef.current && data.length > 0) {
            const containerWidth = listRef.current.parentElement?.clientWidth || 0;
            const visibleItems = Math.floor(containerWidth / 230); // Adjust width to match card size
            const newMaxPosition = Math.ceil(data.length / visibleItems) - 1;
            setMaxPosition(Math.max(0, newMaxPosition));
        }
    }, [data]);


    // const handleDirection = (direction: "left" | "right") => {
    //     if (!listRef.current) return;
    //
    //     let distance = listRef.current.getBoundingClientRect().x - 70;
    //
    //     if (direction === "left" && sliderPosition > 0) {
    //         listRef.current.style.transform = `translateX(${230 + distance}px)`;
    //         setSliderPosition(sliderPosition - 1);
    //     }
    //     if (direction === "right" && sliderPosition < maxPosition) {
    //         listRef.current.style.transform = `translateX(${-230 + distance}px)`;
    //         setSliderPosition(sliderPosition + 1);
    //     }
    // };

    return (
        <Container
            className={"flex column"}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <h1>{title}</h1>
            <div className="progress-bar">
                {Array.from({ length: maxPosition + 1 }).map((_, index) => (
                    <div
                        key={index}
                        className={`progress-dot ${index === sliderPosition ? "active" : ""}`}
                        onClick={() => {
                            if (!listRef.current) return;
                            setSliderPositions(index);
                            listRef.current.style.transform = `translateX(${-(index) * 230}px)`;
                        }}
                    />
                ))}
            </div>
            <div className={"wrapper"}>
                <div
                    className={`slider-action left ${!showControls || sliderPosition === 0 ? "none" : ""} flex j-center a-center`}
                    onClick={() => handleDirection("left")}
                >
                    <div className="control-button">
                        <AiOutlineLeft />
                    </div>
                </div>
                <div className={"flex slider"} ref={listRef}>
                    {data.map((movie, index) => {
                        return <Card movieData={movie} index={index} key={movie.id}></Card>
                    })}
                </div>
                <div
                    className={`slider-action right ${!showControls || sliderPosition === maxPosition ? "none" : ""} flex j-center a-center`}
                    onClick={() => handleDirection("right")}
                >
                    <div className="control-button">
                        <AiOutlineRight />
                    </div>
                </div>
            </div>
        </Container>
    );
});

const Container = styled.div`
    gap: 1rem;
    position: relative;
    padding: 2rem 0;
    overflow: hidden;
    h1 {
        margin-left: 50px;
        font-size: 1.5rem;
        font-weight: 600;
        position: relative;
        display: inline-block;
        padding-bottom: 0.5rem;
        margin-bottom: 0.5rem;

        &:after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 40px;
            height: 3px;
            //background: linear-gradient(to right, #f34242, transparent);
            border-radius: 3px;
        }
    }

    .progress-bar {
        display: flex;
        gap: 8px;
        margin-left: 50px;
        margin-bottom: 10px;

        .progress-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.3);
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                background-color: rgba(255, 255, 255, 0.5);
            }

            &.active {
                background-color: #f34242;
                width: 20px;
                border-radius: 10px;
            }
        }
    }

    .wrapper {
        position: relative;

        .slider {
            //width: max-content;
            gap: 1rem;
            transform: translateX(0px);
            transition: 0.5s ease-in-out;
            margin-left: 50px;
            padding: 10px 0;
            width: fit-content;
        }

        .slider-action {
            position: absolute;
            z-index: 99;
            height: 100%;
            top: 0;
            bottom: 0;
            width: 50px;
            transition: 0.3s ease-in-out;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            .control-button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: all 0.2s ease;

                &:hover {
                    background-color: rgba(243, 66, 66, 0.2);
                    transform: scale(1.1);
                    border-color: rgba(243, 66, 66, 0.3);
                }

                svg {
                    font-size: 1.5rem;
                    color: white;
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
                }
            }
        }

        .none {
            opacity: 0;
            pointer-events: none;
        }

        .left {
            left: 0;
        }

        .right {
            right: 0;
        }
    }

    &:hover {
        .slider {
            .card-container {
                opacity: 0.7;
                transition: all 0.3s ease;

                &:hover {
                    opacity: 1;
                    transform: scale(1.05);
                }
            }
        }
    }
`;
