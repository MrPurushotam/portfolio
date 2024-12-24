import { Body } from "@/components/Body";
import Appbar from "@/components/Appbar";
import Footer from "@/components/Footer";

export const fetchStaticDataServerSide = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/all`);
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await res.json();
    return {
      props: {
        projects: data.projects || [],
        skills: data.skills || [],
        profile: data.profile || {},
        resumeDocId: data.resumeDocId || '',
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        projects: [],
        skills: [],
        profile: {},
        resumeDocId: '',
      },
    };
  }
};

export const metadata = {
  title: 'Home | Purushotam Jeswani',
  description: 'Explore my portfolio showcasing full-stack development expertise in React, Next.js, Node.js, and AWS. See innovative projects and skills tailored for tech roles in India and the USA.',
  openGraph: {
    title: 'Purushotam Jeswani - Full-Stack Developer Portfolio',
    description: 'Discover innovative projects and expertise in full-stack development, including React, Next.js, Docker, Prisma, and AWS. Connect with Purushotam Jeswani today!',
    images: ['/favicon-96x96.png'],
    type: 'website'
  }
};

export default async function Home() {
  const data = await fetchStaticDataServerSide();
  const  { projects, skills, profile, resumeDocId } = data.props;
  return (
    <div className="flex flex-col">
      <Appbar />
      <div className="flex-1">
        <Body projects={projects} skills={skills} profile={profile} resumeDocId={resumeDocId}/>
      </div>
      <Footer />
    </div>
  );
}
