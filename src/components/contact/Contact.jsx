import React from 'react';
import './contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <h2 className="contact-title">Contact Us</h2>
      <div className="contact-grid">
        <div className="contact-info">
          <div className="info-box">
            <img src="/instagram.png" alt="Instagram" className="info-icon" />
            <div>
              <p>Follow us on IG :</p>
              <strong>@Gudangku_</strong>
            </div>
          </div>
          <div className="info-box">
            <img src="/email.png" alt="Email" className="info-icon" />
            <div>
              <p>Send us an email :</p>
              <strong>GudangKu.co.id</strong>
            </div>
          </div>
          <div className="info-box">
            <img src="/telephone.png" alt="Phone" className="info-icon" />
            <div>
              <p>Call us directly :</p>
              <strong>+6289734682134</strong>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <h3>Send Us a message</h3>
          <p className="contact-subtext">
            Kami siap membantu dan menjawab semua pertanyaan Anda. Kami tunggu pesan dari Anda!
          </p>

          <div className="form-row">
            <input type="text" placeholder="First name" />
            <input type="text" placeholder="Last name" />
          </div>

          <div className="form-row">
            <input type="email" placeholder="Email Address" />
            <input type="text" placeholder="Phone Number" />
          </div>

          <textarea placeholder="Tell us how we can help you.." rows="4" />

          <button type="submit">Send Now</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
