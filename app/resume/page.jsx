import Appbar from "@/components/Appbar";
import Footer from "@/components/Footer";
import ResumeIntegration from "@/components/resume"


const page = () => {
    return (
        <div className="flex flex-col">
            <Appbar />
            <div className="flex-1">
                <ResumeIntegration />
            </div>
            <Footer />
        </div>
    );
}

export default page
