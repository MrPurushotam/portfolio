"use client"
import Link from "next/link";
import ProjectsSection from "./ProjectsSection";
import SkillComponent from "./SkillComponent";
import Socials from "./Socials";
import { useState } from "react";
import BreifProject from "./BriefProject";

export function Body({projects,skills}) {
    const [breifOpen, setBreifOpen] = useState(false);
    return (
        <div className="w-full h-full relative">
            {breifOpen &&(
                    <div className="relative inset-0 bg-black/50 z-50 flex justify-center items-center">
                        <BreifProject id={breifOpen} close={setBreifOpen} />
                    </div>
                )}
            
            <section id="me" className="h-[70vh] w-full mx-auto flex justify-center items-center bg-red-500">
                <div className="grid grid-cols-2 w-full h-full">
                    <div className="p-2 flex justify-center items-center">
                        <div className="h-auto text-left space-y-3">
                            <div>
                                <span className="text-2xl">Hi, my name is</span>
                                <br />
                                <span className="text-3xl">Purushotam Jeswani</span>
                                <br />
                                <span className="text-2xl">Full-stack Web Developer knows devops from India</span>
                            </div>

                            <Link href="/contact" className={"inline-block mt-10 text-center text-2xl border-2 border-black rounded-1 p-3 uppercase"} >Get in touch</Link>
                            <div className="flex justify-start items-center my-3">
                                <Socials />
                            </div>
                        </div>
                    </div>
                    <div className="p-2 flex justify-center items-center">
                        <img src="https://avatarfiles.alphacoders.com/319/319682.png" alt="pfp" className=" h-full" />
                    </div>
                </div>
                {/* will have my name and short start and image */}
            </section>

            <section id="about" className="h-[50vh] w-full mx-auto flex justify-center py-10">
                <div className="h-auto w-3/5 p-3 pt-16">
                    <h2 className="text-red-500 text-3xl my-8 capitalize text-center text-bold">About</h2>
                    <p className="text-xl ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem possimus ad veniam cupiditate tenetur ut cum commodi ab impedit? Reiciendis omnis harum voluptatum rem possimus suscipit, accusantium beatae vero explicabo ipsa aspernatur, eveniet recusandae, quae quidem minus quibusdam natus tempore tenetur voluptatem accusamus voluptatibus mollitia. Excepturi quibusdam suscipit enim reiciendis?</p>
                </div>
            </section>

            <section id="skills" className="h-[70vh] w-full mx-auto flex flex-col justify-center overflow-hidden py-10">
                <h2 className="mx-auto my-8 font-semibold text-3xl">Skills</h2>
                <div className="w-4/5 h-auto flex flex-wrap mx-auto  p-2  gap-3 items-center mt-2 mb-10">
                    {
                        skills.map((skill) => (
                            <div className="w-[30%] h-fit border-2 border-white" key={skill.id}>
                                <SkillComponent tag={skill.name} link={skill.imagelink} type={skill.type} />
                            </div>
                        ))
                    }
                </div>
            </section>

            <section id="projects" className="bg-gray-100/50 rounded-md shadow-md py-10">
                <div className="w-full p-2 space-y-5 min-h-screen h-auto">
                    <h2 className="text-3xl font-bold tracking-wider text-center text-blue-700 cursor-pointer my-6">Projects</h2>
                    <div className="w-8/12 space-y-2 mx-auto p-2">
                    {
                        projects?.map((project)=>{
                            return(
                                <ProjectsSection key={project.id} project={project} state={setBreifOpen} />
                            )
                        })
                    }
                    </div>
                </div>
            </section>

        </div>
    )
}