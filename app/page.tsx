import { TruckPartsChatbot } from "@/components/truck-parts-chatbot"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Truck Parts Website</h1>
        <p className="text-slate-600 mb-8">
          Welcome to our truck parts store. Our AI assistant powered by LangGraph is ready to help you find the exact
          parts you need!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Engine Parts</h2>
            <p className="text-slate-600">Find engine components for all truck makes and models.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Brake Systems</h2>
            <p className="text-slate-600">Complete brake solutions for commercial vehicles.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Electrical</h2>
            <p className="text-slate-600">Lighting, sensors, and electrical components.</p>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">🤖 AI-Powered Parts Search</h3>
          <p className="text-blue-800 text-sm">
            Our chatbot uses advanced LangGraph technology to understand your needs and find the exact truck parts
            you're looking for. Just describe your truck and the part you need!
          </p>
        </div>
      </div>

      {/* LangGraph-powered Chatbot */}
      <TruckPartsChatbot />
    </div>
  )
}
