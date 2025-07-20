"use client"
import React, { useEffect, useRef, useState } from 'react'
import Spinner from './Spinner';
import { AxeIcon, ImageIcon, MonitorIcon } from '@phosphor-icons/react';
import { XCircleIcon } from '@phosphor-icons/react/dist/ssr';

const extractNotionLink = (link) => {
    const parts = link.split('/');
    const docTitle = parts.length > 0 ? parts[parts.length - 1] : link;
    const distoredSplitArray = docTitle.split("-");
    return distoredSplitArray[distoredSplitArray.length - 1];
};

const UpdateProjects = React.memo(({ setProjects, close, updating }) => {
    const outDivRef = useRef(null)
    const projectData = useRef(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formdata, setFormdata] = useState({
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
        setLoading(true);
        const techstackArray = formdata?.techstack?.split(',').map(item => item.trim());
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
        } finally {
            setLoading(false);
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

    useEffect(() => {
        const fetchProject = async (updating) => {
            setLoading(true);
            try {
                const resp = await fetch(`/api/project/?id=${updating}`);
                const result = await resp.json();
                console.log(result, resp);
                if (result.success && result.project) {
                    projectData.current = result.project;
                    setFormdata({
                        id: result.project.id,
                        title: result.project.title,
                        description: result.project.description,
                        techstack: JSON.parse(result.project.techstack).join(", "), // Convert JSON array to comma-separated string
                        brief: result.project.brief === true,
                        describe: extractNotionLink(result.project.describe),
                        static_file: result.project.static_file,
                        resourceType: result.project.resourceType,
                        githubLink: result.project.githubLink,
                        liveLink: result.project.liveLink
                    });
                }
            } catch (error) {
                console.log("Error occured while fetching project data: ", error.message);
            } finally {
                setLoading(false);
            }
        }
        if (updating) {
            fetchProject(updating);
        }
    }, [updating])

    return (
        <div className='fixed inset-0 flex items-center justify-center h-screen w-screen bg-black/50 z-50 overflow-y-auto p-4'>
            <div ref={outDivRef} className='relative w-full max-w-4xl max-h-[90vh] p-6 border border-gray-300 rounded-lg shadow-lg bg-white overflow-y-auto my-auto'>
                {loading &&
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-[60] rounded-lg">
                        <Spinner />
                    </div>
                }
                <button
                    className="absolute top-4 right-4 z-10 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={() => {
                        setFormdata({
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
                        close("");
                    }}
                >
                    <AxeIcon size={20} className="text-gray-500 hover:text-red-500" />
                </button>

                <div className="space-y-6 pt-8">
                    <h2 className='text-xl font-bold text-center text-gray-900'>{updating ? "Update Project" : "Add Project"}</h2>

                    <div className="border-4 border-dashed border-gray-700 p-3 flex justify-center items-center min-h-[8rem] w-full rounded-md cursor-pointer relative">
                        {
                            formdata.static_file ?
                                <div className="relative max-w-full max-h-28 overflow-hidden">
                                    {
                                        formdata.resourceType === "video" ?
                                            <video src={formdata.static_file} alt="Preview" className="max-h-28 max-w-full object-contain rounded-md" controls />
                                            :
                                            <img src={formdata.static_file} alt="Preview" className="max-h-28 max-w-full object-contain rounded-md" />
                                    }
                                    <button
                                        className="absolute -top-2 -right-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                                        onClick={() => setFormdata(prev => ({ ...prev, static_file: "" }))}
                                    >
                                        <XCircleIcon size={20} className="text-red-500" />
                                    </button>
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
                                        <div className="relative max-w-full max-h-24 overflow-hidden">
                                            {file.type.startsWith("image/") ? (
                                                <img src={URL.createObjectURL(file)} alt="Preview" className="max-h-24 max-w-full object-contain rounded-md" />
                                            ) : (
                                                <video src={URL.createObjectURL(file)} controls className="max-h-24 max-w-full object-contain rounded-md" />
                                            )}
                                            <button
                                                className="absolute -top-2 -right-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                                                onClick={() => setFile(null)}
                                            >
                                                <XCircleIcon size={20} className="text-red-500" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 text-sm font-semibold text-center flex flex-col justify-center items-center space-y-1">
                                            <span className='flex items-center space-x-2'>
                                                <ImageIcon size={16} /> Upload Image /
                                                <MonitorIcon size={16} />Video
                                            </span>
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
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 min-h-[80px] resize-y'
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
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 min-h-[100px] resize-y'
                                name="describe"
                                onChange={handleFormData}
                                value={formdata.describe}
                            />
                        </div>
                    )}

                    <div>
                        <label className='block text-gray-700 font-semibold mb-2'>Live Link</label>
                        <input
                            type="url"
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
                            type="url"
                            placeholder="Enter GitHub link"
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
                            name="githubLink"
                            onChange={handleFormData}
                            value={formdata.githubLink}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className='w-full text-lg font-semibold tracking-wider px-3 py-2 rounded-md shadow-md bg-sky-500 hover:bg-sky-600 text-white disabled:bg-sky-400 disabled:cursor-not-allowed transition-colors'>
                        {loading ? 'Processing...' : (updating ? "Update Project" : "Add Project")}
                    </button>
                </div>
            </div>
        </div>
    );
});

export default UpdateProjects;
