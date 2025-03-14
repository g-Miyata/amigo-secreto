'use client';

import { useActionState, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader, Mail, Trash2, UsersRound } from 'lucide-react';
import { Separator } from './ui/separator';
import { createGroup, CreateGroupState } from '@/app/app/grupos/novo/action';
import { toast } from 'sonner';

interface Participant {
  name: string;
  email: string;
}

const NewGroupForm = ({ loggedUser }: { loggedUser: { email: string; id: string } }) => {
  const [participants, setParticipants] = useState<Participant[]>([{ name: '', email: loggedUser.email }]);
  const [groupName, setGroupName] = useState('');
  const [state, formAction, pending] = useActionState<CreateGroupState, FormData>(createGroup, {
    success: null,
    message: '',
  });

  useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  function updateParticipant(index: number, field: keyof Participant, value: string) {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  }

  function removeParticipant(index: number) {
    setParticipants(participants.filter((_, id) => id !== index));
  }

  function addParticipant() {
    setParticipants(participants.concat({ name: '', email: '' }));
  }
  return (
    <main className="p-4 min-w-100">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Novo Grupo</CardTitle>
          <CardDescription>Convide seus amigos para participar</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Nome do Grupo</Label>
              <Input id="group-name" name="group-name" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Digite o nome do grupo" required />
            </div>
            <h2 className="mt-8 md:mt-12 text-center md:text-left">Participantes</h2>
            {participants.map((participant, index) => (
              <div key={index} className="flex flex-col gap-2 md:flex-row md:gap-2  items-end space-y-4 md:space-y-0 ">
                <div className="md:flex-grow space-y-2 w-full">
                  <Label htmlFor={`name-${index}`}>Nome</Label>
                  <Input
                    id={`name-${index}`}
                    name="name"
                    value={participant.name}
                    onChange={(e) => {
                      updateParticipant(index, 'name', e.target.value);
                    }}
                    placeholder="Digite o nome da pessoa"
                    required
                  />
                </div>

                <div className="md:flex-grow space-y-2 w-full">
                  <Label htmlFor={`email-${index}`}>Email</Label>
                  <Input
                    id={`email-${index}`}
                    name="email"
                    value={participant.email}
                    onChange={(e) => {
                      updateParticipant(index, 'email', e.target.value);
                    }}
                    placeholder="Digite o email da pessoa"
                    className="readonly:text-muted-foreground"
                    readOnly={participant.email === loggedUser.email}
                    required
                  />
                </div>

                <div className="min-w-9">
                  {participants.length > 1 && participant.email !== loggedUser.email ? (
                    <Button className="hidden md:block" type="button" variant="outline" size="icon" onClick={() => removeParticipant(index)}>
                      <Trash2 className="hidden md:block ml-2 md:h-4 md:w-4" />
                    </Button>
                  ) : (
                    <UsersRound className="hidden md:block md:ml-1 md:mb-2" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
          <Separator className="my-4 " />
          <CardFooter className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
            <Button type="button" variant="outline" onClick={addParticipant} className="w-full md:w-auto">
              Adicionar amigo
            </Button>
            <Button type="submit" className="flex items-center space-x-2 w-full md:w-auto">
              <Mail className="w-3 h-3" />
              {pending && <Loader className="animate-spin" />}
              Criar grupo e enviar emails
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
};

export default NewGroupForm;
