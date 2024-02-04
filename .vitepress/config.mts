import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "WRI Roadmap",
    description: "A learning roadmap for Workshop Riset Informatika miniclass",
    lastUpdated: true,
    vue: {

    },
    themeConfig: {
        logo: {
            src: '/assets/wri-logo.png',
            alt: 'Workshop Riset Informatika'
        },

        footer: {
            message: 'Made with <a href="https://vitepress.dev" target="_blank">Vitepress</a>',
            copyright: 'Copyright © 2024-present <a href="https://github.com/wrideveloper">Workshop Riset Informatika</a>',
        },

        search: {
            provider: 'local',
        },

        editLink: {
            text: 'Edit this page on GitHub',
            pattern: 'https://github.com/wrideveloper/roadmap/edit/main/:path',
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
                    collapsed: false,
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
                    collapsed: false,
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
                    collapsed: false,
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
                    collapsed: false,
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
                    collapsed: false,
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
                    collapsed: false,
                    items: [
                        { text: "Tahapan Pembuatan Game", link: "/miniclass/game/pendahuluan/tahapan-pembuatan-game" },
                        { text: "Game Design Document", link: "/miniclass/game/pendahuluan/game-design-document" },
                        { text: "Story Board", link: "/miniclass/game/pendahuluan/story-board" },
                    ]
                },
                {
                    text: "Pengenalan Unity",
                    collapsed: false,
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
                    collapsed: false,
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
                    collapsed: false,
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
                    collapsed: false,
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
                    collapsed: false,
                    items: [
                        {
                            text: "Membuat Game 2D",
                            link: "/miniclass/game/teknik-pembuatan-game/membuat-game-2d-dengan-teknik-pembuatan-game"
                        },
                    ]
                },
                {
                    text: "Efek pada Unity",
                    collapsed: false,
                    items: [
                        { text: "Animation", link: "/miniclass/game/efek-pada-unity/animation" },
                        { text: "Audio", link: "/miniclass/game/efek-pada-unity/audio" },
                        { text: "Lighting", link: "/miniclass/game/efek-pada-unity/lighting" },
                    ]
                },
                {
                    text: "User Interface",
                    collapsed: false,
                    items: [
                        { text: "User Interface", link: "/miniclass/game/user-interface/user-interface" },
                    ]
                },
                {
                    text: "Penyimpanan Eksternal",
                    collapsed: false,
                    items: [
                        { text: "Binary File", link: "/miniclass/game/penyimpanan-eksternal/binary-file.md" },
                        { text: "SQLite", link: "/miniclass/game/penyimpanan-eksternal/sqlite.md" },
                    ]
                },
            ],
            '/miniclass/mobile/': [
                { text: "Mobile Development", link: "/miniclass/mobile/" },
                {
                    text: "Dart",
                    items: [
                        {
                            text: "Pemrograman Dart",
                            collapsed: false,
                            items: [
                                { text: "Pengenalan Dart", link: "/miniclass/mobile/pemrograman-dart/pengenalan-dart" },
                                { text: "Variabel dan Tipe Data", link: "/miniclass/mobile/pemrograman-dart/dart-fundamental" },
                            ]
                        },
                        {
                            text: "OOP Dart",
                            collapsed: false,
                            items: [
                                { text: "OOP pada Dart", link: "/miniclass/mobile/oop-dart/oop-dart" },
                            ]
                        },
                    ]
                },
                {
                    text: "Flutter",
                    items: [
                        {
                            text: "Widget Flutter",
                            collapsed: false,
                            items: [
                                { text: "Widget", link: "/miniclass/mobile/widget-flutter/widget" },
                            ]
                        }
                    ]
                }
            ],
            '/miniclass/ui-ux/': [
                { text: "Intro to Miniclass UI/UX", link: "/miniclass/ui-ux/" },
                {
                    text: "User Interface",
                    items: [
                        {
                            text: "Fundamental",
                            link: "/miniclass/ui-ux/user-interface/graphic-design-fundamental/",
                            collapsed: false,
                            items: [
                                {
                                    text: "Coloring",
                                    link: "/miniclass/ui-ux/user-interface/graphic-design-fundamental/coloring"
                                },
                                {
                                    text: "Masking",
                                    link: "/miniclass/ui-ux/user-interface/graphic-design-fundamental/masking"
                                },
                                {
                                    text: "Shaping",
                                    link: "/miniclass/ui-ux/user-interface/graphic-design-fundamental/shaping"
                                },
                            ]
                        }
                    ]
                },
                {
                    text: "User Experience",
                    items: [
                        {
                            text: "Fundamental UX",
                            link: "/miniclass/ui-ux/user-experience/fundamental-ux/",
                            collapsed: false,
                            items: [
                                { text: "Definisi UX", link: "/miniclass/ui-ux/user-experience/fundamental-ux/definisi" },
                                { text: "UX Workflow", link: "/miniclass/ui-ux/user-experience/fundamental-ux/ux-workflow" },
                            ]
                        },
                        {
                            text: "UX Design",
                            link: "/miniclass/ui-ux/user-experience/ux-design/",
                            collapsed: false,
                            items: [
                                { text: "Pengenalan UX Design", link: "/miniclass/ui-ux/user-experience/ux-design/pengenalan-ux-design" },
                                { text: "Membuat User Flow", link: "/miniclass/ui-ux/user-experience/ux-design/membuat-user-flow" },
                                { text: "Membuat Wireframe", link: "/miniclass/ui-ux/user-experience/ux-design/membuat-wireframe" },
                                { text: "Design Guideline", link: "/miniclass/ui-ux/user-experience/ux-design/design-guideline" },
                                { text: "Membuat Mockup", link: "/miniclass/ui-ux/user-experience/ux-design/membuat-mockup" },
                                { text: "Prototyping", link: "/miniclass/ui-ux/user-experience/ux-design/prototyping" },
                            ]
                        },
                        {
                            text: "UX Research",
                            link: "/miniclass/ui-ux/user-experience/ux-research/",
                            collapsed: false,
                            items: [
                                { text: "Pengenalan UX Research", link: "/miniclass/ui-ux/user-experience/ux-research/pengenalan-ux-research" },
                                { text: "Mengumpulkan Data", link: "/miniclass/ui-ux/user-experience/ux-research/mengumpulkan-data" },
                                { text: "Membuat User Persona", link: "/miniclass/ui-ux/user-experience/ux-research/membuat-user-persona" },
                                { text: "Membuat User Story", link: "/miniclass/ui-ux/user-experience/ux-research/membuat-user-story" },
                                {
                                    text: "Melakukan User Story Mapping",
                                    link: "/miniclass/ui-ux/user-experience/ux-research/melakukan-user-story-mapping"
                                },
                            ]
                        },
                        {
                            text: "UX Testing",
                            link: "/miniclass/ui-ux/user-experience/ux-testing/",
                            collapsed: false,
                            items: [
                                { text: "Usability Test", link: "/miniclass/ui-ux/user-experience/ux-testing/usability-test" },
                                { text: "Tree Test", link: "/miniclass/ui-ux/user-experience/ux-testing/tree-test" },
                                { text: "A/B Testing", link: "/miniclass/ui-ux/user-experience/ux-testing/ab-testing" },
                            ]
                        }
                    ]
                },
                {
                    text: "Design Thinking",
                    items: [
                        { text: "Pengenalan", link: "/miniclass/ui-ux/design-thinking/pengenalan-design-thinking" },
                        {
                            text: "Fase Define",
                            link: "/miniclass/ui-ux/design-thinking/fase-define/",
                            collapsed: false,
                            items: [
                                {
                                    text: "Identify and Define",
                                    link: "/miniclass/ui-ux/design-thinking/fase-define/mengidentifikasi-dan-mendefinisikan-insights"
                                },
                            ]
                        },
                        {
                            text: "Fase Emphatize",
                            link: "/miniclass/ui-ux/design-thinking/fase-emphatize/",
                            collapsed: false,
                            items: []
                        },
                        {
                            text: "Fase Ideate",
                            link: "/miniclass/ui-ux/design-thinking/fase-ideate/",
                            collapsed: false,
                            items: [
                                {
                                    text: "Sketchstorming",
                                    link: "/miniclass/ui-ux/design-thinking/fase-ideate/menuangkan-ide-brilian-dengan-sketchstorming"
                                },
                            ]
                        },
                        {
                            text: "Fase Prototype",
                            link: "/miniclass/ui-ux/design-thinking/fase-prototype/",
                            collapsed: false,
                            items: []
                        },
                        {
                            text: "Fase Testing",
                            link: "/miniclass/ui-ux/design-thinking/fase-testing/",
                            collapsed: false,
                            items: [
                                {
                                    text: "User Testing",
                                    link: "/miniclass/ui-ux/design-thinking/fase-testing/melakukan-user-testing"
                                },
                            ]
                        },
                    ]
                },
                {
                    text: "Referensi Lain",
                    items: [
                        { text: "UX Animation", link: "https://uxdesign.cc/the-ultimate-guide-to-proper-use-of-animation-in-ux-10bd98614fa9" },
                        { text: "UX Research", link: "https://medium.com/design-jam-indonesia/apa-itu-design-thinking-63c8416c9dd0" },
                    ]
                }
            ],
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/wrideveloper/roadmap' },
            { icon: 'instagram', link: 'https://instagram.com/wri_polinema' },
            { icon: 'linkedin', link: 'https://www.linkedin.com/company/wripolinema/' },
            { icon: 'youtube', link: 'https://www.youtube.com/@workshoprisetinformatika6528' },
        ]
    }
})
