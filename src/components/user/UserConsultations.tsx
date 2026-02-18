import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, Mail, Phone, MessageSquare } from "lucide-react";
import axios from "axios";

interface Consultation {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  consultationType: string;
  preferredDate: string;
  scheduledDate?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  message?: string;
  notes?: string;
  createdAt: string;
}

export default function UserConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const token = localStorage.getItem("authToken");
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/consultations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setConsultations(response.data.data || []);
    } catch (error: any) {
      console.error("Error fetching consultations:", error);
      console.error("Error response:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fcd535]"></div>
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <Card className="bg-[#181a20] border-[#2b3139] p-12 text-center">
        <Calendar className="h-16 w-16 text-[#848e9c] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Consultations Yet</h3>
        <p className="text-[#848e9c]">Book your first consultation to get started</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">My Consultations</h2>
      {consultations.map((consultation) => (
        <Card key={consultation._id} className="bg-[#181a20] border-[#2b3139] p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-white capitalize">
                  {consultation.consultationType?.replace("-", " ") || "Consultation"}
                </h3>
                <Badge className={getStatusColor(consultation.status)}>
                  {consultation.status}
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-[#848e9c]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Requested: {formatDate(consultation.preferredDate)}</span>
                </div>
                {consultation.scheduledDate && (
                  <div className="flex items-center gap-2 text-green-500">
                    <Clock className="h-4 w-4" />
                    <span>Scheduled: {formatDate(consultation.scheduledDate)}</span>
                  </div>
                )}
                {consultation.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{consultation.email}</span>
                  </div>
                )}
                {consultation.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{consultation.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {consultation.message && (
            <div className="mt-4 p-4 bg-[#0B0E11] rounded-lg">
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-[#848e9c] mt-1" />
                <div>
                  <p className="text-xs text-[#848e9c] mb-1">Your Message:</p>
                  <p className="text-sm text-white">{consultation.message}</p>
                </div>
              </div>
            </div>
          )}

          {consultation.notes && (
            <div className="mt-4 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Video className="h-4 w-4 text-green-500 mt-1" />
                <div>
                  <p className="text-xs text-green-500 mb-1">Admin Response:</p>
                  <p className="text-sm text-white">{consultation.notes}</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
