export default function RenderHyperlinks({ text }) {
    const hyperlinkRegex = /\[(.*?)\]\((https?:\/\/[^\s]+)\)/g;
    const parts = text.split(hyperlinkRegex);

    return parts.map((part, index) => {
        if (index % 3 === 0) {
            return part;
        } else if (index % 3 === 1) {
            const linkText = part;
            const url = parts[index + 1];
            return (
                <a key={index} target={"_blank"} href={url} style={{ color: 'blue' }} rel="noreferrer">
                    {linkText}
                </a>
            );
        }
        return null;
    })
}