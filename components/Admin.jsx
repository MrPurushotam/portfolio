"use client"
import { useEffect, useState } from "react";
import UpdateProjects from "./UpdateProjects";
import UpdateSkill from "./UpdateSkill";
import { useRouter } from "next/navigation";
import data from "@/data/staticData.json"
import useCurrentTime from "./currentTime";

const Admin = () => {
    const time = useCurrentTime();
    const [edit, setEdit] = useState("")
    const [editData, setEditData] = useState("");
    const [projects, setProjects] = useState(data.projects)
    const [skills, setSkills] = useState(data.skills)
    const [resumeDocId, setResumeDocId] = useState(data.resumeDocId)
    const router = useRouter();

    useEffect(() => {
        const token = window.localStorage.getItem("auth");
        if (!token) {
            router.push("/login")
        }
    })

    function greet() {
        let date = new Date();
        const hour = date.getHours();
        if (hour >= 5 && hour < 12) {
            return "Morning Purushotam"
        }
        if (hour >= 12 && hour < 17) {
            return "Afternoon Purushotam"
        }
        if (hour >= 17 && hour < 23) {
            return "Evening Purushotam"
        }
        if (hour >= 0 && hour < 5) {
            return "Its late Purushotam"
        }
    }

    const logout = async () => {
        try {
            const resp = await fetch("/api/logout", { method: "GET" })
            if (resp.ok) {
                router.push("/");
            }
        } catch (error) {
            console.log("Error occured.", error, message)
        }
    }

    const handleEdit = (type, id) => {
        setEditData({ type, id })
    }

    const handleDelete = async (type, id) => {
        const confrim = confirm(`Are you sure you want to delete ${type}?`);
        if (!confrim) {
            return;
        }
        const resp = await fetch(`/api/${type}`, { method: "DELETE", body: JSON.stringify({ id }) });
        if (resp.ok) {
            console.log("Deleted ", type);
            if (type === "project") {
                setProjects(prev => {
                    return prev.filter(proj => proj.id !== id)
                })
            }
            if (type === "skill") {
                setSkills(prev => {
                    return prev.filter(skill => skill.id !== id)
                })
            }
        }
    }

    const handleResumeLinkInput = (e) => {
        let val = e.target.value
        let docId;
        if (val.startsWith("https")) {
            docId = val.split("document/d/")[1].split("/edit")[0];
            setResumeDocId(docId)
        } else {
            docId = e.target.value;
            setResumeDocId(docId)
        }
    }

    const handleResumeDocIdUpdate = async (e) => {
        e.preventDefault();
        if (!resumeDocId) {
            alert("Resume DocId can't be null");
            return;
        }
        const resp = await fetch("/api/resume", { method: "POST", body: JSON.stringify({ docId: resumeDocId }) })

        if (resp.ok) {
            console.log("resume doc id updated.");
        }
    }

    return (
        <div className="w-full h-screen py-5 px-2 bg-white">
            {(edit === "projects" || editData?.type === "projects") && <UpdateProjects setProjects={setProjects} close={editData?.type === "projects" ? setEditData : setEdit} updating={editData?.id || null} />}
            {(edit === "skills" || editData?.type === "skills") && <UpdateSkill setSkills={setSkills} close={editData?.type === "skills" ? setEditData : setEdit} updating={editData?.id || null} />}
            <div className="flex flex-col justify-center w-[80%] min-h-96 py-3 px-8 border-2 border-black mx-auto space-y-4 rounded-md">
                <div className="flex justify-between pt-7">
                    <h3 className="text-sm text-gray-900 font-semibold tracking-wider">{time}</h3>
                    <button className="font-semibold text-lg bg-red-500 hover:bg-red-700 disabled:bg-red-700 px-3 py-1 rounded-md shadow-md text-white " onClick={logout}>Logout</button>
                </div>
                <div>
                    <h2 className="text-center font-semibold tracking-wider text-xl">{greet()}</h2>
                </div>

                <div className="w-11/12 mx-auto p-1 flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold tracking-wider">Projects</h2>
                        <i className="ph-duotone ph-pencil-simple text-2xl hover:text-sky-600 " onClick={() => setEdit("projects")}></i>
                    </div>
                    <div className="w-full h-fit border-2 border-amber-600 overflow-y-auto overflow-x-hidden flex flex-wrap gap-2 p-1">
                        {projects.map((fields) => {
                            return (
                                <div key={fields.id} className="flex flex-col justify-center items-center w-32 h-32 rounded-md shadow-sm border-2 border-amber-900 capitalize ">
                                    {fields.title}
                                    <div className="flex space-x-1 py-1">
                                        <i className="ph-duotone ph-note-pencil text-xl font-semibold hover:text-green-600 z-1" title="Edit Projects" onClick={() => handleEdit("projects", fields.id)}></i>
                                        <i className="ph-duotone ph-trash-simple text-xl font-semibold hover:text-red-600 z-1" title="Delete Project" onClick={() => handleDelete("project", fields.id)}></i>

                                    </div>
                                </div>
                            )
                        })
                        }
                    </div>

                </div>

                <div className="w-11/12 mx-auto p-1 flex flex-col space-y-3">
                    <div className="flex items-center justify-between ">
                        <h2 className="text-xl font-semibold tracking-wider">Skills</h2>
                        <i className="ph-duotone ph-pencil-simple text-2xl hover:text-sky-600" onClick={() => { setEdit("skills") }}></i>
                    </div>
                    <div className="w-full min-h-36 h-fit border-2 border-amber-600 overflow-y-auto overflow-x-hidden flex flex-wrap gap-2 p-1">
                        {skills.map((skill) => {
                            return (
                                <div key={skill.id} className="flex justify-center items-center flex-col w-32 h-32 rounded-md shadow-sm border-2 border-amber-900 capitalize">
                                    {skill.name}
                                    <div className="flex space-x-1 py-1">
                                        <i className="ph-duotone ph-note-pencil text-xl font-semibold hover:text-green-600 z-1" title="Edit Skills" onClick={() => { handleEdit("skills", skill.id) }}></i>
                                        <i className="ph-duotone ph-trash-simple text-xl font-semibold hover:text-red-600 z-1" title="Delete Skills" onClick={() => handleDelete("skill", skill.id)}></i>

                                    </div>
                                </div>
                            )
                        })
                        }
                    </div>
                </div>

                <div className="w-11/12 mx-auto h-36">
                    <label className='block text-black font-semibold mb-2'>Resume DocId / Google Doc Resume Link</label>
                    <input
                        type="text"
                        placeholder="Resume Link DocId"
                        className='w-full px-3 py-2 border border-gray rounded-md focus:outline-none focus:border-indigo-500'
                        name="resumeDocId"
                        onChange={handleResumeLinkInput}
                        value={resumeDocId}
                    />
                    <button className={`bg-cyan-500 text-white font-semibold  text-xl px-3 py-2 my-4 rounded-md shaodwmd disabled:bg-cyan-700 hover:bg-cyan-700`}
                        disabled={resumeDocId === data.resumeDocId} onClick={handleResumeDocIdUpdate} >Update</button>
                </div>

            </div>
        </div>
    )
}


export default Admin;