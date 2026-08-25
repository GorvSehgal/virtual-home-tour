import { useState } from "react";

function BookingForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [preferredDate, setPreferredDate] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
const [success, setSuccess] = useState(false);
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    setError("");
    setSuccess(false);
  
    if (name.trim().length < 2) {
      setError("Please enter a valid name.");
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
  
    const selectedDate = new Date(preferredDate + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    if (selectedDate < today) {
      setError("Preferred date cannot be in the past.");
      return;
    }
  
    setSuccess(true);
  
    setName("");
    setEmail("");
    setPhone("");
    setPreferredDate("");
    setMessage("");
  };
    return (
        <form onSubmit={handleSubmit}>
            <div>   
            <label htmlFor="name">Name:</label>
            <input
                type="text" 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            </div>
            <div>   
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}  
            />
            </div>
            <div>   
            <label htmlFor="phone">Phone:</label>
            <input
                type="tel"
                id="phone"  
                value={phone}

                onChange={(e) => setPhone(e.target.value)}
            />
            </div>
            <div>   
            <label htmlFor="preferredDate">Preferred Date:</label>
            <input
                type="date"
                id="preferredDate"
                value={preferredDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setPreferredDate(e.target.value)}
            />
            </div>
            <div>
            <label htmlFor="message">Message:</label>
            <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            </div>
            {error && <p>{error}</p>}
{success && <p>Viewing request submitted successfully.</p>}
            <button type="submit">Submit</button>
        </form>
    );
}
export default BookingForm;