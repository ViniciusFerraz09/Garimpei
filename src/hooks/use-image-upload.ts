import { useCallback, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

/** Bucket público de imagens, com upload liberado apenas para administradores. */
export const PRODUCT_IMAGES_BUCKET = "images";
const PRODUCT_IMAGES_PREFIX = "products";

export const IMAGE_UPLOAD_MAX_MB = 10;

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const extensionFromFile = (file: File): string => {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return extension === "jpeg" ? "jpg" : extension;
};

export const validateImageFile = (file: File): string | null => {
  if (file.size > IMAGE_UPLOAD_MAX_MB * 1024 * 1024) {
    return `A imagem é grande demais. O limite é ${IMAGE_UPLOAD_MAX_MB} MB.`;
  }

  const extension = extensionFromFile(file);
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return "Formato não aceito. Use JPG, PNG, WEBP ou GIF.";
  }

  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    return "Formato não aceito. Use JPG, PNG, WEBP ou GIF.";
  }

  return null;
};

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File): Promise<string | null> => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return null;
    }

    setIsUploading(true);
    setError(null);

    try {
      const path = `${PRODUCT_IMAGES_PREFIX}/${crypto.randomUUID()}.${extensionFromFile(file)}`;

      const { error: uploadError } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .upload(path, file, {
          contentType: file.type || "image/jpeg",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .getPublicUrl(path);

      if (!data.publicUrl) throw new Error("URL pública indisponível");

      return data.publicUrl;
    } catch (uploadFailure) {
      const message =
        uploadFailure instanceof Error
          ? uploadFailure.message
          : "Não foi possível enviar a imagem.";
      setError(
        message.toLowerCase().includes("row-level security")
          ? "Seu acesso não permite enviar imagens. Entre novamente como administrador."
          : "Não foi possível enviar a imagem. Verifique o arquivo e tente novamente.",
      );
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const reset = useCallback(() => setError(null), []);

  return { upload, isUploading, error, reset };
};
