export default function robots() {
    return {
        rules:[
            {
                userAgent:"*",
                allow:["/","/resume","/contact"],
                disallow:['/admin/*','/api/*','/login']
            }
        ],
        sitemap:process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`: 'https://purushotamjeswani.in/sitemap.xml'
    }
}
