import { Link } from "react-router-dom";

function ForRealtorsPage() {
  return (
    <main className="realtors-page">
      <section className="realtors-hero">
        <div className="realtors-hero-content">
          <p className="section-eyebrow">FOR REALTORS</p>

          <h1>
            Give Buyers a Better Way to
            <span> Explore Your Listings</span>
          </h1>

          <p className="realtors-hero-text">
            Showcase properties with immersive 360° virtual tours,
            professional property pages, and direct viewing requests.
          </p>

          <div className="realtors-actions">
            <Link to="/list-property" className="primary-button">
              List Your Property
            </Link>

            <Link to="/contact" className="secondary-button">
              Request a Demo
            </Link>
          </div>
        </div>
      </section>

      <section className="realtor-benefits-section">
        <p className="section-eyebrow">WHY VIRTUAL TOURS?</p>

        <h2>Help Your Listings Stand Out</h2>

        <div className="realtor-benefits-grid">
          <article className="realtor-benefit-card">
            <h3>360° Property Tours</h3>
            <p>
              Let buyers explore properties remotely before scheduling
              an in-person viewing.
            </p>
          </article>

          <article className="realtor-benefit-card">
            <h3>More Qualified Leads</h3>
            <p>
              Buyers can understand the property better before contacting
              you or requesting a showing.
            </p>
          </article>

          <article className="realtor-benefit-card">
            <h3>Shareable Listing Pages</h3>
            <p>
              Give every property a professional page that can be shared
              with buyers through email, social media, or advertising.
            </p>
          </article>

          <article className="realtor-benefit-card">
            <h3>Direct Viewing Requests</h3>
            <p>
              Capture buyer contact information directly from the property
              experience.
            </p>
          </article>
        </div>
      </section>

      <section className="realtor-process">
        <p className="section-eyebrow">HOW IT WORKS</p>

        <h2>From Listing to Virtual Experience</h2>

        <div className="realtor-process-grid">
          <div>
            <span>01</span>
            <h3>Submit Your Property</h3>
            <p>Send us the property information and your contact details.</p>
          </div>

          <div>
            <span>02</span>
            <h3>Create the Experience</h3>
            <p>
              We prepare a professional property page with an immersive
              virtual-tour experience.
            </p>
          </div>

          <div>
            <span>03</span>
            <h3>Share With Buyers</h3>
            <p>
              Share your listing and receive viewing requests from
              interested buyers.
            </p>
          </div>
        </div>
      </section>

      <section className="realtor-bottom-cta">
        <div>
          <p className="section-eyebrow">READY TO GET STARTED?</p>
          <h2>Bring Your Next Listing Online</h2>
          <p>
            Submit a property and see how ListingView360 can create a more
            immersive experience for potential buyers.
          </p>
        </div>

        <Link to="/list-property" className="primary-button">
          List Your Property
        </Link>
      </section>
    </main>
  );
}

export default ForRealtorsPage;