import blobUrl from "../../assets/login-blob.svg";

export function LoginBlob(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return <img src={blobUrl} alt="" {...props} />;
}
