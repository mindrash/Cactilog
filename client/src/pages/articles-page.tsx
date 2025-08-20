import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, Tag, ArrowRight, BookOpen, Plus, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SEO } from "@/components/seo";

interface Article {
  id: string;
  title: string;
  excerpt?: string;
  slug: string;
  status: 'draft' | 'published';
  tags?: string[];
  category?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ArticlesResponse {
  items: Article[];
  total: number;
  page: number;
  pageCount: number;
}

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  
  // Check if user is admin (based on your existing admin logic)
  const isAdmin = user && (user.id === "45392487" || user.id === "google_115406590122470795501" || user.email === "tomlawson@gmail.com" || user.email === "hellomindrash@gmail.com");
  


  const { data: articlesData, isLoading, error } = useQuery<ArticlesResponse>({
    queryKey: ['/api/articles', { q: searchQuery, tag: selectedTag, page: currentPage }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedTag) params.append('tag', selectedTag);
      params.append('page', currentPage.toString());
      params.append('limit', '12');
      
      const response = await fetch(`/api/articles?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get all unique tags from articles for filtering
  const allTags = articlesData?.items.reduce((tags: string[], article) => {
    if (article.tags) {
      tags.push(...article.tags.filter(tag => !tags.includes(tag)));
    }
    return tags;
  }, []) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleTagFilter = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag("");
    } else {
      setSelectedTag(tag);
      setCurrentPage(1);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Unable to load articles</p>
            <p className="text-muted-foreground">Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen cactus-pattern-bg-light">
      <SEO 
        title="Cacti Articles - Cactilog"
        description="Discover expert care guides, growing tips, and community insights from fellow cacti enthusiasts."
      />
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
            <div className="flex-1">
              <h1 className="page-title-xl mb-2 text-forest">Cacti Articles</h1>
              <p className="text-gray-600">
                Discover expert care guides, growing tips, and community insights from fellow cacti enthusiasts.
              </p>
            </div>
          
            {/* Admin Controls */}
            {isAdmin && (
              <div className="flex gap-2 shrink-0">
                <Button asChild className="bg-cactus-green hover:bg-cactus-green/90">
                  <Link href="/admin/articles/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Article
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/articles">
                    <Edit className="h-4 w-4 mr-2" />
                    Manage Articles
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="outline">
              Search
            </Button>
          </form>

          {/* Tag filters */}
          {allTags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Filter by tag:</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer hover:bg-sage/20"
                    onClick={() => handleTagFilter(tag)}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Articles List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg border shadow-sm">
          {isLoading ? (
          <div className="divide-y">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-6 flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : articlesData?.items.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">No articles found</p>
            <p className="text-muted-foreground">
              {searchQuery || selectedTag 
                ? "Try adjusting your search or filters."
                : "Check back soon for new articles."
              }
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {articlesData?.items.map((article) => (
              <div key={article.id} className="p-6 hover:bg-sage/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-forest">
                        <Link href={`/articles/${article.slug}`} className="hover:text-sage transition-colors">
                          {article.title}
                        </Link>
                      </h3>
                      {article.category && (
                        <Badge variant="secondary" className="bg-sage/10 text-sage-600">
                          {article.category}
                        </Badge>
                      )}
                    </div>
                    
                    {article.excerpt && (
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {article.publishedAt 
                          ? format(new Date(article.publishedAt), "MMM d, yyyy")
                          : format(new Date(article.createdAt), "MMM d, yyyy")
                        }
                      </div>
                    </div>
                    
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {article.tags.slice(0, 4).map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="text-xs cursor-pointer hover:bg-sage/20"
                            onClick={() => handleTagFilter(tag)}
                          >
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.tags.length - 4}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center ml-4">
                    <Link href={`/articles/${article.slug}`}>
                      <Button variant="outline" className="bg-sage/10 hover:bg-sage/20 border-sage/30">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {articlesData && articlesData.pageCount > 1 && (
          <div className="flex justify-center space-x-2 p-6 border-t bg-sage/5">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, articlesData.pageCount) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              disabled={currentPage === articlesData.pageCount}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
      </div>
      <Footer />
    </div>
  );
}