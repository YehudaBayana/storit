Act as a senior frontend engineer helping me build a React design system.

Our tech stack is: React (Next.js), TypeScript, Tailwind CSS, Jest, React Testing Library, and react-icons.

I need you to generate the code for a set of UI components following these strict requirements:

1. **Design Philosophy:** Minimalist and consistent. Rely on a centralized `tailwind.config.js` (e.g., using `brand-500` for an emerald accent `#10b981`, and `brand-dark` for deep dark elements `#111827`). Do not use raw hex codes in the components.
2. **Component Structure:** Each component must live in `/components/ui/[component-name]/` and include:
   - The component file (`[Name].tsx`).
   - A `__tests__` folder containing a Test Driver (`[Name].driver.ts`) and a Unit Test (`[Name].test.tsx`).
   - A Markdown documentation file (`[name].md`).
3. **Test Driver Pattern:** I do not use raw Jest/RTL queries (`screen.getByTestId`) in test files. You must create a Driver class (e.g., `ButtonDriver`) that encapsulates all DOM interactions (like `.click()`, `.text`, `.exists()`). The `.test.tsx` file must only use this driver.
4. **Documentation:** The `.md` file must include an Import statement, Usage Example, and a Props table.

**CRITICAL OUTPUT FORMAT:**
I want to create all files and insert their content directly from my terminal without manual copying and pasting in a GUI.
You must output a SINGLE copiable bash code block containing `mkdir -p` commands and `cat << 'EOF' > filepath` commands to generate all the files and their content.
_Important:_ When generating the `.md` files via `cat`, DO NOT use triple backticks (` ``` `) for code blocks inside the markdown content, as this prematurely closes the bash block and breaks browser formatting. Instead, use standard 4-space indentation for code blocks inside the markdown.

Please start directly with the terminal commands, if your potential response will be too long that it exceeds your resonse limit, them provide some of what i've asked, and then i will respond to you with "continue" and you will respond to me with the next content, this will insure the best results and will not force you to compress your response to not cap the limit you have built in.
