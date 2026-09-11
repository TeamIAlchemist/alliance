import { createHash } from 'crypto';
// Normalise un code d'equipe (insensible a la casse, aux espaces et aux tirets)
export const normCode = (raw: string) => (raw||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
// Hash (jamais stocker le code brut). Le sel vient de l'env.
export const hashCode = (raw: string) =>
  createHash('sha256').update(normCode(raw) + (process.env.CODE_HASH_SALT||'')).digest('hex');
