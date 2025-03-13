'use server';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export type CreateGroupState = {
  success: null | boolean;
  message?: string;
};

type Participant = {
  id: string;
  group_id: string;
  name: string;
  email: string;
  assigned_to: string | null;
  created_at: string;
};
function drawGroup(participants: Participant[]) {
  const selectedParticipants: string[] = [];

  return participants.map((participant) => {
    const availableParticipants = participants.filter((p) => p.id !== participant.id && !selectedParticipants.includes(p.id));
    const assignedParticipant = availableParticipants[Math.floor(Math.random() * availableParticipants.length)];
    selectedParticipants.push(assignedParticipant.id);
    return { ...participant, assigned_to: assignedParticipant.id };
  });
}
export async function createGroup(_previousState: CreateGroupState, formData: FormData) {
  const supabase = await createClient();
  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (authError) {
    return {
      success: false,
      message: 'Ocorreu um erro ao criar o grupo!',
    };
  }

  const names = formData.getAll('name');
  const emails = formData.getAll('email');
  const groupName = formData.get('group-name');

  const { data: newGroup, error } = await supabase
    .from('groups')
    .insert({
      name: groupName,
      owner_id: authUser?.user.id,
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: 'Ocorreu um erro ao criar o grupo! Por favor tente novamente.',
    };
  }

  const participants = names.map((name, index) => ({
    group_id: newGroup.id,
    name,
    email: emails[index],
  }));

  const { data: createdParticipants, error: errorParticipants } = await supabase.from('participants').insert(participants).select();

  if (errorParticipants) {
    return {
      success: false,
      message: 'Ocorreu um erro ao adicionar os participantes ao grupo! Por favor tente novamente.',
    };
  }

  const drawParticipants = drawGroup(createdParticipants);
  const { error: errorDraw } = await supabase.from('participants').upsert(drawParticipants);

  if (errorDraw) {
    return {
      success: false,
      message: 'Ocorreu um erro ao sorter os participantes do grupo! Por favor tente novamente.',
    };
  }
  // redirect(`app/grupos/${newGroup.id}`);
}

