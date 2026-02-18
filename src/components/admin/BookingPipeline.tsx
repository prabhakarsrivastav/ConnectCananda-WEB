import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

export function BookingPipeline() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchPipelineData();
  }, []);

  const fetchPipelineData = async () => {
    const { data: bookings } = await supabase
      .from("bookings")
      .select("status");

    if (bookings) {
      const statusCounts = bookings.reduce((acc: any, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      }, {});

      const chartData = [
        { name: "Leads", count: statusCounts.lead || 0 },
        { name: "Paid", count: statusCounts.paid || 0 },
        { name: "Completed", count: statusCounts.completed || 0 },
      ];

      setData(chartData);
    }
  };

  return (
    <Card className="bg-[#181a20] border border-[#2b3139] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
      <CardHeader className="pb-3 border-b border-[#2b3139]">
        <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#fcd535]" />
          Booking Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2b3139" />
            <XAxis dataKey="name" tick={{ fill: '#848e9c' }} stroke="#2b3139" />
            <YAxis tick={{ fill: '#848e9c' }} stroke="#2b3139" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0B0E11', 
                border: '1px solid #2b3139',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Bar dataKey="count" fill="#fcd535" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
