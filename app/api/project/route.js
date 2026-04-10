import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { Readable } from 'stream';
import { readData, writeData } from '../../../utils/common';
import crypto from 'crypto';
import cloudinary from '@/components/CloudinaryConfig';

/**
 * Handle creation of a new project from a multipart form request.
 *
 * Accepts form fields (title, techstack, description, brief, describe, githubLink, liveLink, staticfile),
 * validates required fields, optionally uploads a provided static file to Cloudinary, persists the new project,
 * and triggers cache revalidation for the 'projects' tag.
 *
 * @param {Request} req - Incoming Next.js request containing multipart form data.
 * @returns {Response} JSON response:
 *  - 200: { message: "Project added successfully.", success: true } with an `ETag` header reflecting the updated data.
 *  - 401: { message: "Please fill all the necessary fields.", success: false } when required fields are missing or invalid.
 *  - 500: { message: "Internal server error.", success: false } on unexpected errors.
 */
export async function POST(req) {
    try {
        const formData = await req.formData();
        const title = formData.get("title");
        const techstack = formData.get("techstack");
        const description = formData.get('description');
        const brief = formData.get('brief') === 'true';
        const describe = formData.get('describe');
        const githubLink = formData.get('githubLink');
        const liveLink = formData.get('liveLink');
        const staticfile = formData.get('staticfile');
        let resourceType;

        if (!title || techstack.length < 1 || !description || brief === null || brief === undefined) {
            return NextResponse.json({ message: "Please fill all the necessary fields.", success: false }, { status: 401 });
        }

        let uploadedFileUrl;

        if (staticfile && typeof staticfile === "object") {
            resourceType = staticfile.type.startsWith("video/") ? "video" : "image";
            const fileBuffer = Buffer.from(await staticfile.arrayBuffer());
            const fileStream = Readable.from(fileBuffer);
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream(
                    { folder: 'projects_static_media', resource_type: resourceType },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                fileStream.pipe(uploadStream);
            });
            uploadedFileUrl = result.secure_url;
        }

        const data = await readData();
        const newProject = {
            id: Date.now(),
            title,
            techstack,
            description,
            brief,
            describe,
            static_file: uploadedFileUrl,
            resourceType,
            githubLink: githubLink.trim(),
            liveLink: liveLink.trim()
        };
        console.log(newProject)
        data.projects.push(newProject);
        await writeData(data);

        // Revalidate the cache
        revalidateTag('projects');

        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
        return NextResponse.json({ message: "Project added successfully.", success: true }, { status: 200, headers: { 'ETag': etag } });
    } catch (error) {
        console.log("Error occurred while adding project:", error.message);
        return NextResponse.json({ message: "Internal server error.", success: false }, { status: 500 });
    }
}

/**
 * Handle updating an existing project from multipart form data.
 *
 * Updates project fields and optional static media, persists changes, revalidates the projects cache tag,
 * and computes an MD5 ETag for the returned dataset.
 *
 * @param {Request} req - Incoming Next.js request containing multipart form data; expected fields include `id`, `title`, `techstack`, `description`, `brief`, `describe`, `githubLink`, `liveLink`, and an optional `staticfile`.
 * @returns {NextResponse} A JSON response whose body contains `message`, `updatedProject`, and `success`. Returns status 200 with the updated project and an `ETag` response header on success; 401 if `id` is missing; 403 if the project id is invalid; 500 on internal server error.
 */
export async function PUT(req) {
    try {
        const formData = await req.formData();
        const id = parseInt(formData.get("id"));
        const title = formData.get("title");
        const techstack = formData.get("techstack");
        const description = formData.get('description');
        const brief = formData.get('brief') === 'true';
        const describe = formData.get('describe');
        const githubLink = formData.get('githubLink');
        const liveLink = formData.get('liveLink');
        const staticfile = formData.get('staticfile');
        let resourceType;

        if (!id) {
            return NextResponse.json({ message: "Id can't be null.", success: false }, { status: 401 });
        }

        const data = await readData();
        const projectIndex = data.projects.findIndex(project => project.id === id);

        if (projectIndex === -1) {
            return NextResponse.json({ message: "Invalid project id.", success: false }, { status: 403 });
        }
        const project = data.projects[projectIndex];
        let newMediaUrl = project.static_file;

        if (staticfile) {
            resourceType = staticfile.type.startsWith("video/") ? "video" : "image";
            if (project.static_file) {
                const publicId = project.static_file.split('/').pop().split('.')[0];
                await cloudinary.v2.uploader.destroy(`projects_static_media/${publicId}`);
            }
            const fileBuffer = Buffer.from(await staticfile.arrayBuffer());
            const fileStream = Readable.from(fileBuffer);
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream(
                    { folder: 'projects_static_media', resource_type: resourceType },
                    (error, result) => (error ? reject(error) : resolve(result))
                );
                fileStream.pipe(uploadStream);
            });

            newMediaUrl = result.secure_url;
        }

        const updatedProject = {
            ...data.projects[projectIndex],
            title: title || project.title,
            techstack: Array.isArray(techstack) ? techstack.map(item => item.trim()) : techstack ? techstack.split(",").map(item => item.trim()) : project.techstack,
            description: description || project.description,
            brief: brief || project.brief,
            describe: describe || project.describe,
            static_file: newMediaUrl,
            resourceType,
            githubLink: githubLink || project.githubLink,
            liveLink: liveLink || project.liveLink
        };

        data.projects[projectIndex] = updatedProject;
        await writeData(data);

        // Revalidate the cache
        revalidateTag('projects');

        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');

        // Return updated data with the new ETag
        return NextResponse.json(
            { message: "Project updated successfully.", updatedProject, success: true },
            { status: 200, headers: { 'ETag': etag } }
        );
    } catch (error) {
        console.log("Error occurred while updating project:", error.message);
        return NextResponse.json({ message: "Internal server error.", success: false }, { status: 500 });
    }
}

/**
 * Delete a project by id, remove its associated Cloudinary media if present, persist the change, and revalidate the projects cache.
 * @param {Request} req - Incoming request whose JSON body must include `id`.
 * @returns {Response} A JSON NextResponse containing `{ message, success }`; on success returns status 200 and includes an `ETag` header, on failure returns an appropriate error status and message.
 */
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ message: "Id can't be null.", success: false }, { status: 401 });
        }

        const data = await readData();
        const projectIndex = data.projects.findIndex(project => project.id === id);

        if (projectIndex === -1) {
            return NextResponse.json({ message: "Project not found", success: false }, { status: 404 });
        }

        const project = data.projects[projectIndex];
        if (project.static_file) {
            const publicId = project.static_file.split('/').pop().split('.')[0];
            try {
                await cloudinary.v2.uploader.destroy(`project_static_media/${publicId}`);
            } catch (cloudinaryError) {
                console.error("Cloudinary deletion error:", cloudinaryError.message);
                return NextResponse.json({ message: "Failed to delete associated media file.", success: false }, { status: 500 });
            }
        }
        data.projects.splice(projectIndex, 1);
        await writeData(data);

        // Revalidate the cache
        revalidateTag('projects');

        const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
        return NextResponse.json({ message: "Project deleted successfully.", success: true }, { status: 200, headers: { 'ETag': etag } });
    } catch (error) {
        console.log("Error occurred while deleting project:", error.message);
        return NextResponse.json({ message: "Internal server error.", success: false }, { status: 500 });
    }
}

/**
 * Handle GET requests for projects, returning either the full list or a single project and using an MD5 ETag for conditional responses.
 * @param {Request} req - Incoming request; may include query parameter `id` to fetch a single project and the `If-None-Match` header for conditional GETs.
 * @returns {Response} A JSON response:
 * - 200: `{ projects: Array, success: true }` when no `id` is provided, or `{ project: Object, success: true }` when `id` is found. Responses include an `ETag` header.
 * - 304: Empty response when `If-None-Match` matches the computed ETag.
 * - 404: `{ message: "Project not found", success: false }` when a requested `id` does not exist.
 * - 500: `{ message: "Internal server error.", success: false }` on failure.
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
            const project = data.projects.find(project => parseInt(project.id) === parseInt(id));
            if (!project) {
                return NextResponse.json({ message: "Project not found", success: false }, { status: 404 });
            }
            return NextResponse.json({ project, success: true }, { status: 200, headers: { 'ETag': etag }, });
        } else {
            return NextResponse.json({ projects: data.projects, success: true }, { status: 200, headers: { 'ETag': etag }, });
        }
    } catch (error) {
        console.log("Error occurred while fetching projects:", error.message);
        return NextResponse.json({ message: "Internal server error.", success: false }, { status: 500 });
    }
}

