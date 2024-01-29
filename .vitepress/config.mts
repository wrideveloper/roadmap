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
                { text: "Web Development", link: "/miniclass/web/" },
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
                        {
                            text: "Javascript for Java Developer",
                            link: "/miniclass/web/javascript/javascript-for-java-dev"
                        },
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
            ],
            '/miniclass/game/': [
                { text: "Game Development", link: "/miniclass/game/" },
                {
                    text: "Pendahuluan",
                    items: [
                        { text: "Tahapan Pembuatan Game", link: "/miniclass/game/pendahuluan/tahapan-pembuatan-game" },
                        { text: "Game Design Document", link: "/miniclass/game/pendahuluan/game-design-document" },
                        { text: "Story Board", link: "/miniclass/game/pendahuluan/story-board" },
                    ]
                },
                {
                    text: "Pengenalan Unity",
                    items: [
                        { text: "Penjelasan Unity", link: "/miniclass/game/pengenalan-unity/penjelasan-unity" },
                        {
                            text: "Game Object Component",
                            link: "/miniclass/game/pengenalan-unity/game-object-component"
                        },
                        {
                            text: "Pengenalan Interface Unity",
                            link: "/miniclass/game/pengenalan-unity/pengenalan-interface-unity"
                        },
                        { text: "Physic2D", link: "/miniclass/game/pengenalan-unity/physic2d" },
                    ]
                },
                {
                    text: "Pengenalan C#",
                    items: [
                        {
                            text: "Constructor",
                            link: "/miniclass/game/pengenalan-csharp/constructor"
                        },
                        {
                            text: "Dasar OOP C#",
                            link: "/miniclass/game/pengenalan-csharp/dasar-oop-csharp"
                        },
                        { text: "Fungsi", link: "/miniclass/game/pengenalan-csharp/fungsi" },
                        {
                            text: "Getter dan Setter",
                            link: "/miniclass/game/pengenalan-csharp/getter-dan-setter"
                        },
                        {
                            text: "Inheritance",
                            link: "/miniclass/game/pengenalan-csharp/inheritance"
                        },
                        {
                            text: "Object Attribute",
                            link: "/miniclass/game/pengenalan-csharp/object-attribute"
                        },
                        {
                            text: "Pengenalan C#",
                            link: "/miniclass/game/pengenalan-csharp/pengenalan-csharp"
                        },
                    ]
                },
                {
                    text: "Penerapan C# pada Unity",
                    items: [
                        { text: "AddForce", link: "/miniclass/game/penerapan-csharp-pada-unity/addforce" },
                        {
                            text: "Collider Trigger",
                            link: "/miniclass/game/penerapan-csharp-pada-unity/collider-trigger"
                        },
                        { text: "Delta Time", link: "/miniclass/game/penerapan-csharp-pada-unity/delta-time" },
                        { text: "GetComponent", link: "/miniclass/game/penerapan-csharp-pada-unity/getcomponent" },
                        { text: "Input", link: "/miniclass/game/penerapan-csharp-pada-unity/input" },
                        {
                            text: "Membuat Game 2D Sederhana",
                            link: "/miniclass/game/penerapan-csharp-pada-unity/membuat-game-2d-sederhana"
                        },
                        { text: "Transform", link: "/miniclass/game/penerapan-csharp-pada-unity/transform" },
                        { text: "Velocity", link: "/miniclass/game/penerapan-csharp-pada-unity/velocity" },
                    ]
                },
                {
                    text: "Miniproject",
                    items: [
                        { text: "Mengoleksi Objek", link: "/miniclass/game/miniproject/mengoleksi-objek" },
                        { text: "Overview", link: "/miniclass/game/miniproject/overview" },
                        { text: "Player Movement", link: "/miniclass/game/miniproject/player-movement" },
                        { text: "Scene Management", link: "/miniclass/game/miniproject/scene-management" },
                        { text: "Scoring System", link: "/miniclass/game/miniproject/scoring-system" },
                    ]
                },
                {
                    text: "Teknik Pembuatan Game",
                    items: [
                        {
                            text: "Membuat Game 2D",
                            link: "/miniclass/game/teknik-pembuatan-game/membuat-game-2d-dengan-teknik-pembuatan-game"
                        },
                    ]
                },
                {
                    text: "Efek pada Unity",
                    items: [
                        { text: "Animation", link: "/miniclass/game/efek-pada-unity/animation" },
                        { text: "Audio", link: "/miniclass/game/efek-pada-unity/audio" },
                        { text: "Lighting", link: "/miniclass/game/efek-pada-unity/lighting" },
                    ]
                },
                {
                    text: "User Interface",
                    items: [
                        { text: "User Interface", link: "/miniclass/game/user-interface/user-interface" },
                    ]
                },
                {
                    text: "Penyimpanan Eksternal",
                    items: [
                        { text: "Binary File", link: "/miniclass/game/penyimpanan-eksternal/binary-file.md" },
                        { text: "SQLite", link: "/miniclass/game/penyimpanan-eksternal/sqlite.md" },
                    ]
                },
            ]
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/wrideveloper' }
        ]
    }
})
