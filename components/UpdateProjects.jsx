"use client"
import React, { useEffect, useRef, useState } from 'react'
import data from "@/data/staticData.json";

const extractNotionLink = (link) => {
    const parts = link.split('/');
    return parts.length > 0 ? parts[parts.length - 1] : link;
};


const UpdateProjects = React.memo(({ setProjects, close, updating }) => {
    const outDivRef = useRef(null)
    const projectData = useRef(data.projects.find(project => project.id === updating));
    const [file, setFile] = useState(null);
    const [formdata, setFormdata] = useState(projectData.current
        ?
        {
            id: projectData.current.id,
            title: projectData.current.title,
            description: projectData.current.description,
            techstack: JSON.parse(projectData.current.techstack).join(", "), // Convert JSON array to comma-separated string
            brief: projectData.current.brief === true,
            describe: extractNotionLink(projectData.current.describe),
            static_file: projectData.current.static_file,
            resourceType: projectData.current.resourceType,
            githubLink: projectData.current.githubLink,
            liveLink: projectData.current.liveLink
        }
        :
        {
            id: null,
            title: "",
            description: "",
            techstack: "",
            brief: false,
            describe: "",
            static_file: "",
            resourceType: "",
            githubLink: "",
            liveLink: ""
        });

    const handleFormData = (e) => {
        const { name, value, type, checked } = e.target;

        // Handling checkbox (brief) separately
        setFormdata(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async () => {
        console.log(formdata);
        const techstackArray = formdata.techstack.split(',').map(item => item.trim());
        const updatedData = {
            ...formdata,
            techstack: techstackArray,
            describe: extractNotionLink(formdata.describe), // Use the new function here
            githubLink: formdata.githubLink,
            liveLink: formdata.liveLink
        };

        try {
            const formData = new FormData();
            formData.append("id", updatedData.id);
            formData.append("title", updatedData.title);
            formData.append("description", updatedData.description);
            formData.append("techstack", JSON.stringify(updatedData.techstack)); // Convert array to JSON string
            formData.append("brief", updatedData.brief);
            formData.append("describe", updatedData.describe || "");
            formData.append("githubLink", updatedData.githubLink || "");
            formData.append("liveLink", updatedData.liveLink || "");

            // Attach the file if one is selected
            if (file) {
                formData.append("staticfile", file);
            }

            const response = await fetch(`/api/project`, {
                method: updating ? "PUT" : "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result.message);
                if (updating) {
                    setProjects(prev => prev.id === updating ? ({ ...result.updatedProject }) : prev);
                } else {
                    setProjects(prev => ([...prev, result.updatedProject]));
                }
                close("");
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFormdata(prev => ({ ...prev, resourceType: selectedFile.type.split("/")[0] }))
            setFile(selectedFile);
        }
    }

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (outDivRef.current && !outDivRef.current.contains(e.target)) {
                close("");
            }
        }
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        }
    }, [])

    return (
        <div className='absolute inset-0 flex items-center justify-center h-full w-full bg-black/20 z-5'>
            <div ref={outDivRef} className='relative w-11/12 max-w-4xl p-6 border border-gray-300 rounded-lg shadow-lg bg-white space-y-6'>
                <i className="sticky top-[5%] left-[90%] ph-duotone ph-x text-2xl hover:text-red-500"
                    onClick={() => {
                        setFormdata({
                            title: "",
                            description: "",
                            techstack: "",
                            brief: false,
                            describe: ""
                        });
                        close("");
                    }}></i>
                <h2 className='text-xl font-bold text-center text-gray-900'>{updating ? "Update Projects" : "Add Project"}</h2>

                <div className="border-4 border-dashed border-gray-700 p-3 flex justify-center items-center h-32 w-full rounded-md cursor-pointer relative">
                    {
                        formdata.static_file ?
                            <div className="relative">
                                {
                                    formdata.resourceType === "video" ?
                                        <video src={formdata.static_file} alt="Preview" className="h-28 w-fit object-fit rounded-md flex justify-center items-center" controls />
                                        :
                                        <img src={formdata.static_file} alt="Preview" className="h-28 w-fit object-fit rounded-md flex justify-center items-center" />
                                }
                                <i
                                    className="absolute top-0 right-0 ph-duotone ph-x-circle text-lg text-red-500 cursor-pointer"
                                    onClick={() => setFormdata(prev => ({ ...prev, static_file: "" }))}
                                ></i>
                            </div>
                            :
                            <>
                                <input
                                    type="file"
                                    accept="image/*, video/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                />
                                {file ? (
                                    <div className="relative">
                                        {file.type.startsWith("image/") ? (
                                            <img src={URL.createObjectURL(file)} alt="Preview" className="h-24 w-24 object-cover rounded-md" />
                                        ) : (
                                            <video src={URL.createObjectURL(file)} controls className="h-24 w-24 rounded-md" />
                                        )}
                                        <i
                                            className="absolute top-0 right-0 ph-duotone ph-x-circle text-lg text-red-500 cursor-pointer"
                                            onClick={() => setFile(null)}
                                        ></i>
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-sm font-semibold text-center flex flex-col justify-center items-center space-y-1">
                                        <span className='flex items-center space-x-2'><i className="ph-duotone ph-image text-2xl"></i> Upload Image / <i className="ph-duotone ph-monitor-arrow-up text-2xl"></i> Video</span>
                                        <span>(44px X 44px) would go well</span>
                                    </div>
                                )}

                            </>
                    }
                </div>
                <div>
                    <label className='block text-gray-700 font-semibold mb-2'>Project Title</label>
                    <input
                        type="text"
                        placeholder="Enter project title"
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
                        name="title"
                        onChange={handleFormData}
                        value={formdata.title}
                    />
                </div>
                <div>
                    <label className='block text-gray-700 font-semibold mb-2'>Tech Stack (comma separated)</label>
                    <input
                        type="text"
                        placeholder="React, Node.js, etc."
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
                        name="techstack"
                        onChange={handleFormData}
                        value={formdata.techstack}
                    />
                </div>
                <div>
                    <label className='block text-gray-700 font-semibold mb-2'>Project Description</label>
                    <textarea
                        placeholder="Enter a brief project description"
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
                        name="description"
                        onChange={handleFormData}
                        value={formdata.description}
                    />
                </div>
                <div>
                    <label className='flex items-center space-x-2'>
                        <input
                            type="checkbox"
                            className='form-checkbox h-4 w-4 text-indigo-600'
                            name="brief"
                            onChange={handleFormData}
                            checked={formdata.brief}
                        />
                        <span className='text-gray-700'>Show Detailed Description</span>
                    </label>
                </div>

                {/* Conditionally render the describe field if 'brief' is true */}
                {formdata.brief && (
                    <div>
                        <label className='block text-gray-700 font-semibold mb-2'>Detailed Description</label>
                        <textarea
                            placeholder="Enter detailed project description"
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
                            name="describe"
                            onChange={handleFormData}
                            value={formdata.describe}
                        />
                    </div>
                )}

                <div>
                    <label className='block text-gray-700 font-semibold mb-2'>Live Link</label>
                    <input
                        type="text"
                        placeholder="Enter live link"
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
                        name="liveLink"
                        onChange={handleFormData}
                        value={formdata.liveLink}
                    />
                </div>

                <div>
                    <label className='block text-gray-700 font-semibold mb-2'>Github Link</label>
                    <input
                        type="text"
                        placeholder="Enter GitHub link"
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
                        name="githubLink"
                        onChange={handleFormData}
                        value={formdata.githubLink}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className='w-full text-lg font-semibold tracking-wider px-3 py-2 rounded-md shadow-md bg-sky-500 hover:bg-sky-600 text-white disabled:bg-sky-800'>
                    {updating ? "Update Projects" : "Add Project"}
                </button>
            </div>
        </div>
    );
});

export default UpdateProjects;
