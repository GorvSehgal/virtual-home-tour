function ContactPage() {
    return (
      <main className="contact-page">
        <section className="contact-hero">
          <p className="section-eyebrow">CONTACT</p>
          <h1>Let’s Talk About Your Listing</h1>
          <p>
            Have a property to showcase or questions about ListingView360?
            Send us a message and we’ll get back to you.
          </p>
        </section>
  
        <section className="contact-content">
          <div className="contact-card">
            <h2>For Realtors</h2>
            <p>
              Want to create an immersive property experience for one of your
              listings?
            </p>
  
            <a
              href="/list-property"
              className="primary-button"
            >
              List Your Property
            </a>
          </div>
  
          <div className="contact-card">
            <h2>General Inquiries</h2>
            <p>
              Email us for questions, partnerships, or support.
            </p>
  
            <a href="mailto:listingview360@gmail.com">
  listingview360@gmail.com
</a>
          </div>
        </section>
      </main>
    );
  }
  
  export default ContactPage;