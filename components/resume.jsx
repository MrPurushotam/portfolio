import data from "../data/staticData.json"
const ResumeIntegration = () => {
    const {resumeDocId} = data;
    let resumeLink = `https://drive.google.com/file/d/${resumeDocId}/preview`;
    
  return (
    <div className='w-full h-svh '>
        <iframe src={resumeLink} className='w-1/2 h-svh mx-auto rounded-sm aspect-[3/2]' allowFullScreen title="Portfolio Preview"></iframe>
    </div>
  )
}

export default ResumeIntegration
