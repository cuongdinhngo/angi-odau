export const usePhotos = () => {
  const bucketName = 'places';
  const bucketModel = useSupabaseClient().storage.from(bucketName);

  const uploadPhoto = async(photo: File, directory = 'public') => {
    let publicUrl = null;
    if (photo) {
      const photoExt = photo.name.split('.').pop();
      const photoName = `${generateUUID()}.${photoExt}`;
      const photoPath = `${directory}/${photoName}`;

      await bucketModel.upload(photoPath, photo)
        .then(({ error }) => {
          if (error) throw error;

          publicUrl = generatePublicUrl(photoPath);
        })
        .catch((err) => {
          console.error('Error uploading photo:', err);
        });
    }

    return publicUrl;
  }

  const generatePublicUrl = (photoPath: string) => {
    const { data } = bucketModel.getPublicUrl(photoPath);

    return data.publicUrl;
  }

  const deletePhoto = async(photoPath: string) => {
    await bucketModel.remove([splitPath(photoPath)])
      .then(({ error }) => {
        if (error) throw error;
        return true;
      })
      .catch((err) => {
        console.error('Error deleting photo:', err);
        return false;
      });
  }

  const splitPath = (fullPath: string) => {
    return fullPath.split(bucketName)[1];
  }

  return {
    uploadPhoto,
    deletePhoto
  }
}