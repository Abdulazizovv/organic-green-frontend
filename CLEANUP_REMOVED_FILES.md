Removed unused/legacy files on 2025-09-05:
- src/lib/api_backup.ts
- src/lib/cart_new.ts
- src/lib/hooks-old.ts
- src/lib/language copy.tsx
- src/lib/language-new.tsx

Rationale: user requested deletion of unused files; active code imports only src/lib/language.tsx for language context and cart functionality lives elsewhere. If restoration needed, recover from git history.
