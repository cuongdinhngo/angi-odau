import { TAGS } from '@/storages/tags';

export interface Tag {
  value: string;
  label: string;
  icon?: string;
}

export const useTags = () => {
  const tags = ref<Tag[]>([]);

  const loadTags = () => {
    tags.value = [...TAGS];
  };

  loadTags();

  const getTagByValue = (value: string): Tag | undefined => {
    return tags.value.find(tag => tag.value === value);
  };

  return {
    tags,
    getTagByValue,
  };
}