
import type { Tables } from '@/types/database.types';

const tableName = 'users';

const { insert, get, remove, update } = useCrud(tableName);

export const useUsers = () => {
  const user = ref<Tables<'users'>|null>(null);

  return {
    user,
    insert,
    get,
    remove,
    update,
  }
}