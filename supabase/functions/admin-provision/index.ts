// Cria a conta do administrador autorizado a partir de um convite.
// Endpoint público (verify_jwt = false) porque quem chama ainda não tem sessão;
// a autorização vem do convite (e-mail + código) validado no servidor.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !email.includes("@")) {
      return json({ ok: false, message: "Informe um e-mail válido." }, 400);
    }
    if (!token) {
      return json({ ok: false, message: "Informe o código do convite." }, 400);
    }
    if (password.length < 8) {
      return json(
        { ok: false, message: "A senha precisa ter pelo menos 8 caracteres." },
        400,
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("admin-provision: credenciais do backend ausentes");
      return json(
        { ok: false, message: "Não foi possível liberar o acesso agora. Tente novamente." },
        500,
      );
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Busca pelo token (segredo) e compara o e-mail em código, sem padrões de busca.
    const { data: invite, error: inviteError } = await admin
      .from("admin_invites")
      .select("id, email, used_at, expires_at")
      .eq("token", token)
      .maybeSingle();

    if (inviteError) {
      console.error("admin-provision: falha ao ler convite", inviteError.message);
      return json(
        { ok: false, message: "Não foi possível verificar o convite. Tente novamente." },
        500,
      );
    }

    if (!invite) {
      return json(
        { ok: false, message: "Convite não encontrado. Confira o e-mail e o código." },
        403,
      );
    }

    if (String(invite.email).toLowerCase() !== email) {
      console.error("admin-provision: convite de outro e-mail");
      return json(
        { ok: false, message: "Convite não encontrado. Confira o e-mail e o código." },
        403,
      );
    }

    if (invite.used_at) {
      return json(
        { ok: false, message: "Este convite já foi usado. Faça login com sua senha." },
        409,
      );
    }

    if (new Date(invite.expires_at).getTime() < Date.now()) {
      return json(
        { ok: false, message: "Este convite expirou. Peça um novo convite ao administrador." },
        410,
      );
    }

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError || !created?.user) {
      console.error("admin-provision: falha ao criar usuário", createError?.message);
      const alreadyRegistered = (createError?.message ?? "")
        .toLowerCase()
        .includes("already");
      return json(
        {
          ok: false,
          message: alreadyRegistered
            ? "Este e-mail já tem conta. Use a página de login."
            : "Não foi possível criar a conta. Tente novamente.",
        },
        alreadyRegistered ? 409 : 500,
      );
    }

    const { error: adminError } = await admin
      .from("admins")
      .insert({ user_id: created.user.id, email });

    if (adminError && adminError.code !== "23505") {
      console.error("admin-provision: falha ao registrar admin", adminError.message);
      return json(
        { ok: false, message: "Conta criada, mas o acesso falhou. Avise o suporte." },
        500,
      );
    }

    const { error: usedError } = await admin
      .from("admin_invites")
      .update({ used_at: new Date().toISOString() })
      .eq("id", invite.id);

    if (usedError) {
      console.error("admin-provision: falha ao marcar convite como usado", usedError.message);
    }

    console.log("admin-provision: acesso liberado", created.user.id);

    return json({
      ok: true,
      message: "Acesso de administrador criado. Entre com seu e-mail e senha.",
    });
  } catch (error) {
    console.error("admin-provision: erro inesperado", error);
    return json(
      { ok: false, message: "Não foi possível liberar o acesso agora. Tente novamente." },
      500,
    );
  }
});
