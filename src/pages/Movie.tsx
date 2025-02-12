export default function Movie(){
    return (
        <div>
            <h1>Movie</h1>
            <form>
                <input type="text" placeholder="Movie Name"></input>
                <input type="text" placeholder="Director"></input>
                <input type="text" placeholder="Year"></input>
                <button type="submit">Add Movie</button>
            </form>
        </div>
    );
}