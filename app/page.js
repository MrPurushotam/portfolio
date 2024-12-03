
import { Body } from "@/components/Body";
import Appbar from "@/components/Appbar";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import Footer from "@/components/Footer";

async function getStaticData() {
  const filePath = path.join(process.cwd(), "data", "staticData.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(fileContent);

  const hash = crypto.createHash("md5").update(fileContent).digest("hex");

  return { projects: data.projects, skills: data.skills, hash,revalidate: 21600 };
}
export default async function Home() {
  const { projects, skills } = await getStaticData();
  return (
    <div className="flex flex-col">
      <div className="flex-1">
        <Body projects={projects} skills={skills} />
      </div>
    </div>
  );
}
