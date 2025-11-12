# CMSWorkbench
Development workbench for CMSNext with shadcn/ui components

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding shadcn/ui Components

To add shadcn/ui components to the workbench:

```bash
npx shadcn-ui@latest add [component-name]
```

For example:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add tabs
```

## Project Structure

- `app/` - Next.js app directory with pages and layouts
- `components/` - shadcn/ui components will be added here
- `lib/` - Utility functions
- `components.json` - shadcn/ui configuration

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
