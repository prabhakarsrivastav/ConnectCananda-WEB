import { useState } from "react";
import { Star, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface ReviewFormProps {
    serviceId: string;
    onSuccess: () => void;
}

export const ReviewForm = ({ serviceId, onSuccess }: ReviewFormProps) => {
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [name, setName] = useState("");
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use a hardcoded API URL if VITE_API_URL is missing to be safe
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:53456/api';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast({
                title: "Name Required",
                description: "Please enter your name.",
                variant: "destructive",
            });
            return;
        }

        if (!comment.trim()) {
            toast({
                title: "Comment Required",
                description: "Please write a comment.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/services/${serviceId}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    rating,
                    comment,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit review");
            }

            toast({
                title: "Success",
                description: "Thank you for your review!",
            });

            setComment("");
            setName("");
            onSuccess();
        } catch (error) {
            console.error("Error submitting review:", error);
            toast({
                title: "Error",
                description: "Failed to submit review. Check console for details.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#181a20] border border-[#2b3139] rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Leave a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label className="text-[#848e9c] mb-2 block text-sm">Overall Rating</Label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none transition-transform hover:scale-110"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >
                                <Star
                                    className={`h-6 w-6 ${(hover || rating) >= star
                                            ? "fill-[#fcd535] text-[#fcd535]"
                                            : "text-[#2b3139]"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <Label htmlFor="review-name" className="text-[#848e9c] mb-1.5 block text-sm">
                        Your Name
                    </Label>
                    <Input
                        id="review-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-[#0B0E11] border-[#2b3139] text-white"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <Label htmlFor="review-comment" className="text-[#848e9c] mb-1.5 block text-sm">
                        Comment
                    </Label>
                    <Textarea
                        id="review-comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="bg-[#0B0E11] border-[#2b3139] text-white min-h-[80px]"
                        placeholder="What did you think of the service?"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#fcd535] text-black hover:bg-[#fcd535]/90 w-full"
                >
                    {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Review
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
};
