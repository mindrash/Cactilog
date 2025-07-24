import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPlantSchema, type InsertPlant } from "@shared/schema";
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
import { Plus, Camera } from "lucide-react";

interface AddPlantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddPlantModal({ open, onOpenChange }: AddPlantModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<string>("cactus");
  const [selectedGenus, setSelectedGenus] = useState<string>("Trichocereus");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  const form = useForm<InsertPlant>({
    resolver: zodResolver(insertPlantSchema),
    defaultValues: {
      type: "cactus",
      genus: "Trichocereus",
      species: "none",
      cultivar: "",
      mutation: "",
      commonName: "",
      supplier: "",
      acquisitionDate: "",
      groundType: "none",
      notes: "",
      customId: "",
    },
  });

  // Get available genera based on selected type
  const availableGenera = useMemo(() => {
    if (!selectedType) return [];
    const genera = selectedType === "cactus" ? cactusGenera : succulentGenera;
    return genera.map(g => ({
      name: g.name,
      commonName: g.commonName,
      displayName: g.commonName ? `${g.name} (${g.commonName})` : g.name
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedType]);

  // Get available species based on selected genus
  const availableSpecies = useMemo(() => {
    if (!selectedGenus) return [];
    return getSpeciesForGenus(selectedGenus, selectedType === "succulent")
      .filter(species => species && species.trim() !== "")
      .sort();
  }, [selectedGenus, selectedType]);

  const createPlantMutation = useMutation({
    mutationFn: async (data: InsertPlant) => {
      const response = await apiRequest("POST", "/api/plants", data);
      return response.json();
    },
    onSuccess: async (newPlant) => {
      console.log("Plant created successfully:", newPlant);
      
      // Upload photo if one was selected
      if (selectedPhoto) {
        try {
          const photoData = {
            filename: selectedPhoto.name,
            originalName: selectedPhoto.name,
            mimeType: selectedPhoto.type,
            size: selectedPhoto.size,
          };
          
          await apiRequest('POST', `/api/plants/${newPlant.id}/photos`, photoData);
          console.log("Photo uploaded successfully");
        } catch (photoError) {
          console.error("Photo upload error:", photoError);
          // Don't fail the whole process if photo upload fails
          toast({
            title: "Photo Upload Failed",
            description: "Plant was created but photo upload failed. You can add photos later.",
            variant: "destructive",
          });
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/plants"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Plant Added",
        description: "Your plant has been successfully added to your collection.",
      });
      form.reset({
        type: "cactus",
        genus: "Trichocereus",
        species: "none",
        cultivar: "",
        mutation: "",
        commonName: "",
        supplier: "",
        acquisitionDate: "",
        groundType: "none",
        notes: "",
        customId: "",
      });
      setSelectedType("cactus");
      setSelectedGenus("Trichocereus");
      setSelectedPhoto(null);
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
        description: "Failed to add plant. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPlant) => {
    console.log("Form submitted with data:", data);
    
    // Convert empty strings to null for optional fields
    const cleanedData = {
      ...data,
      species: data.species === "none" || data.species === "" ? null : data.species,
      cultivar: data.cultivar === "" ? null : data.cultivar,
      mutation: data.mutation === "" ? null : data.mutation,
      commonName: data.commonName === "" ? null : data.commonName,
      supplier: data.supplier === "" ? null : data.supplier,
      acquisitionDate: data.acquisitionDate === "" ? null : data.acquisitionDate,
      groundType: data.groundType === "" || data.groundType === "none" ? null : data.groundType,
      notes: data.notes === "" ? null : data.notes,
      customId: data.customId === "" ? null : data.customId,
    };
    
    console.log("Cleaned data:", cleanedData);
    createPlantMutation.mutate(cleanedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Plant</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type *</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedType(value);
                        // Reset genus and species when type changes
                        const firstGenus = value === "cactus" ? "Trichocereus" : "Echeveria";
                        form.setValue("genus", firstGenus);
                        form.setValue("species", "none");
                        setSelectedGenus(firstGenus);
                      }} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cactus">Cactus</SelectItem>
                          <SelectItem value="succulent">Succulent</SelectItem>
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
                        <Input placeholder="e.g., San Pedro" {...field} />
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
                        <Input placeholder="e.g., TRI-PACH-PC-1" {...field} />
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
                      {selectedType ? (
                        <div className="space-y-2">
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
                          <p className="text-xs text-muted-foreground">
                            {availableGenera.length} genera available for {selectedType}s
                          </p>
                        </div>
                      ) : (
                        <FormControl>
                          <Input 
                            placeholder="Select type first" 
                            disabled 
                            {...field} 
                          />
                        </FormControl>
                      )}
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
                      {selectedGenus ? (
                        <div className="space-y-2">
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
                          <p className="text-xs text-muted-foreground">
                            {availableSpecies.length} species available for {selectedGenus}
                          </p>
                        </div>
                      ) : (
                        <FormControl>
                          <Input 
                            placeholder="Select genus first" 
                            disabled 
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      )}
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
                        <Input placeholder="e.g., PC" {...field} />
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
                        <Input placeholder="e.g., Montrose" {...field} />
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
                        <Input placeholder="e.g., 3koSerious.com" {...field} />
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
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="groundType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ground Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "none"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ground type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None specified</SelectItem>
                          <SelectItem value="pup">Pup</SelectItem>
                          <SelectItem value="root">Root</SelectItem>
                          <SelectItem value="graft">Graft</SelectItem>
                          <SelectItem value="tip">Tip</SelectItem>
                          <SelectItem value="grafted">Grafted</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo (Optional)</h3>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Check file type
                      if (!file.type.startsWith('image/')) {
                        toast({
                          title: "Invalid File",
                          description: "Please select an image file.",
                          variant: "destructive",
                        });
                        return;
                      }
                      // Check file size (5MB limit)
                      if (file.size > 5 * 1024 * 1024) {
                        toast({
                          title: "File Too Large",
                          description: "Please select an image smaller than 5MB.",
                          variant: "destructive",
                        });
                        return;
                      }
                      setSelectedPhoto(file);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-forest transition-colors">
                  <div className="text-center text-gray-500">
                    {selectedPhoto ? (
                      <>
                        <Camera className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm font-medium">{selectedPhoto.name}</p>
                        <p className="text-xs">Click to change photo</p>
                      </>
                    ) : (
                      <>
                        <Plus className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm">Add Photo</p>
                        <p className="text-xs">Click to upload</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
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
                disabled={createPlantMutation.isPending}
              >
                {createPlantMutation.isPending ? "Adding..." : "Add Plant"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
