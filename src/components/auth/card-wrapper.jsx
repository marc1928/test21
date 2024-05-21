import {Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter} from "../ui/card";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import logo from "../../assets/logo.jpeg";

export default function CardWrapper(props){
    const {children, headerLabel, backbuttonHref, backbuttonLabel, headerMessage} = props;
    return(
        <Card className="w-[500px]">
            <CardHeader className="text-center items-center">
                    <img src={logo} alt="LOGO BCPE" width={300} /><br />
                    <CardTitle className="">{headerLabel}</CardTitle>
                    <CardDescription className="text-sm">{headerMessage}</CardDescription>
                </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-">
                    {children}
                </div>
            </CardContent>
            <CardFooter>
                <Link to={backbuttonHref} className="text-sm hover:underline flex text-center">{backbuttonLabel}</Link>
            </CardFooter>
        </Card>
    )
}

CardWrapper.propTypes = {
    children: PropTypes.node,
    headerLabel: PropTypes.string,
    backbuttonHref: PropTypes.string,
    backbuttonLabel: PropTypes.string, // Added missing prop validation
    headerMessage: PropTypes.string
};
