import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "WRI Roadmap",
    description: "A learning roadmap for Workshop Riset Informatika miniclass",
    themeConfig: {
        logo: {
            src: '/assets/wri-logo.png',
            alt: 'Workshop Riset Informatika'
        },

        nav: [
            { text: 'Home', link: '/' },
            { text: 'Web', link: '/miniclass/web/' },
            { text: 'Mobile', link: '/miniclass/mobile/' },
            { text: 'Game', link: '/miniclass/game/' },
            { text: 'UI/UX', link: '/miniclass/ui-ux/' }
        ],

        sidebar: {
            '/miniclass/web/': [
                {
                    text: "Web Development",
                    link: "/miniclass/web/"
                },
                {
                    text: 'Pendahuluan',
                    items: [
                        { text: 'Cara Kerja Website', link: '/miniclass/web/pendahuluan/cara-kerja-website' },
                        {
                            text: 'Pengenalan Backend dan Frontend',
                            link: '/miniclass/web/pendahuluan/pengenalan-backend-dan-frontend'
                        },
                        {
                            text: "HTTP Request dan HTTP Response",
                            link: "/miniclass/web/pendahuluan/http-request-dan-http-response"
                        }
                    ]
                },
                {
                    text: "HTML",
                    items: [
                        { text: "Pengenalan HTML", link: "/miniclass/web/html/pengenalan-html" },
                        { text: "Text Formatting", link: "/miniclass/web/html/text-formatting" },
                        { text: "Link", link: "/miniclass/web/html/link" },
                        { text: "Media", link: "/miniclass/web/html/media" },
                        { text: "List", link: "/miniclass/web/html/list" },
                        { text: "Table", link: "/miniclass/web/html/table" },
                        { text: "Form", link: "/miniclass/web/html/form" },
                        { text: "Grouping", link: "/miniclass/web/html/grouping" },
                    ],
                },
                {
                    text: "CSS",
                    items: [
                        { text: "Pengenalan CSS", link: "/miniclass/web/css/pengenalan-css" },
                        { text: "CSS Selector", link: "/miniclass/web/css/selector-css" },
                        { text: "Text Formatting", link: "/miniclass/web/css/text-formatting" },
                        { text: "Background", link: "/miniclass/web/css/background" },
                        { text: "Border", link: "/miniclass/web/css/border" },
                        { text: "Height dan Width", link: "/miniclass/web/css/height-dan-width" },
                        { text: "Spacing", link: "/miniclass/web/css/spacing" },
                        { text: "Layouting", link: "/miniclass/web/css/layouting" },
                        { text: "Responsive Design", link: "/miniclass/web/css/responsive-design" },
                    ]
                },
                {
                    text: "Javascript",
                    items: [
                        { text: "Pengenalan Javascript", link: "/miniclass/web/javascript/pengenalan-javascript" },
                        { text: "Javascript for Java Developer", link: "/miniclass/web/javascript/javascript-for-java-dev" },
                        { text: "Array", link: "/miniclass/web/javascript/array" },
                        { text: "Fungsi", link: "/miniclass/web/javascript/fungsi" },
                        { text: "Manipulasi DOM", link: "/miniclass/web/javascript/manipulasi-dom" },
                        { text: "Event", link: "/miniclass/web/javascript/event" },
                        { text: "Fetch API", link: "/miniclass/web/javascript/fetch-api" },
                        { text: "Object", link: "/miniclass/web/javascript/object-javascript" },
                    ]
                },
                {
                    text: "NodeJS",
                    items: [
                        { text: "Pengenalan NodeJS", link: "/miniclass/web/nodejs/pengenalan-nodejs" },
                        { text: "Membuat Server HTTP", link: "/miniclass/web/nodejs/membuat-server-http" },
                        { text: "Routing", link: "/miniclass/web/nodejs/routing" },
                        { text: "Import Export", link: "/miniclass/web/nodejs/import-export" },
                        { text: "Node Package Manager", link: "/miniclass/web/nodejs/node-package-manager" },
                        { text: "Nodemon", link: "/miniclass/web/nodejs/nodemon" },
                    ]
                },
            ]
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/wrideveloper' }
        ]
    }
})
