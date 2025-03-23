import React from "react";

const Navbar = ({ setView, view }) => {
    {/* Return null if home page */}
    if (view === "home") return null;

    return (
        <nav>
          {view === "material" && (
            <>
              <button onClick={() => setView("home")}>Home</button>
              <button onClick={() => setView("test1")}>Test1</button>
            </>
          )}
          {view === "fabricate" && (
            <>
              <button onClick={() => setView("home")}>Home</button>
              <button onClick={() => setView("test2")}>Test2</button>
            </>
          )}
          {view === "transport" && (
            <>
              <button onClick={() => setView("home")}>Home</button>
              <button onClick={() => setView("test2")}>Test3</button>
            </>
          )}
        </nav>
    );
}

export default Navbar;