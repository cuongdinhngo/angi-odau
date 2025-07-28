
import type { Tables } from '@/types/database.types';

const tableName = 'users';

const { insert, get, remove, update } = useCrud(tableName);

export const useUsers = () => {
  const user = ref<Tables<'users'>|null>(null);

  const storeUserIntoLocalStorage = (userData: Tables<'users'>) => {
    user.value = userData;
    localStorage.setItem('user', JSON.stringify(userData));
  }

  const removeUserFromLocalStorage = () => {
    user.value = null;
    localStorage.removeItem('user');
  }

  const loadUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    } else {
      user.value = null;
    }
  }

  return {
    user,
    insert,
    get,
    remove,
    update,
    storeUserIntoLocalStorage,
    removeUserFromLocalStorage,
    loadUserFromLocalStorage
  }
}