import React from 'react';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import UpdateProfil from '@/components/dashboard/update-profil';
import UpdateAccount from '@/components/dashboard/update-account';
import UpdatePreferences from '@/components/dashboard/update-preferences';

export default function SettingsPage() {
    return (
        <section className="space-y-2">
            <Breadcrumb className="my-3">
                <BreadcrumbList>
                    <BreadcrumbItem href="/dashboard">Tableau de bord</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-primary">Paramètres</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className='text-2xl md:text-3xl font-bold'>Paramètres</h1>
            <p className='text-foreground/60'>Modifier vos informations personelles</p>
            <div>
                <Tabs defaultValue="profil" className="max-w-[600px]">
                    <TabsList>
                        <TabsTrigger value="profil">Profil</TabsTrigger>
                        <TabsTrigger value="account">Compte</TabsTrigger>
                        <TabsTrigger value="preferences">Préférences</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profil" className="space-y-3 py-3 pb-10">
                        <h1 className='text-lg md:text-xl font-medium'>Profil</h1>
                        <p className='text-foreground/60'>Personnalisez votre profil.</p>
                        <UpdateProfil />
                    </TabsContent>
                    <TabsContent value="account">
                        <h1 className='text-lg md:text-xl font-medium'>Compte</h1>
                        <p className='text-foreground/60'>Modifier vos informations personnelles.</p>
                        <UpdateAccount />
                    </TabsContent>
                    <TabsContent value="preferences">
                        <h1 className='text-lg md:text-xl font-medium'>Préférences</h1>
                        <p className='text-foreground/60'>Personnalisez votre expérience utilisateur.</p>
                        <UpdatePreferences />
                    </TabsContent>
                </Tabs>

            </div>

        </section>
    )
}
