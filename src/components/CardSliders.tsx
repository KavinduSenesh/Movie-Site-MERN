import Card from "./Card.tsx";

export default function CardSlider({data, title}){
    return (
        <div>
            {data.map((movie, index) => {
              return <Card movieData={movie} index={index} key={movie.id}></Card>
            })}
        </div>
    );

}