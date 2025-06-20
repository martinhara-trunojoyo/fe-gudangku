import React, { useState } from 'react';
import { FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';

function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <section id="contact-us" className="py-16 px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        {/* Title */}
        <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-16">
          Contact Us
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Contact Information */}
          <div className="space-y-8">
            {/* Instagram */}
            <div className="bg-gray-100 p-6 rounded-lg flex items-center space-x-4">
              <div className="bg-white p-3 rounded-lg">
                <FaInstagram className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Follow us on IG :</h3>
                <p className="text-gray-600">@Gudangku_</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-gray-100 p-6 rounded-lg flex items-center space-x-4">
              <div className="bg-white p-3 rounded-lg">
                <FaEnvelope className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Send us an email :</h3>
                <p className="text-gray-600">GudangKu.co.id</p>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-gray-100 p-6 rounded-lg flex items-center space-x-4">
              <div className="bg-white p-3 rounded-lg">
                <FaPhone className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Call us directly :</h3>
                <p className="text-gray-600">+628973456234</p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-gray-100 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Send Us a message</h3>
            <p className="text-gray-600 mb-6">
              "Kami siap membantu dan menjawab semua pertanyaan Anda. Kami tunggu pesan dari Anda!"
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-violet-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-violet-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-violet-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-violet-500"
                    required
                  />
                </div>
              </div>

              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-violet-500 resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-violet-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-violet-700 transition-colors duration-300"
              >
                Send Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;    