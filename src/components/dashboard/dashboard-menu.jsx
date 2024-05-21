import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {LayoutDashboard, MessageCircleQuestion, Settings, Bell, ChevronRight, UserRoundCheck, Activity, Users} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import logo from "../../assets/logo.jpeg";

const dashboardLinks = [
    {
        label: "Tableau de bord",
        icon: <LayoutDashboard size={20}/>,
        to: "/dashboard"
    },
    {
        label: "Quizz",
        icon: <MessageCircleQuestion size={20}/>,
        to: "/dashboard/quizz"
    },
    {
        label: "Gestionnaires",
        icon: <UserRoundCheck size={20}/>,
        to: "/dashboard/managers"
    },
    {
        label: "Paramètres",
        icon: <Settings size={20}/>,
        to: "/dashboard/settings"
    },
    // {
    //     label: "Notifications",
    //     icon: <Bell size={20}/>,
    //     to: "/dashboard/notifications"
    // }
    {
        label: "Utilisateurs",
        icon: <Users size={20}/>,
        to: "/dashboard/learners"
    },    

]

export const DashboardMenu = () => {
    const location = useLocation();
    const {pathname} = location;

    const { currentUser, token } = useContext(AuthContext);

    const filteredLinksForMember = dashboardLinks.filter(
        link => currentUser.role !== "member" || link.to !== "/dashboard/managers"
    );

    const filteredLinksForSMember = dashboardLinks.filter(
        link => link.to === "/dashboard" || link.to === "/dashboard/settings"
    );

    const filteredLinks = currentUser.role === "member" ? filteredLinksForMember : currentUser.role === "s_member" ? filteredLinksForSMember : dashboardLinks;
    
    return (
        <aside className="hidden sm:block fixed top-0 left-0 h-screen w-[100px] md:w-[200px] z-30 bg-primary text-white border-r border-neutral-200 dark:border-neutral-800 ">   
            <div className=" flex justify-between flex-col h-screen">
                <div className="px-0 py-0">
                    <div className=" border-b border-foreground/20 flex items-center justify-center h-[54px]">
                        <h1 className="text-3xl font-extrabold tracking-wide m-0 p-0">
                            <img src={logo} style={{ width:"100%", }} alt="" />
                        </h1>
                    </div>
                    <div className="flex flex-col gap-2 items-center text-sm mt-8">
                        {filteredLinks.map((link, index) => (
                            <Link 
                                to={link.to} 
                                key={index}
                                className={`flex flex-col items-center gap-1 w-full rounded-md py-3 px-2 ${
                                    pathname === link.to ? "bg-white/15" : " bg-none"
                                }`}d
                                >
                                    {link.icon}
                                    <p className="hidden md:block">{link.label}</p>
                            </Link>
                        ))}
                        <div className="flex justify-start my-3">
                            <Button size="icon" className="rounded-full bg-primary/40">
                                <ChevronRight/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
        
    )
}