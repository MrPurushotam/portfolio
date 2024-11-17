"use client"
import data from "../data/staticData.json";
import React, { useEffect, useRef } from "react";
import Badge from "./Badge";

const BreifProject = ({ close, id }) => {
    const ref = useRef();
    const project = data.projects.find((project) => project.id === id);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                close(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [close])

    if (!project) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <p className="text-red-500 font-semibold text-lg">Project not found.</p>
            </div>
        );
    }

    const randomSelect = () => {
        let random = Math.floor(Math.random() * 5)
        switch (random) {
            case 0:
                return "outline"
            case 1:
                return "one"
            case 2:
                return "two"
            case 3:
                return "three"
            case 4:
                return "four"
            default:
                return "outline"
        }
    }

    return (
        <div className="fixed w-full h-full inset-0 flex justify-center items-center bg-white/40 z-30">
            <div className="relative w-11/12 max-w-4xl rounded-lg shadow-lg backdrop-blur-sm bg-white/80" ref={ref}>
                <button
                    className="absolute top-4 right-4 text-2xl text-black bg-gray-200 hover:bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:text-red-500 hover:font-bold transition-all z-40"
                    onClick={() => close(null)}
                >
                    ✕
                </button>
                <div className="relative h-60 w-full rounded-t-lg overflow-hidden">
                    {project.resourceType === "video" ? (
                        <video
                            src={project.static_file}
                            autoPlay
                            muted
                            loop
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <img
                            src={project.static_file}
                            alt={project.title}
                            className="h-full w-full object-cover"
                        />
                    )}

                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h2 className="text-white text-lg font-semibold tracking-wide">
                            {project.title}
                        </h2>
                    <div className="flex gap-2 px-2 py-3">
                        {
                            JSON.parse(project.techstack).map((skill, idx) => {
                                return (
                                    <Badge key={idx} text={skill} type={randomSelect()} />
                                )
                            })
                        }
                    </div>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <p className="text-gray-700 text-sm leading-relaxed">
                        {project.description}
                    </p>

                    {project.breif && (
                        <iframe
                            src={project.describe}
                            className="w-full h-64 rounded-md border border-gray-300"
                            title="Blog Page"
                        ></iframe>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BreifProject;
