import ContactPage from "@/components/ContactPage"

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with Purushotam Jeswani, a full-stack web developer specializing in React, Next.js, Node.js, Docker, AWS, MongoDB, and PostgreSQL. Available for projects in India and the USA.',
  openGraph: {
    title: 'Contact Purushotam Jeswani - Full-Stack Developer',
    description: 'Reach out to Purushotam Jeswani for full-stack development expertise in React, Node.js, AWS, and more. Let’s build something amazing together!',
    images: ['/favicon-96x96.png'],
    type: 'website'
  }
};
const page = async () => {
  return (
    <ContactPage />
  )
}

export default page