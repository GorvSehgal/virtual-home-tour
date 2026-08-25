import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/properties">Properties</Link>
    </nav>
  );
}

export default Navbar;