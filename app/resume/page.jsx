import Appbar from "@/components/Appbar";
import Footer from "@/components/Footer";
import ResumeIntegration from "@/components/resume"

export const metadata = {
  title: 'Resume',
  description: 'View the professional resume of Purushotam Jeswani, a full-stack developer specializing in React, Next.js, Node.js, Docker, AWS, Prisma, MongoDB, and PostgreSQL. Highlighting industry experience, technical skills, and innovative projects for opportunities in India and the USA.',
  openGraph: {
    title: 'Resume of Purushotam Jeswani - Full-Stack Developer',
    description: 'Explore the professional journey, technical expertise, and notable projects of Purushotam Jeswani. Specializing in React, Node.js, Next.js, and AWS technologies.',
    images: ['/favicon-96x96.png'],
    type: 'website'
  }
};
export const fetchResumeDocIdServerSide = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/all/resume`, { method: 'GET' });
  const data = await res.json();
  console.log("server side resume page")
  return {
    props: {
      resumeData: data.resumeDocId,
    },
  };
};

const page = async () => {
  const data = await getServerSideProps();
  const { resumeData } = data.props;
  return (
    <div className="flex flex-col">
      <Appbar />
      <div className="flex-1">
        <ResumeIntegration resumeDocId={resumeData} />
      </div>
      <Footer />
    </div>
  );
}

export default page;
