import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Tag, User, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SEO } from "@/components/seo";

interface Article {
  id: string;
  title: string;
  html: string;
  excerpt?: string;
  slug: string;
  status: 'draft' | 'published';
  tags?: string[];
  category?: string;
  author?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: ['/api/articles/slug', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No slug provided');
      
      const response = await fetch(`/api/articles/slug/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Article not found');
        }
        throw new Error('Failed to fetch article');
      }
      return response.json();
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-8 px-4 max-w-4xl">
          <div className="mb-6">
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <div className="flex space-x-4 mb-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-18" />
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-8 px-4 max-w-4xl">
          <div className="mb-6">
            <Link href="/articles">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Articles
              </Button>
            </Link>
          </div>
          
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Article not found</p>
              <p className="text-muted-foreground">
                {error instanceof Error && error.message === 'Article not found'
                  ? "This article doesn't exist or has been removed."
                  : "There was an error loading this article."
                }
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  // Set document title and meta description if available
  if (typeof document !== 'undefined') {
    document.title = article.metaTitle || article.title || 'Article - Cactilog';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && (article.metaDescription || article.excerpt)) {
      metaDescription.setAttribute('content', article.metaDescription || article.excerpt || '');
    }
  }

  return (
    <>
      <SEO 
        title={article.metaTitle || `${article.title} - Cactilog`}
        description={article.metaDescription || article.excerpt || `Read ${article.title} on Cactilog - expert cacti care guides and growing tips.`}
      />
      <Header />
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/articles">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-forest leading-tight">
            {article.title}
          </h1>
          
          {article.excerpt && (
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {article.excerpt}
            </p>
          )}
          
          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
            {article.publishedAt && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Published {format(new Date(article.publishedAt), "MMMM d, yyyy")}
              </div>
            )}
            
            {article.author && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {article.author}
              </div>
            )}
            
            {article.category && (
              <Badge variant="secondary">
                {article.category}
              </Badge>
            )}
          </div>
          
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link key={tag} href={`/articles?tag=${encodeURIComponent(tag)}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-sage/20">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Article Content */}
        <Card>
          <CardContent className="pt-6">
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
                prose-pre:bg-gray-100 prose-pre:border prose-pre:rounded-lg prose-pre:p-4
                prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto
                dark:prose-invert dark:prose-headings:text-white 
                dark:prose-p:text-gray-300 dark:prose-a:text-sage-light
                dark:prose-strong:text-white dark:prose-li:text-gray-300
                dark:prose-blockquote:text-gray-400 dark:prose-code:bg-gray-800
                dark:prose-pre:bg-gray-800"
              dangerouslySetInnerHTML={{ __html: article.html }}
            />
          </CardContent>
        </Card>

        {/* Back to Articles Footer */}
        <div className="mt-8 pt-8 border-t">
          <Link href="/articles">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Articles
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}