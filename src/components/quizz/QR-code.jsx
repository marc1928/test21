import QRCode from "react-qr-code";

// eslint-disable-next-line react/prop-types
export const QRCodeComponent = ({value}) => {
    return (
        <QRCode value={value} size={256}/>
    )
}