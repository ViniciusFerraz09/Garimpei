import { useId, useRef } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductImage } from "@/components/product/product-image";
import { IMAGE_UPLOAD_MAX_MB, useImageUpload } from "@/hooks/use-image-upload";
import { cn } from "@/lib/utils";

interface ProductImageFieldProps {
  value: string;
  onChange: (url: string) => void;
  category?: string;
  name?: string;
  error?: string;
}

/**
 * Imagem do produto com as duas opções: enviar um arquivo para o Enter Cloud
 * Storage ou colar a URL de uma imagem já publicada.
 */
export const ProductImageField = ({
  value,
  onChange,
  category,
  name = "Produto",
  error,
}: ProductImageFieldProps) => {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, error: uploadError } = useImageUpload();

  const handleFile = async (file?: File) => {
    if (!file) return;
    const publicUrl = await upload(file);
    if (publicUrl) onChange(publicUrl);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <Label htmlFor={inputId}>Imagem do produto</Label>

      <div className="flex flex-col gap-4 sm:flex-row">
        <ProductImage
          src={value || null}
          alt={name}
          category={category}
          className="aspect-square w-full shrink-0 border border-border sm:size-32"
          compact
        />

        <div className="flex-1 space-y-3">
          <Input
            id={inputId}
            type="url"
            inputMode="url"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://exemplo.com/imagem.jpg"
            aria-describedby={`${inputId}-ajuda`}
            aria-invalid={Boolean(error)}
          />
          <p id={`${inputId}-ajuda`} className="text-xs text-muted-foreground">
            Cole o endereço de uma imagem (JPG, PNG, WEBP ou GIF) ou envie um arquivo de até{" "}
            {IMAGE_UPLOAD_MAX_MB} MB.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={(event) => void handleFile(event.target.files?.[0])}
              aria-hidden="true"
              tabIndex={-1}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <Upload aria-hidden="true" />
              )}
              {isUploading ? "Enviando..." : "Enviar do computador"}
            </Button>

            {value && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => onChange("")}
                className="text-muted-foreground"
              >
                <Trash2 aria-hidden="true" />
                Remover imagem
              </Button>
            )}
          </div>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ImagePlus className="size-3.5" aria-hidden="true" />
            Sem imagem o card mostra um marcador no lugar da foto.
          </p>
        </div>
      </div>

      {(error || uploadError) && (
        <p className={cn("text-xs font-semibold text-destructive")} role="alert">
          {uploadError ?? error}
        </p>
      )}
    </div>
  );
};
