import PropsTypes from "prop-types";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label.jsx";

QuestionItem.propTypes = {
    title: PropsTypes.string.isRequired,
    description: PropsTypes.string.isRequired,
    status: PropsTypes.string,
    id: PropsTypes.string,
    number: PropsTypes.number.isRequired,
    responses: PropsTypes.array
}

export default function QuestionItem({title, description, number, responses}) {
    let message = "";
    return (
        <div className="space-y-4 border-b border-foreground/20 pb-8">
            <div className="flex items-center gap-2">
                <h1 className="text-lg font-medium">{number} - {title}</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="px-3 cursor-pointer py-1 rounded-md bg-foreground/20">i</span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{description}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div>
                <RadioGroup className="space-y-3">
                {responses.map((response, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem id={response.value} value={response.value}/>
                        <Label htmlFor={response.value}>{response.label}</Label>
                    </div>
                ))}
                </RadioGroup>
            </div>
        </div>
    )
}