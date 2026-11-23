import { z } from "zod";

const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/\D/g, ""))
  .pipe(z.string().min(10, "Informe um telefone com DDD").max(13, "Telefone inválido"));

export const emailSchema = z.string().trim().toLowerCase().pipe(z.email("E-mail inválido"));

export const passwordSchema = z
  .string()
  .min(8, "A senha precisa de pelo menos 8 caracteres")
  .max(72, "Senha muito longa")
  .regex(/[A-Za-z]/, "Use ao menos uma letra")
  .regex(/\d/, "Use ao menos um número");

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome").max(80),
    email: emailSchema,
    password: passwordSchema,
    confirm: z.string(),
    acceptTerms: z.literal(true, { error: "Aceite os termos para continuar" }),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "As senhas não conferem" });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Informe a senha").max(72),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1).max(40),
  quantity: z.number().int().min(1).max(20),
});

export const cartSchema = z.array(cartItemSchema).min(1, "Seu carrinho está vazio").max(30);

export const quoteSchema = z.object({
  items: cartSchema,
  fulfillment: z.enum(["DELIVERY", "PICKUP"]),
  couponCode: z
    .string()
    .trim()
    .toUpperCase()
    .max(20)
    .optional()
    .transform((v) => (v ? v : undefined)),
});

export const addressSchema = z.object({
  street: z.string().trim().min(3, "Informe a rua").max(120),
  number: z.string().trim().min(1, "Nº").max(10),
  district: z.string().trim().min(2, "Informe o bairro").max(80),
  city: z.string().trim().min(2, "Informe a cidade").max(80),
  extra: z.string().trim().max(120).optional().default(""),
});

export const checkoutSchema = z
  .object({
    items: cartSchema,
    fulfillment: z.enum(["DELIVERY", "PICKUP"]),
    paymentMethod: z.enum(["PIX", "CARD"]),
    couponCode: z.string().trim().toUpperCase().max(20).optional(),
    name: z.string().trim().min(2, "Informe seu nome").max(80),
    phone,
    address: addressSchema.optional(),
    notes: z.string().trim().max(300).optional(),
    scheduledFor: z.iso.datetime({ offset: true }).optional().or(z.literal("")),
    acceptTerms: z.literal(true, { error: "Aceite os termos para finalizar" }),
  })
  .superRefine((d, ctx) => {
    if (d.fulfillment === "DELIVERY" && !d.address) {
      ctx.addIssue({ code: "custom", path: ["address"], message: "Informe o endereço de entrega" });
    }
  });
export type CheckoutInput = z.input<typeof checkoutSchema>;

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(80),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().max(13, "Telefone inválido"))
    .refine((v) => v.length === 0 || v.length >= 10, "Informe um telefone com DDD"),
});

export const changePasswordSchema = z
  .object({
    current: z.string().max(72),
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "As senhas não conferem" });

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(80),
  email: emailSchema,
  phone: z.string().trim().max(20).optional().default(""),
  message: z.string().trim().min(10, "Conte um pouco mais (mín. 10 caracteres)").max(2000),
});

export const newsletterSchema = z.object({ email: emailSchema });

export const productSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome").max(80),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífen")
    .max(80)
    .optional()
    .or(z.literal("")),
  description: z.string().trim().min(5, "Descrição curta obrigatória").max(160),
  longDescription: z.string().trim().max(2000).optional().default(""),
  price: z.coerce.number({ error: "Preço inválido" }).positive("Preço deve ser maior que zero").max(9999),
  compareAt: z.coerce.number().min(0).max(9999).optional(),
  categoryId: z.string().min(1, "Escolha a categoria"),
  badge: z.string().trim().max(24).optional().default(""),
  tags: z.string().trim().max(200).optional().default(""),
  calories: z.coerce.number().int().min(0).max(5000).optional(),
  featured: z.boolean().default(false),
  available: z.boolean().default(true),
});

export const bannerSchema = z.object({
  eyebrow: z.string().trim().max(60).default(""),
  title: z.string().trim().min(2, "Informe o título").max(60),
  highlight: z.string().trim().max(60).default(""),
  subtitle: z.string().trim().max(200).default(""),
  ctaLabel: z.string().trim().min(2).max(30),
  ctaHref: z
    .string()
    .trim()
    .regex(/^\/[^\s]*$/, "Use um link interno, ex.: /cardapio")
    .max(120),
  active: z.boolean().default(true),
});

export const rescheduleSchema = z.object({
  code: z.string().min(4).max(20),
  scheduledFor: z.iso.datetime({ offset: true }),
});

export const imageFileSchema = z
  .instanceof(File)
  .refine((f) => f.size > 0, "Selecione uma imagem")
  .refine((f) => f.size <= 4 * 1024 * 1024, "Imagem acima de 4 MB")
  .refine((f) => ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(f.type), "Use JPG, PNG, WEBP ou AVIF");

/** Converte erros do Zod em { campo: mensagem } para os formulários. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
