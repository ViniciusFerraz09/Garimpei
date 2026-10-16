/** Regras de navegação para os links externos de afiliado. */

export const EXTERNAL_LINK_REL = "noopener noreferrer nofollow sponsored";
export const EXTERNAL_LINK_TARGET = "_blank";

/**
 * Só aceitamos http/https. Links malformados ou com outros protocolos
 * (inclusive javascript:) são tratados como ausentes — nunca substituímos por
 * uma página inicial de loja.
 */
export const isSafeExternalUrl = (value?: string | null): boolean => {
  const candidate = value?.trim();
  if (!candidate) return false;

  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const hasOffer = (affiliateUrl?: string | null): boolean =>
  isSafeExternalUrl(affiliateUrl);
