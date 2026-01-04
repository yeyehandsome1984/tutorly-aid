import { MessageCircle, Send, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      className: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
    },
    {
      name: "Telegram",
      icon: Send,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      className: "bg-[hsl(200,80%,50%)] hover:bg-[hsl(200,80%,45%)] text-white",
    },
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        // User cancelled
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">Share:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.name}`}
        >
          <Button size="sm" className={link.className}>
            <link.icon className="h-4 w-4 mr-1" />
            {link.name}
          </Button>
        </a>
      ))}
      {typeof navigator !== "undefined" && navigator.share && (
        <Button size="sm" variant="outline" onClick={handleNativeShare}>
          <Share2 className="h-4 w-4 mr-1" />
          More
        </Button>
      )}
    </div>
  );
};

export default ShareButtons;
