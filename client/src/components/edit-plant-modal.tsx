import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPlantSchema, type InsertPlant, type Plant, BOTANICAL_FAMILIES } from "@shared/schema";
import { cactusGenera, succulentGenera, getSpeciesForGenus } from "@shared/cactus-data";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Dialog,
  DialogContent,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditPlantModalProps {
  plant: Plant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditPlantModal({ plant, open, onOpenChange }: EditPlantModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFamily, setSelectedFamily] = useState<string>(plant.family);
  const [selectedGenus, setSelectedGenus] = useState<string>(plant.genus);

  const form = useForm<InsertPlant>({
    resolver: zodResolver(insertPlantSchema),
    defaultValues: {
      family: plant.family,
      genus: plant.genus,
      species: plant.species || "none",
      cultivar: plant.cultivar || "",
      mutation: plant.mutation || "",
      commonName: plant.commonName || "",
      supplier: plant.supplier || "",
      acquisitionDate: plant.acquisitionDate || "",
      initialType: plant.initialType || "none",
      isPublic: (plant.isPublic as "public" | "private") || "public",
      notes: plant.notes || "",
      customId: plant.customId || "",
    },
  });

  // Get available genera based on selected family
  const availableGenera = useMemo(() => {
    if (!selectedFamily) return [];
    const genera = selectedFamily === "Cactaceae" ? cactusGenera : succulentGenera;
    return genera.map(g => ({
      name: g.name,
      commonName: g.commonName,
      displayName: g.commonName ? `${g.name} (${g.commonName})` : g.name
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedFamily]);

  // Get available species based on selected genus
  const availableSpecies = useMemo(() => {
    if (!selectedGenus) return [];
    return getSpeciesForGenus(selectedGenus, selectedFamily !== "Cactaceae")
      .filter(species => species && species.trim() !== "")
      .sort();
  }, [selectedGenus, selectedFamily]);

  const updatePlantMutation = useMutation({
    mutationFn: async (data: InsertPlant) => {
      const response = await apiRequest("PATCH", `/api/plants/${plant.id}`, data);
      return response.json();
    },
    onSuccess: (updatedPlant) => {
      queryClient.invalidateQueries({ queryKey: ["/api/plants"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Plant Updated",
        description: "Your plant has been updated successfully.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update plant. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPlant) => {
    // Clean the data - convert empty strings to null, handle "none" values
    const cleanedData = {
      ...data,
      species: data.species === "none" ? null : data.species,
      cultivar: data.cultivar?.trim() === "" ? null : data.cultivar,
      mutation: data.mutation?.trim() === "" ? null : data.mutation,
      commonName: data.commonName?.trim() === "" ? null : data.commonName,
      supplier: data.supplier?.trim() === "" ? null : data.supplier,
      acquisitionDate: data.acquisitionDate?.trim() === "" ? null : data.acquisitionDate,
      initialType: data.initialType === "none" ? null : data.initialType,
      notes: data.notes?.trim() === "" ? null : data.notes,
      customId: data.customId?.trim() === "" ? null : data.customId,
    };
    
    updatePlantMutation.mutate(cleanedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Plant</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="family"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Family *</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedFamily(value);
                        // Reset genus and species when family changes
                        const firstGenus = value === "Cactaceae" ? "Trichocereus" : "Echeveria";
                        form.setValue("genus", firstGenus);
                        form.setValue("species", "none");
                        setSelectedGenus(firstGenus);
                      }} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select family" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BOTANICAL_FAMILIES.map((family) => (
                            <SelectItem key={family} value={family}>
                              {family}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="commonName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Common Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., San Pedro" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., TRI-PACH-PC-1" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Taxonomy */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Taxonomy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="genus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genus *</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedGenus(value);
                        // Reset species when genus changes
                        form.setValue("species", "none");
                      }} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select genus" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-64 overflow-y-auto">
                          {availableGenera.map((genus) => (
                            <SelectItem key={genus.name} value={genus.name}>
                              {genus.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="species"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Species</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "none"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select species (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-64 overflow-y-auto">
                          <SelectItem value="none">None specified</SelectItem>
                          {availableSpecies
                            .filter(species => species && species.trim() !== "")
                            .map((species) => (
                              <SelectItem key={species} value={species}>
                                {species}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cultivar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cultivar</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., PC" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mutation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mutation</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Montrose" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Acquisition Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acquisition Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 3koSerious.com" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="acquisitionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Acquisition Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="initialType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "none"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select initial type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None specified</SelectItem>
                          <SelectItem value="pup">Pup</SelectItem>
                          <SelectItem value="root">Root</SelectItem>
                          <SelectItem value="graft">Graft</SelectItem>
                          <SelectItem value="tip">Tip</SelectItem>
                          <SelectItem value="grafted">Grafted</SelectItem>
                          <SelectItem value="mid">Mid</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Privacy Setting */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">Public - Visible in the community feed</SelectItem>
                        <SelectItem value="private">Private - Only you can see this plant</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={4} 
                      placeholder="Add any notes about this plant..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-forest hover:bg-forest/90"
                disabled={updatePlantMutation.isPending}
              >
                {updatePlantMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}