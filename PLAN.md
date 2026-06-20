# Edit Plan: Fix backend/server.js crash

## Information Gathered
- `backend/server.js` currently throws: `SyntaxError: Unexpected token ';'` at line with:
  - `app.use('/uploads', express.static(path.resolve('uploads')));`
- File also has clear structural issues around the `allowedOrigins` array:
  - `const allowedOrigins = [` is started, then `// Serve uploaded thumbnails` and the `/uploads` route appear inside it.
  - `path` is used but not imported.

## Plan
1. Open/validate `backend/server.js` and fix syntax issues by restructuring:
   - Add `import path from 'path';`.
   - Move `app.use('/uploads', express.static(...))` out of the `allowedOrigins` array.
   - Ensure `allowedOrigins` is a complete array of strings.
2. Re-run `node --check backend/server.js` to confirm syntax correctness.
3. Update `TODO.md` to reflect progress.

## Dependent Files to be edited
- `backend/server.js`
- `TODO.md`

## Followup steps
- Run backend start command (`npm run dev` inside `backend/`) to confirm the server boots.
- Optionally hit `GET /api/health`.

