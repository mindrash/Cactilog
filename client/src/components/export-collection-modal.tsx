import { useState } from "react";
import { Download, FileText, FileSpreadsheet, File, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ExportCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportCollectionModal({ isOpen, onClose }: ExportCollectionModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Fetch user's plants for export
  const { data: plants = [] } = useQuery<any[]>({
    queryKey: ["/api/plants"],
    enabled: isOpen,
  });

  const prepareExportData = () => {
    return plants.map((plant) => ({
      "Custom ID": plant.customId || "",
      "Genus": plant.genus || "",
      "Species": plant.species || "",
      "Cultivar": plant.cultivar || "",
      "Mutation": plant.mutation || "",
      "Nickname": plant.nickname || "",
      "Origin": plant.origin || "",
      "Initial Type": plant.initialType || "",
      "Notes": plant.notes || "",
      "Date Added": plant.createdAt ? new Date(plant.createdAt).toLocaleDateString() : "",
      "Privacy": plant.isPublic ? "Public" : "Private",
      "Photo Count": plant.photos?.length || 0,
      "Growth Records": plant.growthRecords?.length || 0,
    }));
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      const data = prepareExportData();
      const csv = convertToCSV(data);
      downloadFile(csv, "my-cactus-collection.csv", "text/csv");
      
      toast({
        title: "Export Successful",
        description: "Your collection has been exported to CSV format. Import this file directly into Google Sheets, Excel, or other spreadsheet applications.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your collection to CSV.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const data = prepareExportData();
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      
      // Set column widths
      const colWidths = [
        { wch: 12 }, // Custom ID
        { wch: 15 }, // Genus
        { wch: 15 }, // Species
        { wch: 12 }, // Cultivar
        { wch: 12 }, // Mutation
        { wch: 15 }, // Nickname
        { wch: 12 }, // Origin
        { wch: 12 }, // Initial Type
        { wch: 30 }, // Notes
        { wch: 12 }, // Date Added
        { wch: 10 }, // Privacy
        { wch: 10 }, // Photo Count
        { wch: 12 }, // Growth Records
      ];
      worksheet['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, "My Cactus Collection");
      XLSX.writeFile(workbook, "my-cactus-collection.xlsx");
      
      toast({
        title: "Export Successful",
        description: "Your collection has been exported to Excel format (.xlsx).",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your collection to Excel.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const data = prepareExportData();
      const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
      
      // Add title
      doc.setFontSize(20);
      doc.text('My Cactus Collection', 20, 20);
      
      // Add export date
      doc.setFontSize(10);
      doc.text(`Exported on ${new Date().toLocaleDateString()}`, 20, 30);
      
      // Prepare table data
      const tableColumns = [
        'ID', 'Genus', 'Species', 'Cultivar', 'Nickname', 'Origin', 'Type', 'Privacy', 'Photos', 'Records'
      ];
      
      const tableRows = data.map(plant => [
        plant["Custom ID"],
        plant["Genus"],
        plant["Species"],  
        plant["Cultivar"],
        plant["Nickname"],
        plant["Origin"],
        plant["Initial Type"],
        plant["Privacy"],
        plant["Photo Count"].toString(),
        plant["Growth Records"].toString(),
      ]);
      
      // Add table
      doc.autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: 40,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [76, 175, 80], // Cactus green
          textColor: 255,
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 40, right: 10, bottom: 20, left: 10 },
      });
      
      doc.save("my-cactus-collection.pdf");
      
      toast({
        title: "Export Successful",
        description: "Your collection has been exported to PDF format.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your collection to PDF.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]?.toString() || '';
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          return value.includes(',') || value.includes('"') || value.includes('\n')
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportFormats = [
    {
      id: 'csv',
      name: 'CSV (Comma Separated Values)',
      description: 'Perfect for Google Sheets, Excel, and other spreadsheet applications',
      icon: FileSpreadsheet,
      action: exportToCSV,
      fileExtension: '.csv',
      recommended: true
    },
    {
      id: 'excel',
      name: 'Excel Workbook',
      description: 'Native Excel format with proper formatting and column widths',
      icon: FileText,
      action: exportToExcel,
      fileExtension: '.xlsx',
      recommended: false
    },
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'Formatted report perfect for printing and sharing',
      icon: File,
      action: exportToPDF,
      fileExtension: '.pdf',
      recommended: false
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Export My Collection
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Collection Summary</h3>
              <Badge variant="outline">{plants.length} plants total</Badge>
            </div>
            <p className="text-sm text-gray-600">
              Export includes plant details, taxonomic information, notes, privacy settings, 
              and counts for photos and growth records.
            </p>
          </div>

          <Separator />

          {/* Export Options */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Choose Export Format</h3>
            
            {exportFormats.map((format) => {
              const IconComponent = format.icon;
              return (
                <Card key={format.id} className="relative">
                  {format.recommended && (
                    <Badge className="absolute -top-2 -right-2 bg-cactus-green">
                      Recommended
                    </Badge>
                  )}
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <IconComponent className="w-5 h-5 mr-3 text-cactus-green" />
                      {format.name}
                      <span className="text-sm text-gray-500 font-normal ml-2">
                        ({format.fileExtension})
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-4">
                      {format.description}
                    </p>
                    <Button
                      onClick={format.action}
                      disabled={isExporting || plants.length === 0}
                      className="w-full bg-cactus-green hover:bg-cactus-green/90"
                    >
                      {isExporting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Export to {format.name}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {plants.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                You don't have any plants in your collection to export.
              </p>
              <Button variant="outline" onClick={onClose} className="mt-3">
                Close
              </Button>
            </div>
          )}

          {/* Google Sheets Info */}
          {plants.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                Import to Google Sheets
              </h4>
              <p className="text-sm text-blue-800">
                After downloading the CSV file, go to Google Sheets → File → Import → 
                Upload your CSV file. The data will be automatically formatted into columns.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}