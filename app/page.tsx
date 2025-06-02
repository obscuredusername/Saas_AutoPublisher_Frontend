import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Card className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"></div>
        <CardContent className="relative z-10 p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30 relative">
              <Zap className="h-10 w-10 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl blur opacity-50 -z-10"></div>
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              Auto Publisher
            </h1>
            <p className="text-gray-400 mt-2">Your ultimate social media management platform</p>
          </div>

          <div className="space-y-4">
            <Link href="/login" className="w-full block">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-lg h-14 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:shadow-xl border-0">
                Login
              </Button>
            </Link>

            <Link href="/signup" className="w-full block">
              <Button
                variant="outline"
                className="w-full border-2 border-gray-600 bg-gray-800/50 hover:bg-gray-700/50 text-gray-200 hover:text-white text-lg h-14 rounded-xl transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20"
              >
                Sign Up
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">Elevate your social media presence today</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
