import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Téléphone invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
  nom: z.string().min(2, 'Nom requis'),
  prenom: z.string().min(2, 'Prénom requis'),
  role: z.enum(['client', 'proprietaire', 'agent']).default('client')
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis')
});
