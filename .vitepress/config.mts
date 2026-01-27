import { defineConfig } from "vitepress";
import frontendWebSidebar from "./sidebars/frontend-web";
import backendSidebar from "./sidebars/backend";
import gameSidebar from "./sidebars/game";
import cyberSidebar from "./sidebars/cyber";
import frontendMobileSidebar from "./sidebars/frontend-mobile";
import uiUxSidebar from "./sidebars/ui-ux";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "WRI Roadmap",
  description: "A learning roadmap for Workshop Riset Informatika miniclass",
  lastUpdated: true,
  vue: {},
  themeConfig: {
    logo: {
      src: "/assets/wri-logo.png",
      alt: "Workshop Riset Informatika",
    },

    footer: {
      message:
        'Made with <a href="https://vitepress.dev" target="_blank">Vitepress</a>',
      copyright:
        'Copyright © 2024-present <a href="https://github.com/wrideveloper">Workshop Riset Informatika</a>',
    },

    search: {
      provider: "local",
    },

    editLink: {
      text: "Edit this page on GitHub",
      pattern: "https://github.com/wrideveloper/roadmap/edit/main/:path",
    },

    nav: [
      { text: "Home", link: "/" },
      { text: "Frontend", link: "/miniclass/frontend/", activeMatch: "/miniclass/frontend/", },
      { text: "Backend", link: "/miniclass/backend/" },
      { text: "Game", link: "/miniclass/game/" },
      { text: "UI/UX", link: "/miniclass/ui-ux/" },
      { text: "Cyber Security", link: "/miniclass/cyber/" },
    ],

    sidebar: {
      "/miniclass/frontend/web/":frontendWebSidebar,
      "/miniclass/backend/": backendSidebar,
      "/miniclass/game/": gameSidebar,
      "/miniclass/frontend/mobile/": frontendMobileSidebar,
      "/miniclass/ui-ux/": uiUxSidebar,
      "/miniclass/cyber/": cyberSidebar,
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/wrideveloper/roadmap" },
      { icon: "instagram", link: "https://instagram.com/wri_polinema" },
      {
        icon: "linkedin",
        link: "https://www.linkedin.com/company/wripolinema/",
      },
      {
        icon: "youtube",
        link: "https://www.youtube.com/@workshoprisetinformatika6528",
      },
    ],
  },
});
