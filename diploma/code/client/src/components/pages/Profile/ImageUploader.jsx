import React from 'react';
import { default as ImageUploaderLib } from 'react-images-upload';

export const ImageUploader = ({ onDrop }) => (
    <ImageUploaderLib
      withIcon
      buttonText='Загрузите картинку профиля'
      onChange={onDrop}
      imgExtension={['.jpg', '.gif', '.png', '.gif', '.jpeg', '.jfif']}
      maxFileSize={5242880}
      singleImage
    />
  );

