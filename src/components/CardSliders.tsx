import Card from "./Card.tsx";

export default function CardSlider({data, title}){
    return (
        <div className={"flex"}>
            {data.map((movie, index) => {
              return <Card movieData={movie} index={index} key={movie.id}></Card>
            })}
        </div>
    );

}