export function getPlacePhotoUrl(photo: string): string {
  return `https://foodtourdanang.vn/${photo}`;
}

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const getAssetsPath = (path: string): string => {
  const config = useRuntimeConfig();
  const basePath = config.app.baseURL || '/';
  return `${basePath}${path}`;
}

export const getImagePath = (imageName: string): string => {
  return getAssetsPath(`images/${imageName}`);
}

export const getFlagPath = (iconName: string): string => {
  return getAssetsPath(`flags/${iconName}`);
}

export const getIconPath = (icon: string): string => {
  return getAssetsPath(`icons/${icon}`);
}