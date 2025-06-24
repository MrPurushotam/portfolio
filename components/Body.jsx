"use client";
import Link from "next/link";
import ProjectsSection from "./ProjectsSection";
import SkillComponent from "./SkillComponent";
import Socials from "./Socials";
import { useEffect, useRef, useState } from "react";
import BriefProject from "./BriefProject";
import Badge from "./Badge";
import { motion } from "motion/react"

export function Body({ projects, skills, profile }) {
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
    // THOUGHT:- error whle the project brief is rendered its rendering at the center which shouldn't be the case figure out a way to fix it 
    return (
        <div className="w-full h-full relative primary-font bg-gray-200/50 dark:bg-[#10151b]">
            {Object.keys(isProjectBriefObject).length > 0 && (
                <div className="bg-black/50 dark:bg-black/50 z-50 flex justify-center items-center">
                    <BriefProject project={isProjectBriefObject} close={setIsProjectBriefObject} />
                </div>
            )}

            {/* Hero Section */}
            <section id="me" className="min-h-[93vh] h-auto w-full py-3 mx-aufrom-red-to flex justify-center items-center bg-gradient-to-br from-red-500 to-red-600 dark:bg-gradient-to-br dark:from-[#0f2027] dark:via-[#203a43] dark:to-[#2c5364]"
            >
                <div className="relative grid grid-cols-1 md:grid-cols-2 w-11/12 mx-auto h-full gap--8 md:gap-4">
                    {/* Left Image Section (for small screens, image is above text) */}

                    <div className="flex justify-center items-center md:hidden pt-5 pb-3 mb-2 w-full relative">
                        <motion.div
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0], rotate: [0, 360] }}
                            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                            className="absolute w-[450px] h-[450px] bg-teal-400/30 opacity-20 blur-[160px] rounded-full z-0"
                        />

                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="relative z-10 p-[1.5px] bg-gradient-to-tr from-rose-400/30 to-red-400/30 dark:bg-gradient-to-tr dark:from-cyan-300/20 dark:to-blue-400/20 rounded-[2rem]"
                        >
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-2 right-2 bg-cyan-600/70 text-white px-2 py-1 rounded-full text-xs shadow-md border border-white/10 backdrop-blur-sm"
                            >
                                🚀 Building the web
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 6, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-14 right-6 bg-blue-600/70 text-white text-xs px-2 py-1 rounded-full shadow-md border border-white/10 backdrop-blur-sm"
                            >
                                🧠 Lifelong Learner
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-2 left-2 bg-indigo-600/70 text-white font-semibold text-xs px-2 py-1 rounded-full shadow-md border border-white/10 backdrop-blur-sm"
                            >
                                ⚙️ Automating stuff
                            </motion.div>

                            <img
                                src={profile || "pj_png.png"}
                                alt="Pj profile"
                                className="w-[70vw] max-w-xs h-auto rounded-[2rem] shadow-xl object-cover ring-4 ring-white/10 "
                            />
                        </motion.div>
                    </div>


                    {/* Main Content Section */}
                    <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left md:ml-2 lg:ml-28 xl:ml-36">
                        <div className="flex flex-col justify-start md:justify-center">
                            <span className="text-lg md:text-xl italic text-gray-50 dark:text-gray-300 mb-1">Hi, I am</span>
                            <div className="relative inline-block w-fit mx-auto md:mx-0">
                                <img
                                    src="/white-stroke.png"
                                    alt="Brush Stroke"
                                    className="absolute inset-0 scale-125 w-[150%] h-full object-cover -rotate-2"
                                    style={{ zIndex: 0 }}
                                />
                                <span className="relative text-4xl font-semibold tracking-wide title-font text-[#0a100d]">
                                    Purushotam Jeswani
                                </span>
                            </div>
                            <span className="text-lg sm:text-xl font-semibold md:text-2xl italic mt-3 text-white dark:text-[#F87171] ">
                                Full-stack Web Developer & DevOps Engineer
                            </span>
                            <span className="text-base sm:text-lg md:text-xl text-gray-200 italic mb-1 font-semibold tracking-wide">Building scalable apps, automating deployments</span>

                            {/* <span className="text-xl md:text-2xl mx-auto font-medium tracking-wide w-[70%] md:mx-0 md:w-[90%] italic mt-2 text-gray-50 dark:text-gray-300">
                                Hey, I’m Purushotam Jeswani—Full Stack Developer, problem solver, and creative thinker. I love turning ideas into smooth, scalable solutions while keeping things fun and fresh. Whether it’s coding, DevOps, or pushing the boundaries of what’s possible, I’m all in. Let’s build something cool!
                            </span> */}

                        </div>
                        <div className="flex flex-col md:flex-row justify-center space-y-4 md:justify-start sm:space-y-2 md:space-x-4 items-center">
                            <Link
                                href="/resume"
                                className="flex justify-center items-center space-x-1 px-6 py-3 text-sm md:text-base font-bold tracking-wider border-2 border-white  rounded-full text-white dark:text-gray-300 uppercase hover:bg-white hover:text-red-600 dark:hover:bg-gray-300 dark:hover:text-black transition duration-300"
                            >
                                Download Resume
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-block px-6 py-3 text-sm md:text-base font-bold tracking-wider border-2 border-white  rounded-full text-white dark:text-gray-300 uppercase hover:bg-white hover:text-red-600 dark:hover:bg-gray-300 dark:hover:text-black transition duration-300"
                            >
                                Get in touch
                            </Link>
                        </div>
                        <div className="flex justify-center md:justify-start items-center mt-6">
                            <Socials />
                        </div>
                    </div>

                    {/* Right Image Section (only visible on md and above) */}
                    <div className="hidden md:flex justify-center items-center w-full relative">
                        <motion.div
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0], rotate: [0, 360] }}
                            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                            className="absolute w-[450px] h-[450px] bg-teal-400/30 opacity-20 blur-[160px] rounded-full z-0"
                        />

                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="relative z-10 p-[1.5px] bg-gradient-to-tr from-rose-400/30 to-red-400/30 dark:bg-gradient-to-tr dark:from-cyan-300/20 dark:to-blue-400/20 rounded-[2rem]"
                        >
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-2 right-2 bg-cyan-600/70 text-white px-2 py-1 rounded-full text-xs shadow-md border border-white/10 backdrop-blur-sm"
                            >
                                🚀 Building the web
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 6, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-14 right-6 bg-blue-600/70 text-white text-xs px-2 py-1 rounded-full shadow-md border border-white/10 backdrop-blur-sm"
                            >
                                🧠 Lifelong Learner
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-2 left-2 bg-indigo-600/70 text-white font-semibold text-xs px-2 py-1 rounded-full shadow-md border border-white/10 backdrop-blur-sm"
                            >
                                ⚙️ Automating stuff
                            </motion.div>

                            <img
                                src={profile || "pj_png.png"}
                                alt="Pj profile"
                                className="w-full max-w-[400px] lg:max-w-[400px] rounded-[2rem] lg:rounded-[3rem] object-cover shadow-xl ring-4 ring-white/10 "
                            />
                        </motion.div>
                    </div>
                    <div className="absolute z-10 top-[103%] md:top-[115%] left-0 w-full md:col-span-2 flex justify-center items-center animate-bounce text-white text-2xl">
                        <i className="ph-duotone ph-caret-down"></i>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="w-full h-[85vh] mx-auto flex justify-center items-center py-10 bg-gray-200/50 dark:bg-[#10151b]">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="h-auto w-11/12 md:w-3/5 p-3 pt-8 px-8 md:px-12 md:pt-16 md:pb-16 bg-gray-300/30 dark:bg-[#10151b]/50 ring-1 ring-gray-200 dark:ring-0 dark:border  dark:border-[#ffffff1a] rounded-xl shadow-md shadow-black/20"
                >
                    <h2 className="flex items-center justify-center text-[#f59e0b] dark:text-[#fff4b7] text-xl md:text-3xl my-4 md:my-6 capitalize text-center font-[730] tracking-wide master-font hover:text-[#fbbf24] dark:hover:text-[#ffd686] transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className=" h-6 md:h-9 mr-2 mb-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        About Me
                    </h2>
                    <div className="w-12 h-[2px] bg-gray-400 dark:bg-gray-500 mx-auto mt-2 mb-4 rounded-full"></div>
                    <p className="text-lg md:text-xl text-justify dark:text-[#d2e3f8] master-font pl-4 tracking-wide leading-relaxed">
                        I thrive on building <b>scalable</b>, high-impact solutions using <b>React</b>, <b>Next.js</b>, <b>Node.js</b>, and <b>Aws</b>. Creativity and experimentation drive my approach — I love pushing boundaries and crafting seamless experiences that go beyond just writing code.
                        <br />
                        Beyond tech, I'm deeply curious about geopolitics, enjoy reading, and love exploring new places (preferably on two wheels!). With a strategic mindset and a passion for innovation, I embrace challenges with enthusiasm and a growth-focused mindset. Let’s build something extraordinary together.
                    </p>
                    <h2 className="flex items-center justify-center text-[#f59e0b] dark:text-[#fff4b7] text-xl md:text-3xl my-4 md:my-6 capitalize text-center font-[730] tracking-wide master-font hover:text-[#fbbf24] dark:hover:text-[#ffd686] transition-colors duration-300">
                        <i className="ph-duotone ph-student text-xl md:text-3xl mb-2 mr-2"></i>
                        Education
                    </h2>
                    <div className="w-12 h-[2px] bg-gray-400 dark:bg-gray-500 mx-auto mt-2 mb-4 rounded-full"></div>
                    <div className="text-xl md:text-3xl text-justify flex flex-col gap-6 dark:text-[#d2e3f8] pl-4 ">
                        <div className="flex flex-col w-full px-2">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center ">
                                <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold text-neutral-900 dark:text-[#ffd686]">
                                    Lovely Professional University, Phagwara, Punjab
                                </h2>
                                <p className="text-lg md:text-xl  text-gray-700 sm:text-right sm:mt-1 dark:text-[#ffd686]">2022-2026</p>
                            </div>
                            <p className="text-base md:text-lg mt-2">
                                Currently, pursuing my B.Tech in Computer Science and Engineering
                            </p>
                        </div>

                        {/* Lakshmipat Singhania Public School Section */}
                        <div className="flex flex-col w-full px-2">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center ">
                                <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold text-neutral-900 dark:text-[#ffd686]">
                                    Lakshmipat Singhania Public School, Odisha
                                </h2>
                                <p className="text-lg md:text-xl text-gray-700 sm:text-right sm:mt-1 dark:text-[#ffd686]">2019 - 2021</p>
                            </div>
                            <p className="text-base md:text-lg mt-2">
                                Completed my high school from hometown Rayagada, Odisha.
                            </p>
                        </div>
                    </div>

                </motion.div>
            </section>

            <section id="skills" className="w-full mx-auto flex flex-col justify-center pt-8 pb-7">
                <div className="relative flex mt-8 mb-8 justify-center items-center">
                    <div
                        className="absolute w-11/12 md:w-8/12 h-16 md:h-24 bg-no-repeat bg-contain transform -rotate-6 -top-1 dark:hidden"
                        style={{
                            backgroundImage: "url('https://www.pngarts.com/files/10/Paint-Brush-Stroke-PNG-Picture.png')",
                            backgroundPosition: "center",
                        }}
                    >
                    </div>
                    <div
                        className="absolute w-11/12 md:w-8/12 h-16 md:h-40 bg-no-repeat bg-contain transform rotate-12 -top-18 hidden dark:block mix-blend-lighten"
                        style={{
                            backgroundImage: "url('https://www.pngkit.com/png/full/19-196298_brush-strokes-paint-brush-line-png.png')",
                            backgroundPosition: "center",
                        }}
                    >
                    </div>
                    <h2 className="relative text-3xl md:text-6xl font-bold text-center tracking-wider underline decoration-wavy decoration-[#fbbf24] text-white dark:text-black">
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
            <section id="projects" className="bg-gray-200/50 dark:bg-inherit py-10">
                <div className="w-full space-y-6">
                    <div className="relative flex flex-col justify-center items-center w-10/12 md:w-7/12 mx-auto ">
                        {/* <div className=" w-2/3 mx-auto absolute top-0 left-0 right-0  h-[3px] bg-black bg-gradient-to-r from-transparent via-black to-transparent"></div> */}
                        <h2 className="relative text-3xl md:text-6xl font-bold text-center tracking-wider text-red-500" id="projects">
                            Projects
                        </h2>
                        <div className=" w-2/3 mx-auto my-2 h-[3px] bg-black dark:bg-white bg-gradient-to-r from-transparent via-black to-transparent dark:from-white dark:via-red-500 dark:to-white"></div>
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
