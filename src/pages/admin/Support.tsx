import { SupportTickets } from "@/components/admin/SupportTickets";
import { Card } from "@/components/ui/card";

export default function AdminSupport() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Support Tickets</h2>
        <p className="text-gray-600 mt-1">
          Manage customer support requests and inquiries
        </p>
      </div>

      <Card className="shadow-md border-gray-200 bg-white">
        <SupportTickets />
      </Card>
    </div>
  );
}
