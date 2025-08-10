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
import { ArrowLeft, Save, Eye, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { insertArticleSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import DOMPurify from "dompurify";

// Create a form schema based on insertArticleSchema with additional validation
const articleFormSchema = insertArticleSchema.extend({
  tags: z.array(z.string()).optional(),
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
  const [tagsInput, setTagsInput] = useState("");

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
      slug: "",
      status: "draft",
      tags: [],
      category: "",
      author: "",
      metaTitle: "",
      metaDescription: "",
      publishNow: false,
    },
  });

  // Populate form when article data is loaded
  useEffect(() => {
    if (article) {
      form.reset({
        title: article.title || "",
        html: article.html || "",
        excerpt: article.excerpt || "",
        slug: article.slug || "",
        status: article.status || "draft",
        tags: article.tags || [],
        category: article.category || "",
        author: article.author || "",
        metaTitle: article.metaTitle || "",
        metaDescription: article.metaDescription || "",
        publishNow: false,
      });
      setTagsInput(article.tags?.join(", ") || "");
    }
  }, [article, form]);

  // Auto-generate slug from title
  const watchTitle = form.watch("title");
  useEffect(() => {
    if (watchTitle && !isEditing) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue("slug", slug);
    }
  }, [watchTitle, isEditing, form]);


  const createArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const response = await apiRequest('POST', '/api/admin/articles', data);
      return response.json();
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
      toast({
        title: "Create failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const response = await apiRequest('PUT', `/api/admin/articles/${articleId}`, data);
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
    // Parse tags from input
    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const articleData = {
      ...data,
      tags,
      status: data.publishNow ? 'published' as const : data.status,
      publishedAt: data.publishNow ? new Date().toISOString() : undefined,
    };

    // Remove publishNow from the data as it's not in the schema
    delete (articleData as any).publishNow;

    if (isEditing) {
      updateArticleMutation.mutate(articleData);
    } else {
      createArticleMutation.mutate(articleData);
    }
  };

  const isLoading = createArticleMutation.isPending || updateArticleMutation.isPending;

  if (isEditing && isLoadingArticle) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
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
                              placeholder="Brief summary of the article..." 
                              rows={3}
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            A short summary that appears in article listings
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
                            <Textarea 
                              placeholder="Write your article content here..." 
                              rows={15}
                              className="text-sm"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Write your article content. You can use basic HTML tags if needed.
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

                <Card>
                  <CardHeader>
                    <CardTitle>Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="article-url-slug" {...field} />
                          </FormControl>
                          <FormDescription>
                            The URL path for this article
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="Care Guide, Tips, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author</FormLabel>
                          <FormControl>
                            <Input placeholder="Author name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        placeholder="care, watering, propagation"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Separate tags with commas
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>SEO</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="metaTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Title</FormLabel>
                          <FormControl>
                            <Input placeholder="SEO title..." {...field} />
                          </FormControl>
                          <FormDescription>
                            Title that appears in search results
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="SEO description..." 
                              rows={3}
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Description that appears in search results
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}