import { TruckPartsChatbot } from "@/components/truck-parts-chatbot"

export default function EmbedPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">LangGraph Chatbot Integration</h1>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Python LangGraph Server Integration</h2>
            <p className="text-gray-600 mb-4">
              This chatbot connects to your external Python LangGraph server for advanced conversation handling and
              truck parts search capabilities.
            </p>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Required Environment Variables:</h3>
              <ul className="text-sm space-y-1 font-mono">
                <li>LANGGRAPH_SERVER_URL=http://your-server:8000</li>
                <li>LANGGRAPH_API_KEY=your-api-key (optional)</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Expected Server Endpoints</h2>
            <div className="space-y-3 text-sm">
              <div className="border-l-4 border-blue-500 pl-4">
                <strong>POST /chat/stream</strong>
                <p className="text-gray-600">Streaming chat endpoint for real-time responses</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <strong>POST /chat</strong>
                <p className="text-gray-600">Non-streaming chat endpoint</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <strong>GET /health</strong>
                <p className="text-gray-600">Health check endpoint</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Integration Examples</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Basic Integration:</h3>
                <code className="bg-gray-100 p-2 rounded text-sm block">{`<TruckPartsChatbot />`}</code>
              </div>
              <div>
                <h3 className="font-medium mb-2">Custom LangGraph Server:</h3>
                <code className="bg-gray-100 p-2 rounded text-sm block">
                  {`<TruckPartsChatbot langGraphUrl="http://custom-server:8000" />`}
                </code>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Real-time streaming from your Python LangGraph server</li>
              <li>Session management with unique session IDs</li>
              <li>Error handling and connection monitoring</li>
              <li>Configurable server endpoints</li>
              <li>Health check integration</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Example chatbot */}
      <TruckPartsChatbot title="LangGraph Assistant" />
    </div>
  )
}
