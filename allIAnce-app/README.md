# All(IA)nce — Vercel + Supabase (+ HubSpot)

Diagnostic « reddition cognitive » : formulaire par code d'équipe, données en base EU,
back-office facilitateur, rapport PDF. Ce dépôt est un **socle** à compléter.

## Architecture
- **Supabase (EU/Francfort)** = base de données. Tables `clients → teams → waves → responses`.
  Les **vagues** permettent le suivi longitudinal (re-diagnostic à 6 mois).
- **Vercel (Next.js)** = app hébergée : accueil (code), questionnaire, API de soumission, espace facilitateur.
- **HubSpot** = relation client / relances (pas les données du diagnostic).

## Points NON négociables (sécurité & RGPD)
1. **Créer le projet Supabase en région EU** dès le départ (quasi irréversible).
2. **RLS activée** (voir `supabase/schema.sql`) : un facilitateur ne voit que SES clients ;
   les répondants sont anonymes et ne lisent rien.
3. **Scoring côté serveur** (`lib/scoring.ts`, appelé par `app/api/submit`), jamais dans le navigateur.
4. **Service role key** uniquement côté serveur (routes API). Jamais exposée au client.
5. **Codes d'équipe hashés** (`lib/code.ts`) — on ne stocke jamais le code brut.
6. **DPA signés** avec Supabase, Vercel, HubSpot. Notice de confidentialité + consentement affichés.
   Suppression sur demande = supprimer le client (cascade). Rétention documentée.

## Mise en route
1. `supabase` : créer le projet (EU), exécuter `supabase/schema.sql`.
2. Copier `.env.example` → `.env.local`, remplir les clés (dont `SUPABASE_SERVICE_ROLE_KEY`, `CODE_HASH_SALT`).
3. `npm install && npm run dev`.
4. Déployer sur Vercel (mêmes variables d'environnement).

## À compléter par le dev
- Porter le **front brandé** (questionnaire + cartographie) depuis `AllIAnce_webapp.html`
  (design, couleurs, ligne de polarité, carte, radar, nuage de mots).
- **Instrument** : copier la liste de questions (objet `ITEMS`, sans A3/H1) dans un `instrument.json` partagé.
- **Génération PDF côté serveur** : reproduire `build_report.py` (maquette fournie, FR + EN).
- **HubSpot** : à la clôture d'une vague, pousser un résumé + lien du rapport + créer une tâche de suivi.
- **Auth facilitateur** (Supabase Auth) + écran de gestion clients (création, suppression).

## Barème (déjà figé)
Reddition A = A1,A2,A4,(6−A6),(6−A7) sur 25 · bandes 11/18. Résistance B sur 20 · bandes 9/14.
5 C (individuel/collectif/signal IA /25), écart d'atrophie = signal − individuel, HSD (Contenant/Différence/Échange),
Kegan (2 items × 3 stades). Détail dans `lib/scoring.ts`.
