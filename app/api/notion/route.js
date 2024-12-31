import { NotionAPI } from 'notion-client';

const cache = new Map();

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    if (!pageId) {
        return new Response(
            JSON.stringify({ error: 'Missing pageId parameter' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const cachedData = cache.get(pageId);
    if (cachedData && (Date.now() - cachedData.timestamp < 3600000)) { // 1 hour in milliseconds
        return new Response(JSON.stringify({ recordMap: cachedData.recordMap }), {
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const notion = new NotionAPI();
        const recordMap = await notion.getPage(pageId);
        cache.set(pageId, { recordMap, timestamp: Date.now() });
        return new Response(JSON.stringify({ recordMap }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Failed to fetch Notion page:', error.message);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch Notion page data' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
