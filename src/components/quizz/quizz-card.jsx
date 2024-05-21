import {
    Card,
} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import PropsTypes from "prop-types";
import {Link, useNavigate} from "react-router-dom";

QuizzCard.propTypes = {
    title: PropsTypes.string.isRequired,
    image: PropsTypes.string.isRequired,
    description: PropsTypes.string.isRequired,
    questionsNumber: PropsTypes.number.isRequired,
    quota: PropsTypes.number,
    message: PropsTypes.string,
    status: PropsTypes.string.isRequired,
    id: PropsTypes.string.isRequired
}

export default function QuizzCard({title, image, description, questionsNumber, quota, status="notStarted", id}) {
    let message = "";
    if(status === "notStarted"){
        message = "Démarrer le quizz";
    }
    if(status === "started"){
        message = "Continuer le quizz";
    }
    if(status === "finished"){
        message = "Voir le résultat";
    }

    const navigate = useNavigate();
    
    return (
        <Card className="quizz-card relative">
                {parseInt(questionsNumber) > 0 ?
                <Link to={`/quizz/${id}`} className="">
                    <img src={image} alt={"Quizz image"} style={{ height:"220px", width:"100%", objectFit:"cover" }} className="w-full rounded-md hover:opacity-90 sm:w-full" />
                </Link> : <a className="">
                    <img src={image} alt={"Quizz image"} style={{ height:"220px", width:"100%", objectFit:"cover" }} className="w-full rounded-md hover:opacity-90 sm:w-full" />
                </a> }
                <div className="space-y-4 text-sm p-5">
                    <div className="space-y-3 max-w-xl md:max-w-2xl">
                        {parseInt(questionsNumber) > 0 ?
                        <Link to={`/quizz/${id}`} className="hover:text-primary font-bold">
                            <h1 className="text-2xl">{title}</h1>
                        </Link> : <a className="hover:text-primary font-bold">
                            <h1 className="text-2xl">{title}</h1>
                        </a> }                        
                        <p className="text-sm font-medium line-clamp-2">{description}</p>
                    </div>
                    <div>
                        {status === "finished" && <p className="text-primary font-bold">Terminé</p>}
                        {status === "started" && <p className="text-primary font-bold">En cours</p>}
                    </div>
                    <p className="font-medium">Nombre de questions : <span
                        className="text-primary font-bold">{questionsNumber}</span></p>
                     {quota != "" ? <p>⭐ Note requise : {quota} points</p> :  null}
                    <div className="flex">
                        <Button variant="default" onClick={()=>{ parseInt(questionsNumber) > 0 ? navigate(`/quizz/${id}`) : null }}>{message}</Button>
                    </div>
                </div>
        </Card>
    )
}