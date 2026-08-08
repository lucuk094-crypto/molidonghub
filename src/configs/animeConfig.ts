interface animeConfig {
  molidonghub: {
    siteName: string;
    description: string;
    logo: string;
    favicon: string;
    image: string;
  };

  molidonghubApi: {
    apiUrl: string;
    baseUrlPath: string;
  };
}

const animeConfig: animeConfig = {
  molidonghub: {
    siteName: "molidonghub",
    description: "Nonton donghua gratis ga pake karcis hanya di Molidonghub",
    logo: "/images/logo.png",
    favicon: "/favicon.png",
    image: "/images/molidonghub.jpg",
  },

  molidonghubApi: {
    apiUrl: "https://molidonghub-api-production.up.railway.app",
    baseUrlPath: "",
  },
};

export default animeConfig;