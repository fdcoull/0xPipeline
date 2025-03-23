import React from "react";

const Home = ({ setView }) => {
    return (
        <div>
        <h1>Home Page</h1>

        <nav>
        <button onClick={() => setView("home")}>Home</button>
        <button onClick={() => setView("material")}>Material</button>
        <button onClick={() => setView("fabricate")}>Fabricate</button>
        <button onClick={() => setView("transport")}>Transport</button>
        </nav>
        </div>
    );
}

export default Home;