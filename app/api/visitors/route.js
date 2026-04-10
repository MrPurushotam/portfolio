import { NextResponse } from 'next/server';

const workspaceName = process.env.COUNTER_WORKSPACE;
const projectName = process.env.COUNTER_NAME;
const apiKey = process.env.COUNTER_APIKEY;
const env = process.env.NODE_ENV || 'prod';

/**
 * Determine whether all required environment variables for the counter service are present.
 *
 * @returns {any} A truthy value when `workspaceName`, `projectName`, and `apiKey` are all set; a falsy value otherwise.
 */
function validateEnv() {
    return workspaceName && projectName && apiKey;
}

/**
 * Handle POST requests to increment the visitor counter and return the updated visitor count.
 *
 * Validates required environment variables before proceeding. In non-production environments this
 * returns `{ visitors: NaN }` without contacting the counter service. On success returns the
 * counter's `up_count` value. On configuration, upstream, or runtime failures returns a JSON
 * error object with an appropriate HTTP status.
 *
 * @returns {import('next/server').NextResponse} JSON response:
 * - Success: `{ visitors: number }` containing the updated visitor count.
 * - Missing configuration: `{ error: "Server misconfiguration" }` with HTTP 500.
 * - Upstream failure: `{ error: "Failed to fetch from counter service" }` with the upstream status.
 * - Internal errors: `{ error: "Internal server error" }` with HTTP 500.
 */
export async function POST() {
    try {
        if (!validateEnv()) {
            return NextResponse.json(
                { error: "Server misconfiguration" },
                { status: 500 }
            );
        }

        if (env != 'prod' && env != 'production') {
            return NextResponse.json({ visitors: NaN });;
        };

        const res = await fetch(`https://api.counterapi.dev/v2/${workspaceName}/${projectName}/up`, {
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            console.error("Failed Response Object ", res);
            return NextResponse.json(
                { error: "Failed to fetch from counter service" },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json({ visitors: data.data.up_count });
    } catch (error) {
        console.error("Visitor counter backend error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * Retrieve the current visitor count from the configured counter service and return it as a JSON HTTP response.
 *
 * @returns {import('next/server').NextResponse} JSON response containing `{ visitors: number }` on success; on missing configuration returns `{ error: "Server misconfiguration" }` with status 500; on upstream failure returns `{ error: "Failed to fetch from counter service" }` with the upstream status; on unexpected errors returns `{ error: "Internal server error" }` with status 500.
 */
export async function GET() {
    try {
        if (!validateEnv()) {
            return NextResponse.json(
                { error: "Server misconfiguration" },
                { status: 500 }
            );
        }

        const res = await fetch(`https://api.counterapi.dev/v2/${workspaceName}/${projectName}/`, {
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: "Failed to fetch from counter service" },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json({ visitors: data.data.up_count });
    } catch (error) {
        console.error("Visitor counter backend error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
