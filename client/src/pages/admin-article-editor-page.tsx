import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Save, Eye, FileText, Loader2, Code, Type, Plus, X, Hash, ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { insertArticleSchema, type Article, type ArticleSection } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import DOMPurify from "dompurify";
import Header from "@/components/header";
import Footer from "@/components/footer";

// Create a form schema based on insertArticleSchema with additional validation
const articleFormSchema = insertArticleSchema.pick({
  title: true,
  sections: true,
  status: true,
  inlineStyles: true,
});

type ArticleFormData = z.infer<typeof articleFormSchema>;

// Helper function to extract table of contents from sections
const extractTableOfContents = (sections: ArticleSection[]) => {
  const tocItems: Array<{ id: string; title: string; level: number }> = [];
  
  sections.forEach((section) => {
    // Extract headings from the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = section.content;
    
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      const title = heading.textContent?.trim() || '';
      if (title) {
        // Create a unique ID for the heading if it doesn't have one
        let id = heading.id;
        if (!id) {
          id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
          heading.id = id;
        }
        tocItems.push({ id, title, level });
      }
    });
    
    // Update the section content with the modified HTML (with IDs added)
    section.content = tempDiv.innerHTML;
  });
  
  return tocItems;
};

// Helper function to generate excerpt from first section
const generateExcerpt = (sections: ArticleSection[], maxLength: number = 200): string => {
  if (!sections || sections.length === 0) return '';
  
  const firstSectionContent = sections[0].content;
  if (!firstSectionContent) return '';
  
  // Strip HTML tags and get plain text
  const plainText = firstSectionContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // Truncate at word boundary
  const truncated = plainText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
};

export default function AdminArticleEditorPage() {
  const params = useParams();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const articleId = params?.id;
  const isEditing = articleId && articleId !== 'new';
  const [isPreview, setIsPreview] = useState(false);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [tableOfContents, setTableOfContents] = useState<Array<{ id: string; title: string; level: number }>>([]);

  // Fetch article data if editing
  const { data: article, isLoading: isLoadingArticle } = useQuery<Article>({
    queryKey: ['/api/admin/articles', articleId],
    queryFn: async () => {
      const response = await apiRequest(`/api/admin/articles/${articleId}`, 'GET');
      return response.json();
    },
    enabled: !!isEditing,
  });

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: "",
      sections: [{ id: crypto.randomUUID(), content: "" }],
      status: "draft",
      inlineStyles: "",
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  // Update form when article data is loaded
  useEffect(() => {
    if (article && isEditing) {
      // Ensure sections is always an array
      const sections = Array.isArray(article.sections) 
        ? article.sections 
        : article.sections 
        ? [article.sections]
        : [{ id: crypto.randomUUID(), content: "" }];
      
      form.reset({
        title: article.title || "",
        sections: sections,
        status: (article.status as "draft" | "published") || "draft",
        inlineStyles: article.inlineStyles || "",
      });
    }
  }, [article, isEditing, form]);

  // Update table of contents when sections change
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (data.sections) {
        const toc = extractTableOfContents([...data.sections] as ArticleSection[]);
        setTableOfContents(toc);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Create/Update article mutation
  const createArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const endpoint = isEditing ? `/api/admin/articles/${articleId}` : '/api/admin/articles';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await apiRequest(endpoint, method, {
        title: data.title,
        sections: data.sections,
        status: data.status,
        inlineStyles: data.inlineStyles,
      });
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: isEditing ? "Article updated" : "Article created",
        description: isEditing ? "Your article has been updated successfully." : "Your article has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/articles'] });
      if (!isEditing) {
        setLocation(`/admin/articles/${data.id}/edit`);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save article",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ArticleFormData) => {
    createArticleMutation.mutate(data);
  };

  const addSection = () => {
    append({ id: crypto.randomUUID(), content: "" });
  };

  const removeSection = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      move(index, index - 1);
    } else if (direction === 'down' && index < fields.length - 1) {
      move(index, index + 1);
    }
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isLoadingArticle) {
    return (
      <div className="min-h-screen cactus-pattern-bg-light">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-cactus-green" />
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen cactus-pattern-bg-light">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button 
            onClick={() => setLocation('/admin/articles')}
            variant="ghost"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>{isEditing ? 'Edit Article' : 'Create Article'}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsHtmlMode(!isHtmlMode)}
                      className="flex items-center space-x-1"
                    >
                      {isHtmlMode ? <Type className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                      <span>{isHtmlMode ? 'Visual' : 'HTML'}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPreview(!isPreview)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Article Title */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Article Title</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter article title..."
                              className="text-lg font-medium"
                              disabled={isPreview}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Inline Styles */}
                    <FormField
                      control={form.control}
                      name="inlineStyles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom CSS Styles</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="/* Enter custom CSS styles for this article */&#10;.custom-class {&#10;  color: #4ade80;&#10;  font-weight: bold;&#10;}"
                              className="font-mono text-sm min-h-[120px]"
                              disabled={isPreview}
                            />
                          </FormControl>
                          <FormDescription>
                            Add custom CSS styles that will be applied only to this article.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Article Sections */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">Article Sections</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addSection}
                          className="flex items-center space-x-1"
                          disabled={isPreview}
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Section</span>
                        </Button>
                      </div>
                      
                      {fields.map((field, index) => (
                        <Card key={field.id} className="border-l-4 border-l-cactus-green/30">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium">Section {index + 1}</Label>
                              <div className="flex items-center space-x-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveSection(index, 'up')}
                                  disabled={isPreview || index === 0}
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveSection(index, 'down')}
                                  disabled={isPreview || index === fields.length - 1}
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSection(index)}
                                  disabled={isPreview || fields.length === 1}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <FormField
                              control={form.control}
                              name={`sections.${index}.content`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    {isPreview ? (
                                      <div 
                                        className="min-h-[200px] p-4 border rounded prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(field.value) }}
                                      />
                                    ) : (
                                      <Textarea
                                        {...field}
                                        placeholder={isHtmlMode ? "Enter HTML content..." : "Enter content (supports HTML)..."}
                                        className="min-h-[200px] font-mono"
                                        rows={8}
                                      />
                                    )}
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Article Status Control */}
                    <div className="pt-6 border-t">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem className="w-48">
                            <FormLabel>Article Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setLocation('/admin/articles')}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createArticleMutation.isPending}
                        className="bg-cactus-green hover:bg-cactus-green/90"
                      >
                        {createArticleMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            {isEditing ? 'Update Article' : 'Create Article'}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Table of Contents Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Hash className="w-4 h-4" />
                  <span>Table of Contents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tableOfContents.length > 0 ? (
                  <nav className="space-y-1">
                    {tableOfContents.map((item, index) => (
                      <button
                        key={`${item.id}-${index}`}
                        type="button"
                        onClick={() => scrollToHeading(item.id)}
                        className={`block w-full text-left text-sm text-gray-600 hover:text-cactus-green hover:underline py-1 ${'pl-' + (item.level - 1) * 4}`}
                        style={{ paddingLeft: `${(item.level - 1) * 16}px` }}
                      >
                        {item.title}
                      </button>
                    ))}
                  </nav>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Add headings (H1-H6) to your sections to generate a table of contents
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}