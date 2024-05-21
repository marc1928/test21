import React from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '../ui/switch';
import { useTheme } from '@/hooks/use-theme';

export default function UpdatePreferences() {
    const {theme, setTheme} = useTheme();
    return (
        <>
            <div className='space-y-3 mt-3'>
                <div className="flex gap-2 items-center">
                    <Label htmlFor="name">Thème : </Label>
                    <div className="px-3 sm:flex items-center gap-2 hidden">
                        <Switch
                            checked={theme === "dark"}
                            onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                        />
                        <div className="relative flex items-center">
                            <Sun className="scale-100 dark:scale-0 rotate-0 dark:rotate-45 transition-transform" size={20} />
                            <Moon className="scale-0 dark:scale-100 rotate-45 dark:rotate-0 transition-transform absolute" size={20} />
                        </div>
                        <p className='block dark:hidden'>Mode clair</p>
                        <p className='hidden dark:block'>Mode sombre</p>
                    </div>
                </div>
            </div>
        </>
    )
}
