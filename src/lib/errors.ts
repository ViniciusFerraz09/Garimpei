/** Traduz erros do backend em mensagens claras para quem usa o painel. */

interface PostgrestLikeError {
  code?: string;
  message?: string;
  details?: string | null;
}

const CONSTRAINT_MESSAGES: Record<string, string> = {
  products_slug_key: "Já existe um produto com esse endereço. Escolha outro nome ou link.",
  products_category_check: "Categoria inválida. Selecione uma das opções disponíveis.",
  products_store_check: "Loja inválida. Selecione uma das opções disponíveis.",
  products_store_name_check: "Informe o nome da loja quando escolher \"Outras lojas\".",
  products_price_check: "O preço não pode ser negativo.",
  products_original_price_check: "O preço original não pode ser negativo.",
  products_price_relation_check: "O preço original precisa ser maior ou igual ao preço atual.",
};

export const friendlyError = (
  error: unknown,
  fallback = "Não foi possível concluir a operação. Tente novamente.",
): string => {
  if (!error) return fallback;

  const { code, message, details } = (error ?? {}) as PostgrestLikeError;
  const haystack = `${message ?? ""} ${details ?? ""}`;

  if (code === "23505") {
    const constraint = Object.keys(CONSTRAINT_MESSAGES).find((key) =>
      haystack.includes(key),
    );
    if (constraint) return CONSTRAINT_MESSAGES[constraint];
    return "Esse registro já existe. Confira os dados informados.";
  }

  if (code === "23503") {
    return "Este registro depende de outro dado que não foi encontrado.";
  }

  if (code === "23514") {
    const constraint = Object.keys(CONSTRAINT_MESSAGES).find((key) =>
      haystack.includes(key),
    );
    if (constraint) return CONSTRAINT_MESSAGES[constraint];
    return "Os dados informados não atendem às regras do catálogo. Revise os campos.";
  }

  if (code === "42501" || code === "42P01") {
    return "Seu acesso não permite essa operação. Entre novamente com a conta de administrador.";
  }

  if (haystack.toLowerCase().includes("row-level security")) {
    return "Seu acesso não permite essa operação. Entre novamente com a conta de administrador.";
  }

  if (haystack.toLowerCase().includes("failed to fetch")) {
    return "Sem conexão com o servidor. Verifique sua internet e tente novamente.";
  }

  return fallback;
};

/**
 * Lê a mensagem devolvida por uma função de backend quando a chamada falha.
 * O corpo só está disponível na resposta original do erro.
 */
export const readFunctionErrorMessage = async (
  error: unknown,
): Promise<string | null> => {
  const response = (error as { context?: Response } | null)?.context;
  if (!response || typeof response.json !== "function") return null;

  try {
    const payload = (await response.json()) as { message?: string };
    return typeof payload?.message === "string" ? payload.message : null;
  } catch {
    return null;
  }
};

