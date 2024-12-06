import ContactPage from "@/components/ContactPage"
import Appbar from "@/components/Appbar";
import Footer from "@/components/Footer"

const page = () => {
  return (
    <div className="flex flex-col">
      <Appbar />
      <div className="flex-1">
        <ContactPage />
      </div>
      <Footer />
    </div>
  )
}

export default page
