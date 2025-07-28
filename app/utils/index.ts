export function iconPath(icon: string): string {
  return `icons/${icon}`;
}

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