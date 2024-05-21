import {QRCodeComponent} from "@/components/quizz/QR-code.jsx";
import {Button} from "@/components/ui/button.jsx";
import {toast} from "sonner";
import {useParams} from "react-router-dom";


export default function QuizzShare(){
    const {quizzId} = useParams();
    return(
        <>
            <div className="h-screen flex items-center justify-center">
                <div className="space-y-5">
                    <h1 className="text-3xl font-bold text-center">Scanner le code QR</h1>
                    <p className="text-center max-w-xl">Partagez ce lien avec vos amis ou collaborateurs pour qu'ils puissent participer à votre quizz</p>
                    <div className="flex justify-center mt-5">
                        <QRCodeComponent value={`https://quizz-app.com/quizz/${quizzId}`}/>
                    </div>
                    <div className="flex justify-center items-center mt-5 gap-3">
                        <div className="bg-primary/30 px-3 py-2 rounded-md text-sm">
                            <a href={`https://quizz-app.com/quizz/${quizzId}`} className="hover:underline text-center break-words">https://quizz-app.com/quizz/{quizzId}</a>
                        </div>
                    </div>
                    <div className="flex justify-center mt-5">
                        <Button
                            variant="default"
                            onClick={()=>{
                                navigator.clipboard.writeText(`https://quizz-app.com/quizz/${quizzId}`)
                                toast.success("Lien copié dans le presse-papier");
                            }}>Copier le lien</Button>
                    </div>
                </div>
            </div>
        </>
    )
}