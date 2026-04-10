import { NextResponse } from 'next/server';
import { readData } from '@/utils/common';
import crypto from "crypto"

/**
 * Handle GET requests to return persisted data (optionally filtered) and support ETag-based conditional responses.
 *
 * If the `choice` query parameter is omitted the full data set is returned; when `choice` is present, only matching
 * fields (`projects`, `skills`, `resume`, `profile`, `experience`) are included in the response. An `ETag` header
 * is computed for the response body and compared against the request's `If-None-Match` header to return `304 Not Modified`
 * when appropriate.
 *
 * @param {Request} request - Incoming HTTP request. Recognized inputs:
 *   - Query parameter `choice` — a string used to select one or more data sections (checked via substring includes).
 *   - Header `If-None-Match` — compared against the computed ETag to determine a `304` response.
 * @returns {Response} HTTP JSON response: a `200` with the selected data and `ETag`/cache-control headers, a `304` with no body
 * when the client's ETag matches the current data, or a `500` containing an error message on failure.
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const choice = searchParams.get('choice');

        const data = await readData();
        let response = { success: true };

        if (!choice) {
            response = data;
            response.success = true;
        } else {
            if (choice.includes('projects')) {
                response.projects = data.projects;
            }
            if (choice.includes('skills')) {
                response.skills = data.skills;
            }
            if (choice.includes('resume')) {
                response.resumeDocId = data.resumeDocId;
            }
            if (choice.includes('profile')) {
                response.profile = data.profile;
            }
            if (choice.includes('experience')) {
                response.experience = data.experience;
            }
        }
        const etag = crypto.createHash('md5').update(JSON.stringify(response)).digest('hex');

        const ifNoneMatch = request.headers.get('if-none-match');
        if (ifNoneMatch === etag) {
            // Data hasn't changed; respond with 304 Not Modified
            return NextResponse.json(null, { status: 304 });
        }

        const headers = new Headers();
        headers.set('Cache-Control', 'public, max-age=0, must-revalidate'); // Allows revalidation
        headers.set('ETag', etag); // Unique identifier for the data

        return NextResponse.json(response, { status: 200, headers });
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching data', success: false }, { status: 500 });
    }
}
