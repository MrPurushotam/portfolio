"use client";
import Link from "next/link";
import ProjectsSection from "./ProjectsSection";
import SkillComponent from "./SkillComponent";
import Socials from "./Socials";
import { useState } from "react";
import BreifProject from "./BriefProject";

export function Body({ projects, skills }) {
    const [breifOpen, setBreifOpen] = useState(false);
    return (
        <div className="w-full h-full relative primary-font">
            {breifOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
                    <BreifProject id={breifOpen} close={setBreifOpen} />
                </div>
            )}

            {/* Hero Section */}
            <section id="me" className="h-[70vh] w-full mx-auto flex justify-center items-center bg-red-500">
                <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
                    <div className="flex justify-center items-center md:hidden">
                        <img
                            src="https://avatarfiles.alphacoders.com/319/319682.png"
                            alt="pfp"
                            className="h-40 w-40 md:h-full md:w-auto rounded-full object-cover"
                        />
                    </div>
                    <div className="flex justify-center items-center">
                        <div className="text-center md:text-left">
                            <div>
                                <span className="text-lg md:text-3xl">Hi, my name is</span>
                                <br />
                                <span className="text-2xl md:text-4xl font-bold master-font">Purushotam Jeswani</span>
                                <br />
                                <span className="text-lg md:text-3xl itatlic">
                                    Full-stack Web Developer & DevOps Enthusiast from India
                                </span>
                            </div>

                            <Link
                                href="/contact"
                                className="inline-block mt-6 md:mt-10 text-center text-lg md:text-3xl border-2 border-black rounded p-2 md:p-3 uppercase"
                            >
                                Get in touch
                            </Link>
                            <div className="flex justify-center md:justify-start items-center my-4">
                                <Socials />
                            </div>
                        </div>
                    </div>

                    {/* Right Image Section */}
                    <div className="p-4 justify-center items-center hidden md:flex">
                        <img
                            src="https://avatarfiles.alphacoders.com/319/319682.png"
                            alt="pfp"
                            className="h-40 w-40 md:h-full md:w-auto rounded-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="w-full mx-auto flex justify-center py-10 bg-gray-200/40">
                <div className="h-auto w-11/12 md:w-3/5 p-3 pt-8 md:pt-16 md:pb-16">
                    <h2 className="text-red-600 border-red-500 border-b-2 text-3xl md:text-6xl my-6 md:my-8 capitalize text-center font-bold tracking-wide">About</h2>
                    <p className="text-3xl md:text-4xl text-justify">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem possimus ad veniam cupiditate
                        tenetur ut cum commodi ab impedit? Reiciendis omnis harum voluptatum rem possimus suscipit,
                        accusantium beatae vero explicabo ipsa aspernatur, eveniet recusandae, quae quidem minus
                        quibusdam natus tempore tenetur voluptatem accusamus voluptatibus mollitia. Excepturi quibusdam
                        suscipit enim reiciendis?
                    </p>
                </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="w-full mx-auto flex flex-col justify-center pt-8 pb-7">
                <div className="relative flex mt-8 mb-8 justify-center items-center">
                    {/* Brush stroke background */}
                    <div
                        className="absolute w-11/12 md:w-8/12 h-16 md:h-24 bg-no-repeat bg-contain transform -rotate-6 -top-1 "
                        style={{
                            backgroundImage: "url('https://www.pngarts.com/files/10/Paint-Brush-Stroke-PNG-Picture.png')",
                            backgroundPosition: "center",
                        }}
                    ></div>
                    {/* Projects text */}
                    <h2 className="relative text-3xl md:text-6xl font-bold text-center tracking-wider text-white">
                        Skills
                    </h2>
                </div>
                <div className="w-11/12 md:w-4/5 mx-auto flex flex-wrap gap-4 justify-center md:justify-start p-5">
                    {skills.map((skill) => (
                        <div
                            className="w-[45%] md:w-[30%] h-fit rounded shadow-md"
                            key={skill.id}
                        >
                            <SkillComponent tag={skill.name} link={skill.imagelink} type={skill.type} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="bg-gray-200/50 py-10">
                <div className="w-full space-y-6">
                    <div className="relative flex justify-center items-center">
                        {/* Brush stroke background */}
                        <div
                            className="absolute w-11/12 md:w-8/12 h-16 md:h-24 bg-no-repeat bg-contain transform -rotate-6 -top-1 "
                            style={{
                                backgroundImage: "url('https://www.pngarts.com/files/10/Paint-Brush-Stroke-PNG-Picture.png')", // Replace with your brush stroke image path
                                backgroundPosition: "center",
                            }}
                        ></div>
                        {/* Projects text */}
                        <h2 className="relative text-3xl md:text-6xl font-bold text-center tracking-wider text-[#ff8700] ">
                            Projects
                        </h2>
                    </div>
                    <div className="w-11/12 md:w-8/12 mx-auto space-y-4 p-5">
                        {projects?.map((project) => (
                            <ProjectsSection key={project.id} project={project} state={setBreifOpen} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
