"use client"
import { useEffect, useRef, useState } from "react";
import UpdateProjects from "./UpdateProjects";
import UpdateSkill from "./UpdateSkill";
import { useRouter } from "next/navigation";
import useCurrentTime from "./currentTime";

const Admin = () => {
    const time = useCurrentTime();
    const [edit, setEdit] = useState("")
    const [editData, setEditData] = useState("");
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resumeDocId, setResumeDocId] = useState("");
    const [profile, setProfile] = useState([]);
    const profileUrlRef = useRef("");
    const initalData = useRef({});
    const [profileUrl, setProfileUrl] = useState(profileUrlRef.current);
    const router = useRouter();

    useEffect(() => {
        const token = window.localStorage.getItem("auth");
        if (!token) {
            router.push("/login")
        }
    },[router])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/all", { method: "GET" });
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        console.log("Data:", data);
                        initalData.current = data;
                        setProjects(data.projects);
                        setSkills(data.skills);
                        setResumeDocId(data.resumeDocId);
                        setProfileUrl(data.profile);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

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
            const resp = await fetch("/api/logout", { method: "GET" });
            if (resp.ok) {
                router.push("/");
            }
        } catch (error) {
            console.log("Error occurred.", error.message);
        }
    };

    const handleEdit = (type, id) => {
        setEditData({ type, id })
    }

    const handleDelete = async (type, id) => {
        const confirmDelete = confirm(`Are you sure you want to delete ${type}?`);
        if (!confirmDelete) {
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
        let val = e.target.value;
        let docId;
        if (val.startsWith("https") && val.includes("document/d/") && val.includes("/edit")) {
            docId = val.split("document/d/")[1].split("/edit")[0];
        } else {
            docId = val;
        }
        setResumeDocId(docId);
    };

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

    const handleProfileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile(file);
            const tempUrl = URL.createObjectURL(file);
            setProfileUrl(tempUrl);
        }
    };

    const uploadProfile = async () => {
        if (!profile) {
            alert("Profile can't be null");
            return;
        }
        const formData = new FormData();
        formData.append("profile", profile);

        const resp = await fetch("/api/profile", {
            method: "POST",
            body: formData
        });

        if (resp.ok) {
            const result = await resp.json();
            console.log("Profile updated.");
            profileUrlRef.current=result.profile;
            console.log(result.profile);
            setProfile(null);
            setProfileUrl(result.profile);
        }
    };
    return (
        <div className="w-full min-h-screen py-5 px-2 bg-white">
            {(edit === "projects" || editData?.type === "projects") && <UpdateProjects setProjects={setProjects} close={editData?.type === "projects" ? setEditData : setEdit} updating={editData?.id || null} />}
            {(edit === "skills" || editData?.type === "skills") && <UpdateSkill setSkills={setSkills} close={editData?.type === "skills" ? setEditData : setEdit} updating={editData?.id || null} />}
            <div className="flex flex-col justify-center w-[80%] py-3 px-8 border-2 border-black mx-auto space-y-4 rounded-md">
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
                    <div className="w-full min-h-32 h-fit border-2 border-amber-600 overflow-y-auto overflow-x-hidden flex flex-wrap gap-2 p-1">
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

                <div className="w-11/12 mx-auto h-auto">
                    <label className='text-xl block text-black font-semibold mb-2'>Resume DocId / Google Doc Resume Link</label>
                    <input
                        type="text"
                        placeholder="Resume Link DocId"
                        className='w-full px-3 py-2 border border-gray rounded-md focus:outline-none focus:border-indigo-500'
                        name="resumeDocId"
                        onChange={handleResumeLinkInput}
                        value={resumeDocId}
                    />
                    <button className={`bg-cyan-500 text-white font-semibold  text-xl px-3 py-2 my-4 rounded-md shaodwmd disabled:bg-cyan-700 hover:bg-cyan-700`}
                        disabled={resumeDocId === initalData.current.resumeDocId} onClick={handleResumeDocIdUpdate} >Update</button>
                </div>

                <div className="w-11/12 mx-auto h-auto">
                    <label className='text-xl block text-black font-semibold mb-2'>Profile</label>
                    {profileUrl && (
                        <div className="mb-4 w-32 h-32 p-2 rounded-md border-2 border-cyan-500 mx-auto">
                            <img src={profileUrl} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <input
                        type="file"
                        className='w-full px-3 py-2 border border-gray rounded-md focus:outline-none focus:border-indigo-500'
                        name="profile"
                        onChange={handleProfileUpload}
                        multiple={false}
                        accept="image/jpeg,image/png,image/jpg"
                    />
                    <button className={`bg-cyan-500 text-white font-semibold text-xl px-3 py-2 my-4 rounded-md shadow-md disabled:bg-cyan-700 hover:bg-cyan-700`}
                        disabled={profileUrl === profileUrlRef.current || !profileUrl} onClick={uploadProfile}>Update Profile</button>
                </div>

            </div>
        </div>
    )
}


export default Admin;