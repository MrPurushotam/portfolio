
const RenderedContent = ({ html }, props) => {
    return (
        <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
            {...props}
        />
    )
}

export default RenderedContent;