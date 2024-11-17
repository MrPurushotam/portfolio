import fs from 'fs';
import path from "path";
import { NextResponse } from "next/server";

const filePath = path.resolve('data/staticData.json');

// Helper function to read and parse JSON file
function readJSONFile() {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// Helper function to write to JSON file
function writeJSONFile(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, link, type } = body;

        if (!name || !link) {
            return NextResponse.json(
                { message: "Please fill required fields (name, link).", success: false },
                { status: 401 }
            );
        }

        const newSkill = {
            id: Date.now(),
            name,
            link,
            type
        };

        const data = readJSONFile();
        data.skills.push(newSkill);

        writeJSONFile(data);

        return NextResponse.json(
            { message: "Skill added successfully.", success: true,newSkill },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error occurred while creating skill.", error.message);
        return NextResponse.json(
            { message: "Internal error occurred.", success: false },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, name, link, type } = body;

        if (!id || !name || !link || !type) {
            return NextResponse.json(
                { message: "Please provide all required fields (id, name, link, type).", success: false },
                { status: 401 }
            );
        }

        const data = readJSONFile();
        const skillIndex = data.skills.findIndex(skill => skill.id === id);

        if (skillIndex === -1) {
            return NextResponse.json(
                { message: "Invalid skill id.", success: false },
                { status: 403 }
            );
        }

        data.skills[skillIndex] = { ...data.skills[skillIndex], name, link, type };

        writeJSONFile(data);

        return NextResponse.json(
            { message: "Skill updated successfully.", updatedSkill: data.skills[skillIndex], success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error occurred while updating skill.", error.message);
        return NextResponse.json(
            { message: "Internal error occurred.", success: false },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { message: "Invalid skill id.", success: false },
                { status: 401 }
            );
        }

        const data = readJSONFile();
        data.skills = data.skills.filter(skill => skill.id !== id);

        writeJSONFile(data);

        return NextResponse.json(
            { message: "Skill deleted successfully.", success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error occurred while deleting skill.", error.message);
        return NextResponse.json(
            { message: "Internal error occurred.", success: false },
            { status: 500 }
        );
    }
}
