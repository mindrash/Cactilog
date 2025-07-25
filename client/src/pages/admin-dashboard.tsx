import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Shield, 
  Flag, 
  AlertTriangle, 
  Copyright, 
  ImageIcon, 
  Clock,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Calendar,
  ExternalLink
} from "lucide-react";
import { PhotoReport } from "@shared/schema";

interface AdminStatusCheck {
  isAdmin: boolean;
}

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string>("pending");
  const [reviewingReport, setReviewingReport] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user is admin
  const { data: adminStatus, isLoading: adminLoading } = useQuery<AdminStatusCheck>({
    queryKey: ["/api/admin/status"],
    enabled: !!user,
  });

  // Initialize Tom as admin on first visit
  useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/initialize", { method: "POST" });
      if (!response.ok) throw new Error("Failed to initialize admin");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/status"] });
    },
  });

  // Get photo reports
  const { data: reports = [], isLoading: reportsLoading } = useQuery<PhotoReport[]>({
    queryKey: ["/api/admin/reports", selectedStatus],
    queryFn: async () => {
      const response = await fetch(`/api/admin/reports?status=${selectedStatus}`);
      if (!response.ok) throw new Error("Failed to fetch reports");
      return response.json();
    },
    enabled: adminStatus?.isAdmin,
  });

  // Update report mutation
  const updateReportMutation = useMutation({
    mutationFn: async ({ 
      reportId, 
      status, 
      adminNotes 
    }: { 
      reportId: string; 
      status: string; 
      adminNotes: string; 
    }) => {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes }),
      });
      if (!response.ok) throw new Error("Failed to update report");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Updated",
        description: "The photo report has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reports"] });
      setReviewingReport(null);
      setAdminNotes("");
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (authLoading || adminLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-600"></div>
        </div>
      </div>
    );
  }

  if (!adminStatus?.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <Shield className="h-16 w-16 mx-auto text-sage-400 mb-4" />
            <h2 className="text-xl font-semibold text-forest-800 mb-2">Access Denied</h2>
            <p className="text-sage-600">
              You don't have admin privileges to access this section.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'incorrect_species': return AlertTriangle;
      case 'inappropriate': return Flag;
      case 'copyright': return Copyright;
      case 'poor_quality': return ImageIcon;
      default: return Flag;
    }
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'incorrect_species': return 'Incorrect Species';
      case 'inappropriate': return 'Inappropriate Content';
      case 'copyright': return 'Copyright Issue';
      case 'poor_quality': return 'Poor Quality';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-700 border-yellow-300">Pending</Badge>;
      case 'reviewed':
        return <Badge variant="outline" className="text-blue-700 border-blue-300">Reviewed</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="text-green-700 border-green-300">Resolved</Badge>;
      case 'dismissed':
        return <Badge variant="outline" className="text-gray-700 border-gray-300">Dismissed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleReportAction = (reportId: string, status: string) => {
    updateReportMutation.mutate({
      reportId,
      status,
      adminNotes,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-forest-600" />
        <div>
          <h1 className="text-3xl font-bold text-forest-800">Admin Dashboard</h1>
          <p className="text-sage-600">Manage photo reports and maintain image quality</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {['pending', 'reviewed', 'resolved', 'dismissed'].map((status) => {
          const statusReports = Array.isArray(reports) ? reports.filter(r => r.status === status) : [];
          return (
            <Card key={status} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-sage-600 capitalize">{status}</p>
                    <p className="text-2xl font-bold text-forest-800">{statusReports.length}</p>
                  </div>
                  {getStatusBadge(status)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Photo Reports</CardTitle>
          <CardDescription>
            Review and manage user-reported image issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending Reports</SelectItem>
                <SelectItem value="reviewed">Reviewed Reports</SelectItem>
                <SelectItem value="resolved">Resolved Reports</SelectItem>
                <SelectItem value="dismissed">Dismissed Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reports List */}
          {reportsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-sage-50 h-32 rounded-lg"></div>
              ))}
            </div>
          ) : !Array.isArray(reports) || reports.length === 0 ? (
            <div className="text-center py-8 text-sage-600">
              <Flag className="h-12 w-12 mx-auto mb-4 text-sage-400" />
              <p>No {selectedStatus} reports found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Array.isArray(reports) && reports.map((report) => {
                const Icon = getReportTypeIcon(report.reportType);
                const isReviewing = reviewingReport === report.id;
                
                return (
                  <Card key={report.id} className="border-l-4 border-l-red-200">
                    <CardContent className="pt-4">
                      <div className="flex gap-4">
                        {/* Report Icon & Type */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-red-600" />
                          </div>
                        </div>

                        {/* Report Details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-forest-800">
                                {getReportTypeLabel(report.reportType)}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-sage-600 mt-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Unknown date'}
                                </div>
                                {report.reporterEmail && (
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    {report.reporterEmail}
                                  </div>
                                )}
                              </div>
                            </div>
                            {getStatusBadge(report.status)}
                          </div>

                          {report.description && (
                            <p className="text-sage-700 bg-sage-50 p-3 rounded">
                              "{report.description}"
                            </p>
                          )}

                          {report.adminNotes && (
                            <div className="bg-blue-50 p-3 rounded">
                              <p className="text-sm font-medium text-blue-800 mb-1">Admin Notes:</p>
                              <p className="text-blue-700">{report.adminNotes}</p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          {report.status === 'pending' && (
                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                onClick={() => setReviewingReport(isReviewing ? null : report.id)}
                                variant="outline"
                              >
                                {isReviewing ? 'Cancel' : 'Review'}
                              </Button>
                            </div>
                          )}

                          {/* Review Form */}
                          {isReviewing && (
                            <div className="bg-sage-50 p-4 rounded-lg space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-forest-800 mb-2">
                                  Admin Notes
                                </label>
                                <Textarea
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  placeholder="Add notes about your decision..."
                                  rows={3}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleReportAction(report.id, 'resolved')}
                                  disabled={updateReportMutation.isPending}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Resolve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReportAction(report.id, 'dismissed')}
                                  disabled={updateReportMutation.isPending}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Dismiss
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}