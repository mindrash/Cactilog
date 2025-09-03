import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, Ruler, Activity, Flower, Users, StickyNote } from "lucide-react";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Plant, GrowthRecord } from "@shared/schema";
import { cn } from "@/lib/utils";

const editGrowthRecordSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  heightInches: z.string().optional(),
  widthInches: z.string().optional(),
  circumferenceInches: z.string().optional(),
  offsetCount: z.number().optional(),
  healthScore: z.number().min(1).max(10).optional(),
  floweringStatus: z.enum(["none", "budding", "blooming", "fruiting"]).optional(),
  observations: z.string().optional(),
}).refine(
  (data) => data.heightInches || data.widthInches,
  {
    message: "At least one dimension (height or width) is required",
    path: ["heightInches"],
  }
);

type EditGrowthRecordForm = z.infer<typeof editGrowthRecordSchema>;

interface EditGrowthModalProps {
  plant: Plant;
  record: GrowthRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditGrowthModal({ plant, record, open, onOpenChange }: EditGrowthModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EditGrowthRecordForm>({
    resolver: zodResolver(editGrowthRecordSchema),
    defaultValues: {
      date: new Date(),
      floweringStatus: "none",
    },
  });

  // Reset form when record changes or modal opens
  useEffect(() => {
    if (record && open) {
      form.reset({
        date: new Date(record.date),
        heightInches: record.heightInches || "",
        widthInches: record.widthInches || "",
        circumferenceInches: record.circumferenceInches || "",
        offsetCount: record.offsetCount || undefined,
        healthScore: record.healthScore || undefined,
        floweringStatus: (record.floweringStatus as "none" | "budding" | "blooming" | "fruiting") || "none",
        observations: record.observations || "",
      });
    }
  }, [record, open, form]);

  const updateGrowthRecord = useMutation({
    mutationFn: async (data: EditGrowthRecordForm) => {
      if (!record) throw new Error("No record to update");
      
      const response = await fetch(`/api/growth/${record.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          date: data.date.toISOString().split('T')[0], // Convert to YYYY-MM-DD
          offsetCount: data.offsetCount || null,
          healthScore: data.healthScore || null,
          floweringStatus: data.floweringStatus || null,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update growth record: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plants/growth-overview"] });
      queryClient.invalidateQueries({ queryKey: ["/api/growth/analytics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/plants", plant.id, "growth"] });
      toast({
        title: "Growth record updated",
        description: `Successfully updated growth measurement for ${plant.customId}`,
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update growth record",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditGrowthRecordForm) => {
    updateGrowthRecord.mutate(data);
  };

  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-cactus-green" />
            Edit Growth Record
          </DialogTitle>
          <DialogDescription>
            Update measurements and observations for {plant.customId} ({plant.genus} {plant.species})
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Measurement Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Measurements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="heightInches"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (inches)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 12.5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="widthInches"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width (inches)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 3.2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="circumferenceInches"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Circumference (inches)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 10.1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Tracking */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="offsetCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Offset Count
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="healthScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Health Score (1-10)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        placeholder="8"
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="floweringStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Flower className="h-4 w-4" />
                      Flowering Status
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="budding">Budding</SelectItem>
                        <SelectItem value="blooming">Blooming</SelectItem>
                        <SelectItem value="fruiting">Fruiting</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Observations */}
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <StickyNote className="h-4 w-4" />
                    Observations & Notes
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Record any observations about growth, health, environmental conditions, or other notes..."
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateGrowthRecord.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-cactus-green hover:bg-cactus-green/90"
                disabled={updateGrowthRecord.isPending}
              >
                {updateGrowthRecord.isPending ? "Updating..." : "Update Record"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}