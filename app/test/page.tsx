import { APITestPanel } from "@/components/api-test-panel"

export default function TestPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">API Integration Testing</h1>
          <p className="text-muted-foreground mt-2">
            Test your Intella Parts API integration before deploying to production
          </p>
        </div>
        <APITestPanel />
      </div>
    </div>
  )
}
