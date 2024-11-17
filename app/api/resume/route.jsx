import fs from 'fs';
import path from "path";
import { NextResponse } from 'next/server';
const filePath = path.resolve('data/staticData.json');

function readData() {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return { projects: data.projects || [], skills: data.skills || [] , resumeDocId : data.resumeDocId };
}
function writeData(updatedData) {
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf-8');
}

export async function POST(req) {
    try {
        const body =await req.json();
        const {docId} = body;
        if (!docId) {
            return NextResponse.json({ message: "DocId is important .", success: false }, { status: 401 });
        }

        const data = readData();
        data.resumeDocId=docId;
        writeData(data);
        return NextResponse.json({ message: "Resume Doc Id added successfully.", success: true }, { status: 200 });
    } catch (error) {
        console.log("Error occurred while adding project:", error.message);
        return NextResponse.json({ message: "Internal server error.", success: false }, { status: 500 });
    }
}
