import NewGroupForm from '@/components/new-group-form';
import { createClient } from '@/utils/supabase/server';

const NewGroupPage = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const loggedUser = {
    id: data?.user?.id as string,
    email: data?.user?.email as string,
  };

  return (
    <div className="mt-40">
      <NewGroupForm loggedUser={loggedUser} />
    </div>
  );
};

export default NewGroupPage;
