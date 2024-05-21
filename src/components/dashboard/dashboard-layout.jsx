import {Link, Outlet, useLocation} from "react-router-dom";
import { DashboardMenu } from "./dashboard-menu";
import { Button } from "@/components/ui/button";
import {
    Search,
    AlignJustify,
    Sun,
    Moon,
    LayoutDashboard,
    MessageCircleQuestion,
    UserRoundCheck,
    Settings, Bell, ChevronRight, User
} from "lucide-react"
import { Input } from "@/components/ui/input";
import { Notifications } from "./notification";
import UserAvatar from "./user-avatar";
import AddItem from "./add-item";
import { useTheme } from "@/hooks/use-theme";
import { Switch } from "../ui/switch";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose
} from "@/components/ui/sheet";
import {useEffect, useState} from "react";
import {Separator} from "@/components/ui/separator.jsx";
import Footer from "../footer";


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
    {
        label: "Notifications",
        icon: <Bell size={20}/>,
        to: "/dashboard/notifications"
    },
    {
        label: "Profil",
        icon: <User size={20}/>,
        to: "/dashboard/profile"
    },
]


export function DashboardLayout() {
    const {theme,setTheme} = useTheme();
    const [showSheet, setShowSheet] = useState(false);
    const location = useLocation();
    const {pathname} = location;
    return (
        <>
            <DashboardMenu/>
            <nav className="fixed z-10 bg-background top-0 w-full sm:w-[calc(100%-100px)] md:w-[calc(100%-200px)] right-0 shadow-sm">
                <div className="flex justify-between items-center h-[65px] px-3">
                    <div className="block sm:hidden">
                        <Button size="icon" variant="ghost" onClick={()=>setShowSheet(true)}>
                            <AlignJustify/>
                        </Button>
                    </div>
                    <div className="flex relative gap-0">
                        <Input type="search" placeholder="Rechercher..." className=" sm:w-[200px] md:w-[300px] rounded-r-none rounded-l-md"/>
                        <Button className="rounded-r-md rounded-l-none"><Search size={20}/></Button>
                    </div>
                    <div className="flex gap-2 items-center">
                        
                        <div className="px-3 hidden md:block">
                            <AddItem/>
                        </div>
                        {/* <div className="px-3 ">
                            <Notifications/>
                        </div> */}
                        <span className="text-sm text-foreground/30 hidden md:block">|</span>
                        <div className="px-3 hidden md:block">
                            <UserAvatar/>
                        </div>
                    </div>
                </div>
            </nav>

            <Sheet open={showSheet} onOpenChange={setShowSheet}>
                <SheetContent side="left">
                    <SheetHeader className="flex-row justify-between py-3">
                        <SheetTitle className="xs:text-2xl sm:text-3xl">BPCE</SheetTitle>
                        {/* <div className="px-3 flex items-center gap-2">
                            <div className="relative flex items-center">
                                <Sun className="scale-100 dark:scale-0 rotate-0 dark:rotate-45 transition-transform"
                                     size={20}/>
                                <Moon
                                    className="scale-0 dark:scale-100 rotate-45 dark:rotate-0 transition-transform absolute"
                                    size={20}/>
                            </div>
                            <Switch
                                checked={theme === "dark"}
                                onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                            />
                        </div> */}
                    </SheetHeader>
                    <Separator/>
                    <div className="space-y-4 text-sm text-foreground mt-8">
                        {dashboardLinks.map((link, index) => (
                            <SheetClose asChild key={index}>
                                <Link
                                    to={link.to}
                                    className={`flex items-center gap-2 px-2 py-2 hover:bg-foreground/10 rounded-md ${
                                        pathname === link.to ? "text-primary" : "text-neutral-950 dark:text-white"
                                    }`}
                                >
                                    {link.icon}
                                    <p>{link.label}</p>
                                </Link>
                            </SheetClose>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>


            <div className="xs:ml-[20px] sm:ml-[110px] md:ml-[220px] mt-[80px] xs:mr-[20px] ml-4 mr-4">
                <Outlet/>
            </div>
        </>
    )
}
