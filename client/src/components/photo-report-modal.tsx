import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AlertTriangle, Flag, Copyright, ImageIcon } from "lucide-react";

interface PhotoReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageId: string;
  imageUrl: string;
  genus: string;
  species: string;
}

export function PhotoReportModal({
  isOpen,
  onClose,
  imageId,
  imageUrl,
  genus,
  species,
}: PhotoReportModalProps) {
  const [reportType, setReportType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const reportMutation = useMutation({
    mutationFn: async (data: {
      reportType: string;
      description: string;
      reporterEmail: string;
    }) => {
      const response = await fetch(`/api/species/images/${imageId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit report");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Thank you for helping maintain image quality. An admin will review this report.",
      });
      onClose();
      setReportType("");
      setDescription("");
      setReporterEmail("");
    },
    onError: (error) => {
      toast({
        title: "Failed to Submit Report",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const reportTypeOptions = [
    {
      value: "incorrect_species",
      label: "Incorrect Species",
      icon: AlertTriangle,
      description: "This image shows a different species than labeled",
    },
    {
      value: "inappropriate",
      label: "Inappropriate Content",
      icon: Flag,
      description: "Content is inappropriate for a botanical database",
    },
    {
      value: "copyright",
      label: "Copyright Issue",
      icon: Copyright,
      description: "Potential copyright or attribution problem",
    },
    {
      value: "poor_quality",
      label: "Poor Quality",
      icon: ImageIcon,
      description: "Image quality is too low to be useful",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportType) {
      toast({
        title: "Report Type Required",
        description: "Please select a reason for reporting this image.",
        variant: "destructive",
      });
      return;
    }

    reportMutation.mutate({
      reportType,
      description,
      reporterEmail,
    });
  };

  const selectedOption = reportTypeOptions.find(opt => opt.value === reportType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-red-600" />
            Report Image Issue
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Preview */}
          <div className="flex gap-4">
            <img
              src={imageUrl}
              alt={`${genus} ${species}`}
              className="w-32 h-32 object-cover rounded-lg border border-sage-200"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-forest-800">
                <em>{genus} {species}</em>
              </h3>
              <p className="text-sm text-sage-600 mt-1">
                Help us maintain accurate botanical images by reporting any issues you notice.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Report Type */}
            <div className="space-y-2">
              <Label htmlFor="reportType">What's wrong with this image? *</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-sage-600">
                              {option.description}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {selectedOption && (
                <p className="text-sm text-sage-600 bg-sage-50 p-2 rounded">
                  {selectedOption.description}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Additional Details (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide any additional context that would help us understand the issue..."
                rows={3}
              />
            </div>

            {/* Reporter Email */}
            <div className="space-y-2">
              <Label htmlFor="reporterEmail">
                Your Email (Optional)
              </Label>
              <Input
                id="reporterEmail"
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
              <p className="text-xs text-sage-600">
                Leave your email if you'd like updates on this report
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={reportMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!reportType || reportMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {reportMutation.isPending ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}