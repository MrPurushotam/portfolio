"use client";
import React, { useEffect, useRef, useState } from 'react';
import data from "@/data/staticData.json";

const UpdateSkill = ({ setSkills, close, updating }) => {
    const outDivRef = useRef(null);
    const skillData = useRef(data.skills.find(skill => skill.id === updating));
    const [formdata, setFormdata] = useState(skillData.current
        ? {
            name: skillData.current?.name,
            imagelink: skillData.current?.imagelink,
            type: skillData.current?.type,
            id: skillData.current?.id
        }
        : {
            imagelink: "",
            name: "",
            type: "",
            id: null
        }
    );

    const handleFormData = (e) => {
        const { name, value } = e.target;

        setFormdata(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        console.log('Skill Data:', formdata);
        const resp = updating
            ? await fetch(`/api/skill`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formdata),
            })
            : await fetch("/api/skill", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formdata),
            });

        const result = await resp.json();

        if (resp.ok) {
            setSkills(prevSkills => {
                if (updating) {
                    return prevSkills.map(skill =>
                        skill.id === formdata.id ? result.updatedSkill : skill
                    );
                } else {
                    return [...prevSkills, result.newSkill];
                }
            });

            setFormdata({
                imagelink: "",
                name: "",
                type: "",
                id: null,
            });
            close("");
        }else{
            console.log("Some error occured. Abrupt Exit.");
            close("");
        }
    }

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (outDivRef.current && !outDivRef.current.contains(e.target)) {
                close("");
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [close]);

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-50 overflow-hidden h-full w-full">
            <div ref={outDivRef} className="relative w-11/12 max-w-4xl p-6 border border-gray-300 rounded-lg shadow-lg bg-white space-y-6">
                <i className="sticky top-[5%] left-[90%] ph-duotone ph-x text-2xl hover:text-red-500"
                    onClick={() => {
                        setFormdata({
                            imagelink: "",
                            name: "",
                            type: "",
                            id: null
                        });
                        close("");
                    }}>
                </i>
                <h2 className="text-xl font-bold text-center text-gray-900">{updating ? "Update Skill" : "Add Skill"}</h2>
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Skill Name</label>
                    <input
                        type="text"
                        placeholder="Enter Skill"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        name="name"
                        onChange={handleFormData}
                        value={formdata.name}
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Type</label>
                    <input
                        type="text"
                        placeholder="Frontend, Backend, Database, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        name="type"
                        onChange={handleFormData}
                        value={formdata.type}
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Image Link</label>
                    <input
                        type="url"
                        placeholder="Enter a valid link to describe skill"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        name="imagelink"
                        onChange={handleFormData}
                        value={formdata.imagelink}
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    className="w-full text-lg font-semibold tracking-wider px-3 py-2 rounded-md shadow-md bg-sky-500 hover:bg-sky-600 text-white disabled:bg-sky-800">
                    {updating ? "Update Skill" : "Add Skill"}
                </button>
            </div>
        </div>
    );
};

export default UpdateSkill;
