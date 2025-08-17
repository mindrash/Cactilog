import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
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
import { ArrowLeft, Save, Eye, FileText, Loader2, Code, Type } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { insertArticleSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import DOMPurify from "dompurify";
import Header from "@/components/header";
import Footer from "@/components/footer";

// Create a form schema based on insertArticleSchema with additional validation
const articleFormSchema = insertArticleSchema.pick({
  title: true,
  html: true,
  excerpt: true,
  status: true,
}).extend({
  publishNow: z.boolean().optional(),
});

type ArticleFormData = z.infer<typeof articleFormSchema>;

interface Article extends ArticleFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminArticleEditorPage() {
  const params = useParams();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const articleId = params?.id;
  const isEditing = articleId && articleId !== 'new';
  const [isPreview, setIsPreview] = useState(false);
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  // Function to auto-generate excerpt from HTML content
  const generateExcerpt = (html: string, maxLength: number = 200): string => {
    if (!html) return '';
    
    // Strip HTML tags and get plain text
    const plainText = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    
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

  // Fetch article data if editing
  const { data: article, isLoading: isLoadingArticle } = useQuery<Article>({
    queryKey: ['/api/admin/articles', articleId],
    queryFn: async () => {
      if (!articleId || articleId === 'new') return null;
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }
      return response.json();
    },
    enabled: !!isEditing,
    staleTime: 0,
  });

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: "",
      html: "",
      excerpt: "",
      status: "published",
      publishNow: true,
    },
  });

  // Populate form when article data is loaded
  useEffect(() => {
    if (article) {
      form.reset({
        title: article.title || "",
        html: article.html || "",
        excerpt: article.excerpt || "",
        status: article.status || "draft",
        publishNow: false,
      });
    }
  }, [article, form]);

  // Auto-update excerpt when HTML content changes (for new articles only)
  useEffect(() => {
    if (!isEditing) { // Only auto-generate for new articles
      const subscription = form.watch((value, { name }) => {
        if (name === 'html' && value.html) {
          const autoExcerpt = generateExcerpt(value.html);
          if (autoExcerpt && autoExcerpt !== value.excerpt) {
            form.setValue('excerpt', autoExcerpt, { shouldValidate: false });
          }
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [form, isEditing]);


  const createArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      console.log("Making API request to create article:", data);
      try {
        const response = await apiRequest('/api/admin/articles', 'POST', data);
        console.log("API response received:", response.status);
        const result = await response.json();
        console.log("Article created successfully:", result);
        return result;
      } catch (error) {
        console.error("API request failed:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast({
        title: "Article created",
        description: "The article has been successfully created.",
      });
      setLocation('/admin/articles');
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Create failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const response = await apiRequest(`/api/admin/articles/${articleId}`, 'PUT', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/articles', articleId] });
      toast({
        title: "Article updated",
        description: "The article has been successfully updated.",
      });
      setLocation('/admin/articles');
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ArticleFormData) => {
    console.log("Form submitted with data:", data);

    // Auto-generate SEO fields
    const metaTitle = data.title ? `${data.title} - Cactilog` : 'Cactilog Article';
    const metaDescription = data.excerpt || 
      (data.html ? data.html.replace(/<[^>]*>/g, '').substring(0, 155) + '...' : 'Expert care guides and tips for cactus and succulent enthusiasts.');

    // Auto-generate slug from title
    const slug = data.title ? data.title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim() : 'untitled-article';

    const articleData = {
      ...data,
      slug,
      tags: [], // Empty array for now
      category: '', // Empty for now
      author: 'Cactilog Team', // Default author
      metaTitle,
      metaDescription,
      status: data.publishNow ? 'published' as const : data.status,
    };

    // Remove publishNow from the data as it's not in the schema
    delete (articleData as any).publishNow;

    console.log("Processed article data:", articleData);

    if (isEditing) {
      updateArticleMutation.mutate(articleData);
    } else {
      createArticleMutation.mutate(articleData);
    }
  };

  const isLoading = createArticleMutation.isPending || updateArticleMutation.isPending;

  if (isEditing && isLoadingArticle) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/admin/articles')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
          <h1 className="text-3xl font-bold text-forest">
            {isEditing ? 'Edit Article' : 'New Article'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* HTML/Rich Text Toggle */}
          <Button
            variant="outline"
            onClick={() => {
              console.log('Toggle clicked, current mode:', isHtmlMode);
              setIsHtmlMode(!isHtmlMode);
            }}
            disabled={isPreview}
          >
            {isHtmlMode ? <Type className="h-4 w-4 mr-2" /> : <Code className="h-4 w-4 mr-2" />}
            {isHtmlMode ? 'Rich Text' : 'HTML'}
          </Button>
          {/* Preview Toggle */}
          <Button
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
            disabled={!form.watch("html")}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>

      {isPreview ? (
        /* Preview Mode */
        <Card>
          <CardHeader>
            <CardTitle>{form.watch("title") || "Untitled Article"}</CardTitle>
            {form.watch("excerpt") && (
              <p className="text-lg text-muted-foreground">{form.watch("excerpt")}</p>
            )}
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-lg max-w-none
                prose-headings:text-forest prose-headings:font-semibold
                prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-sage prose-a:no-underline hover:prose-a:underline
                prose-strong:text-forest prose-strong:font-semibold
                prose-ul:space-y-2 prose-ol:space-y-2
                prose-li:text-gray-700
                prose-blockquote:border-l-4 prose-blockquote:border-sage/20 
                prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600
                prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-100 prose-pre:border prose-pre:rounded-lg prose-pre:p-4"
              dangerouslySetInnerHTML={{ __html: form.watch("html") || "<p>No content yet.</p>" }}
            />
          </CardContent>
        </Card>
      ) : (
        /* Edit Mode */
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter article title..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={isEditing ? "Brief summary of the article..." : "Auto-generated from content..."} 
                              rows={3}
                              readOnly={!isEditing}
                              className={!isEditing ? "bg-muted text-muted-foreground" : ""}
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            {isEditing 
                              ? "A short summary that appears in article listings" 
                              : "Auto-generated from article content (editable after saving)"
                            }
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="html"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Article Content</FormLabel>
                          <FormControl>
                            {isHtmlMode ? (
                              <Textarea
                                placeholder="Paste or write raw HTML content here..."
                                className="min-h-[400px] font-mono text-sm"
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            ) : (
                              <div className="border rounded-md">
                                <div 
                                  contentEditable
                                  className="min-h-[400px] p-3 prose prose-sm max-w-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                  style={{ whiteSpace: 'pre-wrap' }}
                                  onBlur={(e) => {
                                    field.onChange(e.currentTarget.innerHTML);
                                  }}
                                  onInput={(e) => {
                                    // Update the field value when content changes
                                    field.onChange(e.currentTarget.innerHTML);
                                  }}
                                  onPaste={(e) => {
                                    e.preventDefault();
                                    const paste = e.clipboardData?.getData('text/html') || e.clipboardData?.getData('text/plain') || '';
                                    if (paste) {
                                      // Clean and sanitize pasted HTML
                                      const cleanHtml = DOMPurify.sanitize(paste, {
                                        ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'img', 'span', 'div'],
                                        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style']
                                      });
                                      document.execCommand('insertHTML', false, cleanHtml);
                                    }
                                  }}
                                  suppressContentEditableWarning={true}
                                  ref={(el) => {
                                    if (el && field.value && el.innerHTML !== field.value) {
                                      el.innerHTML = field.value;
                                    }
                                  }}
                                />
                              </div>
                            )}
                          </FormControl>
                          <FormDescription>
                            {isHtmlMode 
                              ? "Raw HTML mode - paste or edit HTML directly. Use the toggle to switch back to rich text editor."
                              : "Rich text editor with HTML support. Use keyboard shortcuts for formatting (Ctrl+B for bold, Ctrl+I for italic, etc.)."
                            }
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Publish</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="publishNow"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Publish immediately</FormLabel>
                            <FormDescription>
                              Set status to published and set publish date to now
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="pt-4 border-t">
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {isEditing ? 'Update Article' : 'Create Article'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>




              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
    <Footer />
    </>
  );
}