export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">CMS Workbench</h1>
          <p className="text-muted-foreground">
            Development workbench for CMSNext with shadcn/ui components
          </p>
        </header>

        <div className="grid gap-6">
          <section className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <p className="text-muted-foreground mb-4">
              This is a basic shadcn/ui component workbench. The framework is ready for you to add components.
            </p>
            <div className="space-y-2">
              <p className="text-sm">To add shadcn/ui components, run:</p>
              <code className="block bg-muted p-3 rounded text-sm">
                npx shadcn-ui@latest add [component-name]
              </code>
            </div>
          </section>

          <section className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Component Workbench</h2>
            <p className="text-muted-foreground">
              Add your components here to test and develop them.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
