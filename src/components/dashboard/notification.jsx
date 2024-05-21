import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Bell } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { ScrollArea } from "../ui/scroll-area"
import NotificationItem from "./notification-item"

const notificationExample = [
    {
        status: true,
        title: "Nouveau message",
        message: "Vous avez reçu un nouveau message de votre ami",
    },
    {
        status: false,
        title: "Nouvelle notification",
        message: "Vous avez reçu une notification de votre ami",
    },
    {
        status: true,
        title: "Nouveau message",
        message: "Vous avez reçu un nouveau message de votre ami",
    },
    {
        status: false,
        title: "Nouvelle notification",
        message: "Vous avez reçu une notification de votre ami",
    },
    
]

export function Notifications() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
            <Bell size={18}/>
            <span className="absolute bg-primary text-xs px-1 rounded-md -top-1 -right-0.5 text-white">{notificationExample.length}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent asChild>
          <Card className="space-y-2 mr-2">
            <CardHeader className="border-b py-1 ">
                <CardTitle className="font-medium leading-none text-lg">Notifications</CardTitle>
            </CardHeader>
            <ScrollArea>
                {notificationExample.map((notification, index) => (
                    <NotificationItem key={index} {...notification}/>
                ))}
              </ScrollArea>
          </Card>
      </PopoverContent>
    </Popover>
  )
}

