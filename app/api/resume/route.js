import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readData, writeData } from '../../../utils/common';
import { revalidateTag } from 'next/cache';

const RESUME_CACHE_REVALIDATE_SECONDS = 24 * 3600;

const buildDriveViewUrl = (docId) => {
    return `https://drive.google.com/uc?export=view&id=${encodeURIComponent(docId)}`;
};

/**
 * Serves a resume file retrieved from Google Drive, using the `docId` query parameter or a persisted resumeDocId when absent.
 *
 * If no `docId` is available the handler returns a 404 JSON response. When the upstream fetch succeeds, the handler returns the file bytes in a NextResponse with `Content-Type` (normalizes `application/octet-stream` to `application/pdf`), `Content-Disposition: inline`, and cache headers. If the upstream fetch fails the handler returns a JSON error with the upstream status; unexpected errors result in a 500 JSON response.
 *
 * @returns {NextResponse} A NextResponse containing the resume file bytes and HTTP 200 on success; otherwise a JSON NextResponse with an error message and an appropriate error status (404, upstream status, or 500).
 */
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        let docId = (searchParams.get('docId') || '').trim();

        if (!docId) {
            const data = await readData({
                revalidate: 8 * 3600,
                tags: ['resume']
            });
            docId = data.resumeDocId || '';
        }

        if (!docId) {
            return NextResponse.json({ message: 'Resume DocId is not configured.', success: false }, { status: 404 });
        }

        const upstreamResponse = await fetch(buildDriveViewUrl(docId), {
            method: 'GET',
            redirect: 'follow',
            next: {
                revalidate: RESUME_CACHE_REVALIDATE_SECONDS,
                tags: ['resume-file', `resume-file-${docId}`]
            }
        });

        if (!upstreamResponse.ok) {
            return NextResponse.json({ message: 'Unable to fetch resume file.', success: false }, { status: upstreamResponse.status });
        }

        const fileBytes = await upstreamResponse.arrayBuffer();
        const contentType = upstreamResponse.headers.get('content-type')?.split(';')[0] || 'application/pdf';

        return new NextResponse(fileBytes, {
            status: 200,
            headers: {
                'Content-Type': contentType === 'application/octet-stream' ? 'application/pdf' : contentType,
                'Content-Disposition': 'inline',
                'Cache-Control': `public, s-maxage=${RESUME_CACHE_REVALIDATE_SECONDS}, stale-while-revalidate=86400`
            }
        });
    } catch (error) {
        console.log('Error occurred while serving resume:', error.message);
        return NextResponse.json({ message: 'Internal server error.', success: false }, { status: 500 });
    }
}

/**
 * Store the provided Google Drive document ID as the resume document and trigger cache revalidation.
 *
 * Expects the incoming request to contain a JSON body with a `docId` property. On success, persists the new `resumeDocId`,
 * computes an MD5 ETag for the stored configuration, and revalidates cache tags related to the resume.
 *
 * @param {Request} req - Incoming request whose JSON body must include `{ docId: string }`.
 * @returns {import('next/server').NextResponse} A JSON response:
 *  - `200` with `{ message: "Resume Doc Id added successfully.", success: true }` and an `ETag` header on success;
 *  - `401` with `{ message: "DocId is important.", success: false }` if `docId` is missing;
 *  - `500` with `{ message: "Internal server error.", success: false }` on unexpected errors.
 */
export async function POST(req) {
    try {
        const body = await req.json();
        const { docId } = body;
        if (!docId) {
            return NextResponse.json({ message: "DocId is important.", success: false }, { status: 401 });
        }
        const data = await readData();
        data.resumeDocId = docId;

        await writeData(data);
        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');

        // Revalidate the cache
        revalidateTag('resume');
        revalidateTag('resume-file');

        return NextResponse.json({ message: "Resume Doc Id added successfully.", success: true }, { status: 200, headers: { 'ETag': etag } });
    } catch (error) {
        console.log("Error occurred while adding project:", error.message);
        return NextResponse.json({ message: "Internal server error.", success: false }, { status: 500 });
    }
}
