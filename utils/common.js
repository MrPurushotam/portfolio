const ApiEndpoint = process.env.EXTENDED_APIENDPOINT;
const ApiKey = process.env.EXTENDED_APIKEY;

export async function readData() {
    try {
        const response = await fetch(`${ApiEndpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'Api-key': ApiKey,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const textResponse = await response.text();
        let data = JSON.parse(textResponse);
        return {
            projects: data.projects || [],
            skills: data.skills || [],
            resumeDocId: data.resumeDocId || "",
            profile: data.profile || "",
        };
    } catch (error) {
        console.error('Error reading data:', error);
        throw error;
    }
}

export async function writeData(updatedData) {
    try {
        await fetch(`${ApiEndpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Api-key': ApiKey
            },
            body: JSON.stringify(updatedData)
        });
    } catch (err) {
        console.log("Error writing data:", err.message);
        throw err;
    }
}


