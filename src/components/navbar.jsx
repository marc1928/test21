import {Button} from "@/components/ui/button.jsx";
import {AlignJustify, Moon, Search, Sun} from "lucide-react";
import {Switch} from "@/components/ui/switch.jsx";
import AddItem from "@/components/dashboard/add-item.jsx";
import {Notifications} from "@/components/dashboard/notification.jsx";
import UserAvatar from "@/components/dashboard/user-avatar.jsx";
import {useTheme} from "@/hooks/use-theme.js";
import {useState} from "react";
import {Link} from "react-router-dom";
import logo from "../assets/logo.jpeg";

export default function Navbar(){
    const {theme, setTheme} = useTheme();
    const [showSheet, setShowSheet] = useState(false);
    return(
        <>
            <nav
                className="fixed z-10 bg-background top-0 w-full right-0 shadow-sm dark:border-b dark:border-foreground/10">
                <div className="flex justify-between items-center h-[65px] px-3">
                    <div className="block sm:hidden">
                        <Button size="icon" variant="ghost" onClick={() => setShowSheet(true)}>
                            <AlignJustify/>
                        </Button>
                    </div>
                    <div className="">
                        <h1 className="text-xl sm:text-2xl">
                            <img src={logo} style={{ width : "100%", height:"57px" }} alt="" />
                            {/* BPCE */}
                        </h1>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="px-3 sm:flex items-center gap-2 hidden">
                            {/* <div className="relative flex items-center">
                                <Sun className="scale-100 dark:scale-0 rotate-0 dark:rotate-45 transition-transform"
                                     size={20}/>
                                <Moon
                                    className="scale-0 dark:scale-100 rotate-45 dark:rotate-0 transition-transform absolute"
                                    size={20}/>
                            </div>
                            <Switch
                                checked={theme === "dark"}
                                onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                            /> */}
                        </div>
                        <div className="hidden items-center gap-2 text-sm">
                            <Link to={"/signin"} className="text-primary">Se connecter</Link>
                            <span className="text-foreground/30">|</span>
                            <Link to={"/signup"}>S{"'"}inscrire</Link>
                        </div>
                        <div className="flex items-center">
                            <div className="px-3">
                                <AddItem/>
                            </div>
                            {/* <div className="px-3">
                                <Notifications/>
                            </div> */}
                            <span className="text-sm text-foreground/30">|</span>
                            <div className="px-3 ">
                                <UserAvatar/>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}