import { useState } from "react";
import { useForm } from "@formspree/react";

function BookingForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [state, submitToFormspree] = useForm("xabcdeyz")

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    if (phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!preferredDate) {
      setError("Please select a preferred date.");
      return;
    }

    await submitToFormspree(e);
  };

  if (state.succeeded) {
    return (
      <div className="booking-success">
        <h3>Viewing Request Sent</h3>
        <p>
          Thank you. We’ll contact you soon to confirm your viewing.
        </p>
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>

        <input
          className="booking-input"
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="email">Email:</label>

        <input
          className="booking-input"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="phone">Phone:</label>

        <input
          className="booking-input"
          type="tel"
          id="phone"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="preferredDate">
          Preferred Date:
        </label>

        <input
          className="booking-input"
          type="date"
          id="preferredDate"
          name="preferredDate"
          value={preferredDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setPreferredDate(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="message">Message:</label>

        <textarea
          className="booking-input"
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {error && (
        <p className="form-error">{error}</p>
      )}

      <button
        className="booking-submit"
        type="submit"
        disabled={state.submitting}
      >
        {state.submitting
          ? "Sending..."
          : "Request Viewing"}
      </button>
    </form>
  );
}

export default BookingForm;