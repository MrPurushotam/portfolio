"use client";
import Link from "next/link";
import ProjectsSection from "./ProjectsSection";
import SkillComponent from "./SkillComponent";
import Socials from "./Socials";
import { useEffect, useRef, useState } from "react";
import BriefProject from "./BriefProject";
import Badge from "./Badge";

export function Body({ projects, skills }) {
    const [isProjectBriefObject, setIsProjectBriefObject] = useState(false);
    const langCount = useRef({});
    const [uniqueLanguages, setUniqueLanguges] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [paticularLang, setPaticularLang] = useState("");

    const initializeLanguages = () => {
        const langMap = {};

        projects?.forEach((project) => {
            JSON.parse(project.techstack).forEach((tech) => {
                langMap[tech] = (langMap[tech] || 0) + 1;
            });
        });

        langCount.current = langMap;
        setUniqueLanguges(Object.keys(langMap));
        setFilteredProjects(projects);
    };

    const handleBadgeClick = (language) => {
        setPaticularLang(language)
        sortProjects(language);
    };
    const sortProjects = (language) => {
        if (!language) {
            setFilteredProjects(projects);
        } else {
            const filtered = projects.filter((project) =>
                JSON.parse(project.techstack).includes(language)
            );
            setFilteredProjects(filtered);
        }
    };
    useEffect(() => {
        initializeLanguages();
    }, [projects]);
    
    return (
        <div className="w-full h-full relative primary-font">
            {Object.keys(isProjectBriefObject).length>0 && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
                    <BriefProject project={isProjectBriefObject} close={setIsProjectBriefObject} />
                </div>
            )}

            {/* Hero Section */}
            <section id="me" className="h-[70vh] w-full mx-auto flex justify-center items-center bg-red-500">
                <div className="grid grid-cols-1 md:grid-cols-2 w-11/12 mx-auto h-full">
                    <div className="flex justify-center items-center md:hidden">
                        <img
                            src="https://avatarfiles.alphacoders.com/319/319682.png"
                            alt="Pj profile"
                            className="h-40 w-40 md:h-full md:w-auto rounded-md object-cover"
                        />
                    </div>
                    <div className="flex justify-center items-center">
                        <div className="text-center md:text-left">
                            <div>
                                <span className="text-lg md:text-3xl">Hi, I am</span>
                                <br />
                                <span className="text-2xl md:text-4xl font-bold master-font">Purushotam Jeswani</span>
                                <br />
                                <span className="text-lg md:text-3xl itatlic">
                                    Full-stack Web Developer & DevOps Enthusiast from India
                                </span>
                            </div>

                            <Link
                                href="/contact"
                                className="inline-block mt-6 md:mt-10 text-center text-lg md:text-3xl border-2 border-black rounded p-2 md:p-3 uppercase hover:bg-red-400/80"
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
                            alt="Pj profile"
                            className="h-40 w-40 md:h-full md:w-auto rounded-md object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="w-full mx-auto flex justify-center py-10 bg-gray-200/50">
                <div className="h-auto w-11/12 md:w-3/5 p-3 pt-8 md:pt-16 md:pb-16">
                    <h2 className="flex items-center text-red-600 text-3xl md:text-6xl my-6 md:my-8 capitalize text-center font-bold tracking-wide">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 md:h-12 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        About Me
                    </h2>
                    <p className="text-3xl md:text-4xl text-justify">
                        Hi 🙋🏻‍♂️, I am Purushotam Jeswani, a <span className="animated-text font-bold text-4xl capitalize p-1 bg-black">Full Stack Developer</span>, with prior experience in <span className="animated-text font-bold text-4xl capitalize p-1 bg-black">DevOps</span>, bringing development and deployment together to deliver reliable solutions.
                        I am someone who is curious to make an impact with my skills, someone who is driven by a zeal about coding, someone who is excited to take on advanced projects with a growth-oriented, jolly mindset.
                        Instead of conventional education, I value continuous learning and I love exploring ideas, out-of-the-box. Getting motivated and influenced by passionate and intellectual minds is something that brings energy into my work.
                        I strive to be the person you would surely enjoy working with. Although I have my areas of improvement, as in I occasionally struggle with management of time, I am working on getting better at it.
                    </p>
                    <h2 className="flex items-center text-amber-800 text-3xl md:text-6xl my-6 md:my-8 capitalize text-center font-bold tracking-wide">
                        <i className="ph-duotone ph-student text-5xl"></i>
                        Education
                    </h2>
                    <div className="text-3xl md:text-4xl text-justify flex flex-col">
                        <div className="flex flex-col w-full px-2">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-semibold text-neutral-900">Lovely Professional University, Phagwara, Punjab </h2>
                                <p className="text-xl text-gray-700">2022-2026</p>
                            </div>
                            <p className="text-2xl">Currently, pursuing my B.Tech in Computer Science and Engineering</p>
                        </div>
                        <div className="flex flex-col w-full px-2">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-semibold text-neutral-900">Lakshmipat Singhania Public School </h2>
                                <p className="text-xl text-gray-700">2019 - 2021</p>
                            </div>
                            <p className="text-2xl">Completed my high school from hometown Rayagada, Odisha.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="skills" className="w-full mx-auto flex flex-col justify-center pt-8 pb-7">
                <div className="relative flex mt-8 mb-8 justify-center items-center">
                    <div
                        className="absolute w-11/12 md:w-8/12 h-16 md:h-24 bg-no-repeat bg-contain transform -rotate-6 -top-1 "
                        style={{
                            backgroundImage: "url('https://www.pngarts.com/files/10/Paint-Brush-Stroke-PNG-Picture.png')",
                            backgroundPosition: "center",
                        }}
                    >
                    </div>
                    <h2 className="relative text-3xl md:text-6xl font-bold text-center tracking-wider text-white">
                        Skills
                    </h2>
                </div>
                <div className="w-11/12 md:w-4/5 mx-auto flex flex-wrap gap-4 justify-center md:justify-start p-5">
                    {skills?.map((skill) => (
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
                    <div className="relative flex flex-col justify-center items-center w-10/12 md:w-7/12 mx-auto ">
                        {/* <div className=" w-2/3 mx-auto absolute top-0 left-0 right-0  h-[3px] bg-black bg-gradient-to-r from-transparent via-black to-transparent"></div> */}
                        <h2 className="relative text-3xl md:text-6xl font-bold text-center tracking-wider text-red-500" id="projects">
                            Projects
                        </h2>
                        <div className=" w-2/3 mx-auto my-2 h-[3px] bg-black bg-gradient-to-r from-transparent via-black to-transparent"></div>
                        <div className="w-full sm:w-4/5 md:w-2/3 lg:w-2/3 min-h-16 mx-auto p-2 flex flex-wrap justify-center items-center gap-2">
                            <Badge text={"All"} type="outline" count={projects?.length} onClick={() => handleBadgeClick("")} className={`${(paticularLang === "") ? "bg-rose-500/90 text-white" : ""}`} />
                            {
                                uniqueLanguages.map((tech, idx) => {
                                    return (
                                        <Badge key={idx} text={tech} type="outline" count={langCount.current[tech]} onClick={() => handleBadgeClick(tech)} className={`${paticularLang === tech ? "bg-red-500/90 text-white" : ""}`} />
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="w-11/12 md:w-8/12 mx-auto space-y-4 p-5">
                        {filteredProjects?.map((project) => (
                            <ProjectsSection key={project.id} project={project} state={setIsProjectBriefObject} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
