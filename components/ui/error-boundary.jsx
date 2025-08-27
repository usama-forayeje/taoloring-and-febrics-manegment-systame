"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught by boundary:", error, errorInfo)
    }

    resetError = () => {
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                const FallbackComponent = this.props.fallback
                return <FallbackComponent error={this.state.error} resetError={this.resetError} />
            }

            return (
                <div className="flex items-center justify-center min-h-[400px] p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                                <AlertTriangle className="h-6 w-6 text-destructive" />
                            </div>
                            <CardTitle>Something went wrong</CardTitle>
                            <CardDescription>
                                An error occurred while loading this component. Please try refreshing the page.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <Button onClick={this.resetError} variant="outline" className="gap-2 bg-transparent">
                                <RefreshCw className="h-4 w-4" />
                                Try again
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )
        }

        return this.props.children
    }
}
