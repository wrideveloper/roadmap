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
            { text: 'Web', link: '/miniclass/web' },
            { text: 'Mobile', link: '/miniclass/mobile' },
            { text: 'Game', link: '/miniclass/game' },
            { text: 'UI/UX', link: '/miniclass/ui-ux' }
        ],

        sidebar: [
            {
                text: 'Examples',
                items: [
                    { text: 'Markdown Examples', link: '/markdown-examples' },
                    { text: 'Runtime API Examples', link: '/api-examples' }
                ]
            }
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/wrideveloper' }
        ]
    }
})
