export const useCrud = (tableName: string) => {
  const insert = (data: any) => {
    return useSupabaseClient().from(tableName).insert(data);
  }

  const update = (id: string | number, data: any) => {
    return useSupabaseClient().from(tableName).update(data).eq('id', id);
  }

  const remove = (id: string | number) => {
    return useSupabaseClient().from(tableName).delete().eq('id', id);
  }

  const get = (id: string | number) => {
    return useSupabaseClient().from(tableName).select('*').eq('id', id).single();
  }

  const upsert = (data: any) => {
    return useSupabaseClient().from(tableName).upsert(data);
  }

  return {
    insert,
    update,
    remove,
    get,
    upsert,
  }
}