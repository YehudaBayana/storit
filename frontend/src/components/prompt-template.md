[DESCRIBE THE FEATURE / WHAT TO BUILD OR UPDATE HERE — paste any existing code below]

**Stack & rules:**

- React + TypeScript. Use **Mantine components only** for UI — never raw HTML tags (`div`, `span`, `button`, `input`, etc.). Use the Mantine equivalent (`Stack`, `Group`, `Box`, `Text`, `Button`, `TextInput`, …).
- Custom styling only via **TailwindCSS** classes passed through `className` on Mantine components.
- Icons only from **react-icons** (e.g. `react-icons/fi`, `react-icons/md`).
- Use full paths relative to the project root. Add `mkdir -p` for every new directory.
- When updating a feature: keep unrelated code intact and emit the **full file content** — never `// ...` placeholders, never "rest unchanged", never summaries.

**CRITICAL OUTPUT FORMAT:**
I want to create/update all files directly from my terminal without manual copy-pasting. Output a **SINGLE** copiable bash code block containing only:

- `mkdir -p <dir>` commands for every needed directory
- `cat << 'EOF' > <filepath>` … `EOF` blocks with the full content of each file

Rules:

- Start **directly** with the bash block — no prose before or after.
- Do **not** use triple backticks anywhere inside file contents (it closes the outer bash fence in chat). For markdown code samples or nested code blocks, use 4-space indentation instead.
- If your response would exceed the output limit, stop cleanly at a file boundary and wait for me to reply `continue` — then output the next chunk. Never compress, summarize, or truncate to fit.
