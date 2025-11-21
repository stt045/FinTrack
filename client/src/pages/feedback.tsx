import { useState, useEffect, useRef, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Send } from "lucide-react";
import type { Feedback, User } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function FeedbackPage() {
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const { user, isLoading } = useAuth();

  // Auto-populate name and email from logged-in user
  useEffect(() => {
    if (user && !isLoading) {
      const typedUser = user as User | null;
      if (typedUser) {
        const fullName = [typedUser.firstName, typedUser.lastName]
          .filter(Boolean)
          .join(" ")
          .trim();
        setName(fullName || "");
        setEmail(typedUser.email || "");
      }
    }
  }, [user, isLoading]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["feedback"],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const url = pageParam
        ? `/api/feedback?limit=20&cursor=${pageParam}`
        : "/api/feedback?limit=20";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch feedback");
      return response.json() as Promise<Feedback[]>;
    },
    getNextPageParam: (lastPage: Feedback[]) => {
      if (lastPage.length === 0) return undefined;
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem.createdAt.toString();
    },
    initialPageParam: undefined as string | undefined,
  });

  const createFeedbackMutation = useMutation({
    mutationFn: async (feedbackData: {
      comment: string;
      name?: string;
      email?: string;
      isAnonymous: boolean;
    }) => {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });
      if (!response.ok) throw new Error("Failed to submit feedback");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
      setComment("");
      setIsAnonymous(false);
      // Reset name/email only if not logged in
      if (!user) {
        setName("");
        setEmail("");
      }
      toast({
        title: "Feedback submitted!",
        description: "Thank you for your feedback.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment.",
        variant: "destructive",
      });
      return;
    }

    createFeedbackMutation.mutate({
      comment: comment.trim(),
      name: isAnonymous ? undefined : name.trim() || undefined,
      email: isAnonymous ? undefined : email.trim() || undefined,
      isAnonymous,
    });
  };

  const setupObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    setupObserver();
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [setupObserver]);

  const allFeedback = data?.pages.flatMap((page) => page) ?? [];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Feedback</h1>
          <p className="text-muted-foreground mt-2">
            We'd love to hear your thoughts about FinPlan!
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Share Your Feedback</CardTitle>
            <CardDescription>
              Help us improve by sharing your experience, suggestions, or reporting issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="comment">Your Comment *</Label>
                <Textarea
                  id="comment"
                  data-testid="input-comment"
                  placeholder="Tell us what you think..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  data-testid="checkbox-anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                />
                <Label htmlFor="anonymous" className="cursor-pointer">
                  Post anonymously
                </Label>
              </div>

              {!isAnonymous && !user && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name (optional)</Label>
                    <Input
                      id="name"
                      data-testid="input-name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input
                      id="email"
                      data-testid="input-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {!isAnonymous && user && (
                <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium">Your information</p>
                  <div className="space-y-1">
                    <p className="text-sm text-foreground">{name || "Your name"}</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                data-testid="button-submit"
                disabled={createFeedbackMutation.isPending}
                className="w-full sm:w-auto"
              >
                <Send className="h-4 w-4 mr-2" />
                {createFeedbackMutation.isPending ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Community Feedback
            </CardTitle>
            <CardDescription>See what others are saying</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              ref={scrollRef}
              className="space-y-4 max-h-[600px] overflow-y-auto pr-2"
            >
              {allFeedback.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No feedback yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                <>
                  {allFeedback.map((item) => (
                    <div
                      key={item.id}
                      data-testid={`feedback-${item.id}`}
                      className="border rounded-lg p-4 space-y-2 bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="font-medium"
                              data-testid={`text-name-${item.id}`}
                            >
                              {item.isAnonymous || !item.name
                                ? "Anonymous"
                                : item.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              •
                            </span>
                            <span
                              className="text-xs text-muted-foreground"
                              data-testid={`text-date-${item.id}`}
                            >
                              {formatDistanceToNow(new Date(item.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <p
                            className="text-sm text-foreground whitespace-pre-wrap"
                            data-testid={`text-comment-${item.id}`}
                          >
                            {item.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={loadMoreRef} className="h-4" />
                  {isFetchingNextPage && (
                    <div className="text-center py-4 text-muted-foreground">
                      Loading more...
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
