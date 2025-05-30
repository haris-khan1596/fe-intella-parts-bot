"use client"

import { useChat } from "ai/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, Truck, MessageCircle, X, Minimize2, Maximize2, Bot } from "lucide-react"

interface TruckPartsChatbotProps {
  /** Custom title for the chatbot */
  title?: string
  /** Custom placeholder text */
  placeholder?: string
  /** Initial height of the chat window */
  height?: string
  /** Whether to show the chatbot in minimized mode initially */
  minimized?: boolean
  /** Custom API endpoint for the chat */
  apiEndpoint?: string
  /** Custom styling classes */
  className?: string
  /** LangGraph server URL (optional override) */
  langGraphUrl?: string
}

export function TruckPartsChatbot({
  title = "Truck Parts Assistant",
  placeholder = "Ask about truck parts (e.g., 'Find brake pads for 2020 Ford F-150')...",
  height = "500px",
  minimized = false,
  apiEndpoint = "/api/chat",
  className = "",
  langGraphUrl,
}: TruckPartsChatbotProps) {
  const [isMinimized, setIsMinimized] = useState(minimized)
  const [isOpen, setIsOpen] = useState(!minimized)
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: apiEndpoint,
    headers: {
      "x-session-id": sessionId,
      ...(langGraphUrl && { "x-langgraph-url": langGraphUrl }),
    },
  })

  // Don't render anything if closed
  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg bg-slate-700 hover:bg-slate-800"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>
    )
  }

  // Minimized view
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-80 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-slate-700" />
              <CardTitle className="text-sm">{title}</CardTitle>
              <Badge variant="outline" className="text-xs">
                LangGraph
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setIsMinimized(false)}>
                <Maximize2 className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-xs text-muted-foreground">Powered by LangGraph • Click to expand and start chatting</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Card className="w-96 shadow-xl" style={{ height }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-slate-700" />
            <CardTitle className="text-sm">{title}</CardTitle>
            <Badge variant="outline" className="text-xs">
              LangGraph
            </Badge>
            {isLoading && (
              <Badge variant="secondary" className="text-xs animate-pulse">
                Processing...
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)}>
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-80 p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4 text-slate-500">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-8 w-8 text-slate-400" />
                  <Bot className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-sm font-medium mb-1">LangGraph Assistant Ready</h3>
                <p className="text-xs">Ask me about finding truck parts and part numbers.</p>
                <p className="text-xs text-slate-400 mt-1">Session: {sessionId.split("_")[1]}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`rounded-lg px-3 py-2 max-w-[85%] text-sm ${
                        message.role === "user" ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-900 border"
                      }`}
                    >
                      {/* Show streaming content with cursor effect */}
                      <div className="whitespace-pre-wrap">
                        {message.content}
                        {message.role === "assistant" &&
                          isLoading &&
                          message.id === messages[messages.length - 1]?.id && (
                            <span className="inline-block w-2 h-4 bg-slate-400 ml-1 animate-pulse" />
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t p-3">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={placeholder}
              disabled={isLoading}
              className="flex-1 text-sm"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="sm">
              {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
