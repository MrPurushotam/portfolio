
import Link from "next/link";
import ThemeSelect from "./themeSelect";
import Image from "next/image";

const Footer = () => {

    return (
        <footer className="bg-neutral-800 text-white py-12 md:py-16">
            <div className="w-8/12 md:w-3/5 mx-auto flex flex-col md:flex-row justify-between items-start space-y-5 md:space-y-0 primary-font">
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                    <h3 className="text-3xl md:text-4xl font-bold master-font">Purushotam Jeswani</h3>
                    <div className="flex gap-6">
                        <Link
                            href="https://github.com/MrPurushotam"
                            target="_blank"
                            className="text-3xl hover:text-gray-300 transition duration-300"
                            aria-label="GitHub"
                        >
                            <i className="ph-duotone ph-github-logo text-3xl"></i>
                        </Link>
                        <Link
                            href="https://linkedin.com/in/purushotamjeswani"
                            target="_blank"
                            className="text-3xl hover:text-gray-300 transition duration-300"
                            aria-label="LinkedIn"
                        >
                            <i className="ph-duotone ph-linkedin-logo text-3xl"></i>
                        </Link>
                        <Link
                            href="https://twitter.com/purushotam___j"
                            target="_blank"
                            className="text-3xl hover:text-gray-300 transition duration-300"
                            aria-label="Twitter"
                        >
                            <i className="ph-duotone ph-x-logo text-3xl"></i>
                        </Link>
                    </div>
                    <div className="w-32 h-10 -ml-1">
                        <ThemeSelect />
                    </div>
                    <div className="text-center text-lg md:text-2xl">
                        <p>&copy; {new Date().getFullYear()} Purushotam Jeswani. All rights reserved.</p>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-start space-y-6">
                    <h3 className="text-3xl md:text-4xl font-bold master-font">Quick Links</h3>
                    <div className="flex flex-col gap-2 md:gap-3 pl-2">
                        {[{ name: "Me", icon: "student-2.gif" }, { name: "About", icon: "search-book-2.gif" }, { name: "Skills", icon: "software-2.gif" }, { name: "Projects", icon: "startup-2.gif" }, { name: "Resume", icon: "resume.gif" }, { name: "Contact", icon: "agenda.gif" }].map((item) => (
                            <>
                                <Link
                                    key={item.name}
                                    href={`/${item.name.toLowerCase() === "resume" || item.name.toLowerCase() === "contact" ? "" : "#"}${item.name.toLowerCase()}`}
                                    className="flex items-center gap-2 relative hover:text-red-200 group text-lg md:text-2xl"
                                >
                                <img src={`/icons/${item.icon}`} className="bg-neutral-100 rounded-md shadow-sm" width={40} height={20} />
                                    {item.name}
                                    <span className="absolute left-0 bottom-[-3px] w-0 h-[2px] bg-current transition-all duration-300 group-hover:w-full group-hover:bottom-[-5px]"></span>
                                </Link>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
