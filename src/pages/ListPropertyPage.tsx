import { useState } from "react";

type FormData = {
  name: string;
  brokerage: string;
  email: string;
  phone: string;
  city: string;
  propertyAddress: string;
  propertyType: string;
  listingPrice: string;
  hasTour: string;
  message: string;
};

function ListPropertyPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    brokerage: "",
    email: "",
    phone: "",
    city: "",
    propertyAddress: "",
    propertyType: "",
    listingPrice: "",
    hasTour: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!formData.city.trim()) {
      setError("Please enter the property city.");
      return;
    }

    if (!formData.propertyAddress.trim()) {
      setError("Please enter the property address.");
      return;
    }

    if (!formData.propertyType) {
      setError("Please select a property type.");
      return;
    }

    setSuccess(
      "Thank you. Your property request has been received."
    );

    setFormData({
      name: "",
      brokerage: "",
      email: "",
      phone: "",
      city: "",
      propertyAddress: "",
      propertyType: "",
      listingPrice: "",
      hasTour: "",
      message: "",
    });
  };

  return (
    <main className="list-property-page">
      <section className="list-property-header">
        <p className="section-eyebrow">FOR REALTORS</p>

        <h1>List Your Property</h1>

        <p>
          Tell us about your listing and we’ll contact you about creating
          an immersive ListingView360 property experience.
        </p>
      </section>

      <section className="list-property-content">
        <div className="list-property-info">
          <p className="section-eyebrow">GET STARTED</p>

          <h2>Bring Your Listing Online</h2>

          <p>
            Submit your property information and we'll discuss the best
            virtual-tour experience for your listing.
          </p>

          <div className="list-property-benefits">
            <div>
              <strong>360° Virtual Tour</strong>
              <p>Allow buyers to explore the property remotely.</p>
            </div>

            <div>
              <strong>Professional Listing Page</strong>
              <p>
                Showcase the property in a clean, mobile-friendly experience.
              </p>
            </div>

            <div>
              <strong>Buyer Viewing Requests</strong>
              <p>
                Capture interested buyers directly from the property page.
              </p>
            </div>
          </div>
        </div>

        <form
          className="list-property-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Agent / Realtor Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="brokerage">Brokerage</label>
              <input
                id="brokerage"
                name="brokerage"
                type="text"
                value={formData.brokerage}
                onChange={handleChange}
                placeholder="Brokerage name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                placeholder="Toronto"
              />
            </div>

            <div className="form-group">
              <label htmlFor="propertyType">Property Type *</label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
              >
                <option value="">Select type</option>
                <option value="Detached">Detached</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Semi-Detached">Semi-Detached</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="propertyAddress">Property Address *</label>
            <input
              id="propertyAddress"
              name="propertyAddress"
              type="text"
              value={formData.propertyAddress}
              onChange={handleChange}
              placeholder="Property address"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="listingPrice">
                Approx. Listing Price
              </label>

              <input
                id="listingPrice"
                name="listingPrice"
                type="number"
                value={formData.listingPrice}
                onChange={handleChange}
                placeholder="750000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="hasTour">
                Existing 360° Tour?
              </label>

              <select
                id="hasTour"
                name="hasTour"
                value={formData.hasTour}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message">
              Additional Details
            </label>

            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us anything else about the property..."
            />
          </div>

          {error && (
            <p className="form-error">{error}</p>
          )}

          {success && (
            <p className="form-success">{success}</p>
          )}

          <button
            type="submit"
            className="primary-button list-property-submit"
          >
            Submit Property
          </button>

          <p className="form-note">
            No commitment required. We'll contact you to discuss your listing.
          </p>
        </form>
      </section>
    </main>
  );
}

export default ListPropertyPage;