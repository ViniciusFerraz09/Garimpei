import { useCallback, useState } from "react";
import { toast } from "sonner";

interface SharePayload {
  title: string;
  text?: string;
  url: string;
}

/**
 * Compartilhamento: usa a Web Share API quando o navegador oferece suporte e,
 * quando não, copia o link com feedback visível.
 */
export const useShare = () => {
  const [isSharing, setIsSharing] = useState(false);

  const share = useCallback(async ({ title, text, url }: SharePayload) => {
    setIsSharing(true);

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title, text, url });
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success("Link copiado para a área de transferência.");
        return;
      }

      toast.error("Seu navegador não permite compartilhar automaticamente. Copie o endereço da página.");
    } catch (error) {
      // Cancelar o compartilhamento nativo não é erro.
      if (error instanceof DOMException && error.name === "AbortError") return;

      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copiado para a área de transferência.");
      } catch {
        toast.error("Não foi possível compartilhar agora. Tente novamente.");
      }
    } finally {
      setIsSharing(false);
    }
  }, []);

  return { share, isSharing };
};
