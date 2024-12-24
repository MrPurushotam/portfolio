import { NextResponse } from "next/server";
import { readData, writeData } from '../../../utils/common';

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, imagelink, type } = body;

        if (!name || !imagelink) {
            return NextResponse.json(
                { message: "Please fill required fields (name, imagelink).", success: false },
                { status: 401 }
            );
        }

        const newSkill = {
            id: Date.now(),
            name,
            imagelink,
            type
        };

        const data = await readData();
        data.skills.push(newSkill);

        await writeData(data);

        return NextResponse.json(
            { message: "Skill added successfully.", success: true, newSkill },
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
        const { id, name, imagelink, type } = body;

        if (!id || !name || !imagelink || !type) {
            return NextResponse.json(
                { message: "Please provide all required fields (id, name, imagelink, type).", success: false },
                { status: 401 }
            );
        }

        const data = await readData();
        const skillIndex = data.skills.findIndex(skill => skill.id === id);

        if (skillIndex === -1) {
            return NextResponse.json(
                { message: "Invalid skill id.", success: false },
                { status: 403 }
            );
        }

        data.skills[skillIndex] = { ...data.skills[skillIndex], name, imagelink, type };

        await writeData(data);

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

        const data = await readData();
        data.skills = data.skills.filter(skill => skill.id !== id);

        await writeData(data);

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
