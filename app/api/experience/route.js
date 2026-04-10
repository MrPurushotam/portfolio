import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { Readable } from 'stream';
import { readData, writeData } from '../../../utils/common';
import crypto from 'crypto';
import cloudinary from '@/components/CloudinaryConfig';

/**
 * Create a new experience entry and optionally upload associated static media to Cloudinary.
 *
 * Parses multipart/form-data from the incoming request, validates required fields, and:
 * - if a file is provided, uploads it (image or video) to Cloudinary and attaches its URL;
 * - otherwise if a weburl is provided, fetches the site's favicon, uploads it as an image, and attaches its URL.
 * Persists the new experience (with `id`, `role`, `company`, `duration`, `description`, `weburl`, `static_file`, `resourceType`),
 * triggers cache revalidation for the `experience` tag, and returns the created record.
 *
 * @param {Request} req - Incoming request containing multipart/form-data with fields: `role`, `company`, `duration`, `description`, optional `staticfile`, and optional `weburl`.
 * @returns {NextResponse} JSON response describing the operation result. On success includes `updatedExperience` (the created record) and an `ETag` header; on failure includes an error `message` and `success: false`.
 */
export async function POST(req) {
    try {
        const formData = await req.formData();
        const role = formData.get("role");
        const company = formData.get("company");
        const duration = formData.get('duration');
        const description = formData.get('description');
        const staticfile = formData.get('staticfile');
        const weburl = formData.get('weburl');
        let resourceType;

        if (!role || !company || !duration || !description) {
            return NextResponse.json({ message: "Please fill all the necessary fields.", success: false }, { status: 401 });
        }

        let uploadedFileUrl;

        if (staticfile && typeof staticfile === "object") {
            resourceType = staticfile.type.startsWith("video/") ? "video" : "image";
            const fileBuffer = Buffer.from(await staticfile.arrayBuffer());
            const fileStream = Readable.from(fileBuffer);
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream(
                    { folder: 'experience_static_media', resource_type: resourceType },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                fileStream.pipe(uploadStream);
            });
            uploadedFileUrl = result.secure_url;
        } else if (weburl) {
            try {
                let parsedUrl = weburl;
                if (!parsedUrl.startsWith("http")) {
                    parsedUrl = "https://" + parsedUrl;
                }
                const domain = new URL(parsedUrl).hostname;
                const faviconResponse = await fetch(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
                const fileBuffer = Buffer.from(await faviconResponse.arrayBuffer());
                const fileStream = Readable.from(fileBuffer);
                resourceType = "image";
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.v2.uploader.upload_stream(
                        { folder: 'experience_static_media', resource_type: "image" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    fileStream.pipe(uploadStream);
                });
                uploadedFileUrl = result.secure_url;
            } catch (err) {
                console.error("Failed to fetch favicon:", err);
            }
        }

        const data = await readData();
        const newExperience = {
            id: Date.now(),
            role,
            company,
            duration,
            description,
            weburl: weburl || "",
            static_file: uploadedFileUrl || "",
            resourceType: resourceType || "",
        };
        console.log(newExperience);
        data.experience.push(newExperience);
        await writeData(data);

        revalidateTag('experience');
        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
        return NextResponse.json({ message: "Experience added successfully.", updatedExperience: newExperience, success: true }, { status: 200, headers: { 'ETag': etag } });
    } catch (error) {
        console.log("Error occurred while adding experience:", error.message);
        return NextResponse.json({ message: "Internal server error.", success: false }, { status: 500 });
    }
}

/**
 * Update an existing experience record, optionally replacing, generating, or removing its associated media in Cloudinary.
 * @param {import('next/server').NextRequest} req - Request whose FormData must include `id` and may include `role`, `company`, `duration`, `description`, `staticfile` (File or empty string), and `weburl`.
 * @returns {import('next/server').NextResponse} JSON response: on success contains `message`, `updatedExperience`, and `success: true` and includes an `ETag` header; client errors return 401 (missing id) or 403 (invalid id); server errors return 500.
 */
export async function PUT(req) {
    try {
        const formData = await req.formData();
        const id = parseInt(formData.get("id"));
        const role = formData.get("role");
        const company = formData.get("company");
        const duration = formData.get('duration');
        const description = formData.get('description');
        const staticfile = formData.get('staticfile');
        const weburl = formData.get('weburl');
        let resourceType;

        if (!id) {
            return NextResponse.json({ message: "Id can't be null.", success: false }, { status: 401 });
        }

        const data = await readData();
        const experienceIndex = data.experience.findIndex(exp => exp.id === id);

        if (experienceIndex === -1) {
            return NextResponse.json({ message: "Invalid experience id.", success: false }, { status: 403 });
        }
        const experience = data.experience[experienceIndex];
        let newMediaUrl = experience.static_file;
        resourceType = experience.resourceType;

        if (staticfile) {
            resourceType = staticfile.type.startsWith("video/") ? "video" : "image";
            if (experience.static_file) {
                const publicId = experience.static_file.split('/').pop().split('.')[0];
                await cloudinary.v2.uploader.destroy(`experience_static_media/${publicId}`);
            }
            const fileBuffer = Buffer.from(await staticfile.arrayBuffer());
            const fileStream = Readable.from(fileBuffer);
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream(
                    { folder: 'experience_static_media', resource_type: resourceType },
                    (error, result) => (error ? reject(error) : resolve(result))
                );
                fileStream.pipe(uploadStream);
            });

            newMediaUrl = result.secure_url;
        } else if (weburl && weburl !== experience.weburl) {
            try {
                let parsedUrl = weburl;
                if (!parsedUrl.startsWith("http")) {
                    parsedUrl = "https://" + parsedUrl;
                }
                const domain = new URL(parsedUrl).hostname;
                const faviconResponse = await fetch(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
                const fileBuffer = Buffer.from(await faviconResponse.arrayBuffer());
                const fileStream = Readable.from(fileBuffer);
                resourceType = "image";

                if (experience.static_file && experience.static_file.includes("experience_static_media")) {
                    const publicId = experience.static_file.split('/').pop().split('.')[0];
                    await cloudinary.v2.uploader.destroy(`experience_static_media/${publicId}`).catch(e => console.log(e));
                }

                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.v2.uploader.upload_stream(
                        { folder: 'experience_static_media', resource_type: "image" },
                        (error, result) => (error ? reject(error) : resolve(result))
                    );
                    fileStream.pipe(uploadStream);
                });
                newMediaUrl = result.secure_url;
            } catch (err) {
                console.error("Failed to fetch favicon:", err);
            }
        } else if (experience.static_file && (staticfile === "" || (!weburl && experience.weburl))) {
            if (experience.static_file.includes("experience_static_media")) {
                const publicId = experience.static_file.split('/').pop().split('.')[0];
                await cloudinary.v2.uploader.destroy(`experience_static_media/${publicId}`).catch(e => console.log(e));
            }
            newMediaUrl = "";
            resourceType = "";
        }

        const updatedExperience = {
            ...data.experience[experienceIndex],
            role: role || experience.role,
            company: company || experience.company,
            duration: duration || experience.duration,
            description: description || experience.description,
            weburl: weburl !== null ? weburl : experience.weburl,
            static_file: newMediaUrl,
            resourceType,
        };

        data.experience[experienceIndex] = updatedExperience;
        await writeData(data);

        revalidateTag('experience');
        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');

        return NextResponse.json(
            { message: "Experience updated successfully.", updatedExperience, success: true },
            { status: 200, headers: { 'ETag': etag } }
        );
    } catch (error) {
        console.log("Error occurred while updating experience:", error.message);
        return NextResponse.json({ message: "Internal server error.", success: false }, { status: 500 });
    }
}

/**
 * Delete an experience by id and remove its associated Cloudinary media if present.
 * @param {Request} req - HTTP request with a JSON body containing `{ id }`.
 * @returns {import('next/server').NextResponse} JSON response: on success `{ message: "Experience deleted successfully.", success: true }` with an `ETag` header; on failure an error message and `success: false` with appropriate status codes (`401` for missing id, `404` if not found, `500` on internal errors or media-deletion failure).
 */
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ message: "Id can't be null.", success: false }, { status: 401 });
        }

        const data = await readData();
        const experienceIndex = data.experience.findIndex(exp => exp.id === id);

        if (experienceIndex === -1) {
            return NextResponse.json({ message: "Experience not found", success: false }, { status: 404 });
        }

        const experience = data.experience[experienceIndex];
        if (experience.static_file) {
            const publicId = experience.static_file.split('/').pop().split('.')[0];
            try {
                await cloudinary.v2.uploader.destroy(`experience_static_media/${publicId}`);
            } catch (cloudinaryError) {
                console.error("Cloudinary deletion error:", cloudinaryError.message);
                return NextResponse.json({ message: "Failed to delete associated media file.", success: false }, { status: 500 });
            }
        }
        data.experience.splice(experienceIndex, 1);
        await writeData(data);

        revalidateTag('experience');
        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
        return NextResponse.json({ message: "Experience deleted successfully.", success: true }, { status: 200, headers: { 'ETag': etag } });
    } catch (error) {
        console.log("Error occurred while deleting experience:", error.message);
        return NextResponse.json({ message: "Internal server error.", success: false }, { status: 500 });
    }
}

/**
 * Retrieve a single experience by id or all experiences, honoring client-side caching with ETag.
 *
 * Supports conditional requests: if the request `If-None-Match` header matches the current ETag,
 * responds with `304` and an empty body. When an `id` query parameter is present, returns the
 * matching experience or `404` if not found. Includes the current `ETag` header on successful `200` responses.
 *
 * @returns `200` with `{ experience, success: true }` for a found item or the full list; `304` with an empty body when the client ETag matches; `404` with `{ message: "Experience not found", success: false }` when an id is missing; `500` with `{ message: "Internal server error.", success: false }` on unexpected errors.
 */
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        const data = await readData();

        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');

        const clientEtag = req.headers.get('If-None-Match');
        if (clientEtag === etag) {
            return new Response(null, { status: 304 });
        }

        if (id) {
            const experience = data.experience.find(exp => parseInt(exp.id) === parseInt(id));
            if (!experience) {
                return NextResponse.json({ message: "Experience not found", success: false }, { status: 404 });
            }
            return NextResponse.json({ experience, success: true }, { status: 200, headers: { 'ETag': etag }, });
        } else {
            return NextResponse.json({ experience: data.experience, success: true }, { status: 200, headers: { 'ETag': etag }, });
        }
    } catch (error) {
        console.log("Error occurred while fetching experience:", error.message);
        return NextResponse.json({ message: "Internal server error.", success: false }, { status: 500 });
    }
}
