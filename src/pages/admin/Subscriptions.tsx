import { AISubscriptionPanel } from "@/components/admin/AISubscriptionPanel";
import { Card } from "@/components/ui/card";

export default function AdminSubscriptions() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">AI Subscriptions</h2>
        <p className="text-gray-600 mt-1">
          Monitor and manage AI subscription revenue
        </p>
      </div>

      <Card className="shadow-md border-gray-200 bg-white">
        <AISubscriptionPanel />
      </Card>
    </div>
  );
}
