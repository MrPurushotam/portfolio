export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://purushotamjeswani.in';
    return {
        rules: [
            {
                userAgent: '*', 
                allow: ['/','/contact'], 
                disallow: ['/admin', '/signin'], 
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`, 
    };
}
