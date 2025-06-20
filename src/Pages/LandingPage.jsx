import React from "react";

import About from "../components/about/About";
import Services from "../components/Services";
import Contact from "../components/contact/Contact";
import Footer from "../components/Footer";
import LandingHeader from "../components/LandingHeader";


const LandingPage = () => {
  return (
    <div>
      <LandingHeader />
      
      <section id="about">
        <About />
      </section>

      <section id="services">
        <Services />
      </section>

      <section id="contact">
        <Contact />
      </section>

      <Footer />
    </div>
  );
};


export default LandingPage;
