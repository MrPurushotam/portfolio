import { NextResponse } from 'next/server';
import { readData } from '@/utils/common';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const choice = searchParams.get('choice');

        const data = await readData();

        let response = { success: true };

        if (!choice) {
            response = data;
            response.success = true;
        }
        else {
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
        }
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching data', success: false }, { status: 500 });
    }
}
