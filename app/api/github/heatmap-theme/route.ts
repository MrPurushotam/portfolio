import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { readData, writeData } from '../../../../utils/common';
import { revalidateTag } from 'next/cache';

/**
 * Handle POST requests to update the persisted GitHub heatmap theme.
 *
 * Expects the request JSON body to include a `theme` string. If provided, updates stored data with the new theme, persists the change, computes an MD5 `ETag` for the updated data, and triggers cache revalidation for the `githubHeatmapTheme` tag.
 *
 * @param req - The incoming NextRequest whose JSON body must contain a `theme` field.
 * @returns A NextResponse JSON object:
 * - `401` with `{ message: "Theme is required", success: false }` if `theme` is missing.
 * - `200` with `{ message: "Github Heatmap Theme updated successfully.", success: true }` and an `ETag` header containing the MD5 hash of the updated data on success.
 * - `500` with `{ message: "Internal server error.", success: false }` if an error occurs.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { theme } = body;
        if (!theme) {
            return NextResponse.json({ message: "Theme is required", success: false }, { status: 401 });
        }
        const data = await readData();
        data.githubHeatmapTheme = theme;

        await writeData(data);
        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');

        revalidateTag('githubHeatmapTheme', 'max');

        return NextResponse.json({ message: "Github Heatmap Theme updated successfully.", success: true }, { status: 200, headers: { 'ETag': etag } });
    } catch (error) {
        console.log("Error occurred while updating theme:", error.message);
        return NextResponse.json({ message: "Internal server error.", success: false }, { status: 500 });
    }
}
