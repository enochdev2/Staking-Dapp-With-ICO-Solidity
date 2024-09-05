import React from "react";

const Partners = () => {
  const partners = [
    {
      name: "theblockchaincoders.com",
      image: "img/partners/logo1.svg",
      url: "https://www.theblockchaincoders.com/pro-nft-marketplace",
    },
    {
      name: "theblockchaincoders.com",
      image: "img/partners/logo2.svg",
      url: "https://www.theblockchaincoders.com/pro-nft-marketplace",
    },
    {
      name: "theblockchaincoders.com",
      image: "img/partners/logo3.svg",
      url: "https://www.theblockchaincoders.com/pro-nft-marketplace",
    },
    {
      name: "theblockchaincoders.com",
      image: "img/partners/logo4.svg",
      url: "https://www.theblockchaincoders.com/pro-nft-marketplace",
    },
    {
      name: "theblockchaincoders.com",
      image: "img/partners/logo5.svg",
      url: "https://www.theblockchaincoders.com/pro-nft-marketplace",
    },
    {
      name: "theblockchaincoders.com",
      image: "img/partners/logo6.svg",
      url: "https://www.theblockchaincoders.com/pro-nft-marketplace",
    },
    {
      name: "theblockchaincoders.com",
      image: "img/partners/logo7.svg",
      url: "https://www.theblockchaincoders.com/pro-nft-marketplace",
    },
    {
      name: "theblockchaincoders.com",
      image: "img/partners/logo8.svg",
      url: "https://www.theblockchaincoders.com/pro-nft-marketplace",
    },
  ];
  return (
    <section className="section" id="partners">
      <div className="container">
        <div className="row">
          <div
            className="col-12 col-md-8 
          offset-md-2 col-lg-6 offset-lg-3 col-xl-8 offset-xl-2"
          >
            <div className="section__title">
              <h2>Our partners</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Deserunt nobis modi officiis temporibus porro voluptates
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          {partners.map((partner, index) => (
            <div key={index} className="col-6 col-lg-3">
              <a href={partners.link} className="partner">
                <img src={partner.image} alt="" />
                <p>{partner.name}</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
