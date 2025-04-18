
type FileListProps = {
    files : Array<string>
}

export const FileListDisplay = (props : FileListProps) => {
    return(
        <div>
            <h1 className="text-3xl font-bold underline">
                Hello world!
            </h1>
            {
                props.files.map((file, index) => {
                    return <h3>{file}</h3>
                })
            }
        </div>
    )
}