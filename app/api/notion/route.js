import { NotionAPI } from 'notion-client';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    if (!pageId) {
        return new Response(
            JSON.stringify({ error: 'Missing pageId parameter' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const notion = new NotionAPI();
        const recordMap = await notion.getPage(pageId);
        return new Response(JSON.stringify({ recordMap }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Failed to fetch Notion page:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch Notion page data' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
