import { Link } from "react-router-dom";


function Footer() {
    return (
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h3>ListingView360</h3>
            <p>
              Explore Canadian properties with immersive 360° virtual tours.
            </p>
          </div>
  
          <div>
            <h4>Explore</h4>
            <Link to="/properties">Properties</Link>
            <a href="#virtual-tours">360° Tours</a>
          </div>
  
          <div>
            <h4>For Realtors</h4>
            <Link to="/list-property">List Your Property</Link>
            <Link to="/contact">Contact</Link>
          </div>
  
          <div>
            <h4>Company</h4>
            <Link to="/contact">Contact</Link>
           <Link to="/privacy">Privacy</Link>
          </div>
        </div>
  
        <div className="footer-bottom">
          © 2026 ListingView360
        </div>
      </footer>
    );
  }
  
  export default Footer;