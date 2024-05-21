import React from 'react'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';

export default function EditManagersPage() {
    const {quizzName} = useParams();
    return (
        <main className='max-w-3xl'>
            <form className="space-y-3">
                <h1 className="text-xl font-bold">Modifier un gestionnaire</h1>
                <p className='text-sm font-medium'>
                    Vous etes sur le point de modifier un manager, cependant vous ne pouvez pas modifier des informations personnelles.
                </p>
                <div className="space-y-3">
                    <Label htmlFor="title">Titre du quizz <sup className="text-primary">*</sup> : </Label>
                    <Input type="text" value={quizzName} id="title" placeholder="Donnez un titre à votre quizz" required />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="description">Description (facultatif) : </Label>
                    <Textarea id="description" value={quizzName} placeholder="Décrivez votre quizz en quelques mots" />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="difficulty">Difficulté (facultatif) : </Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Niveau de difficulté :" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Facile">Facile</SelectItem>
                            <SelectItem value="Moyen">Moyen</SelectItem>
                            <SelectItem value="Difficile">Difficile</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="my-4 flex gap-3 items-center">
                    <Button type="submit" className="w-full sm:w-fit">Modifier le quizz</Button>
                    <Button variant="secondary" type="submit" className="w-full sm:w-fit">Annuler</Button>
                </div>
            </form>
        </main>
    )
}
