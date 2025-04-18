
type FileListProps = {
    files : Array<string>
}

export const FileListDisplay = (props : FileListProps) => {
    return(
        <div>
            {
                props.files.map((file, index) => {
                    return <h3>{file}</h3>
                })
            }
        </div>
    )
}