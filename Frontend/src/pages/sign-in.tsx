import { AuthPanels } from "@/components/blocks/auth-panels"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignIn() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col justify-center px-6 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Sign in to Tipsy</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthPanels />
        </CardContent>
      </Card>
    </div>
  )
}
