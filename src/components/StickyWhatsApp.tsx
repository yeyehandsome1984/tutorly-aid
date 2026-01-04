import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const StickyWhatsApp = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip/Message */}
      {isExpanded && (
        <div className="bg-card border border-border rounded-lg shadow-elevated p-4 max-w-[280px] animate-in slide-in-from-bottom-2 fade-in duration-200">
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="text-sm font-medium mb-2">Need help with your studies?</p>
          <p className="text-xs text-muted-foreground mb-3">
            Chat with us on WhatsApp for quick enquiries about tuition classes.
          </p>
          <a
            href="https://wa.me/6585116415?text=Hi%2C%20I%27m%20interested%20in%20tuition%20classes."
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button size="sm" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Chat
            </Button>
          </a>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-14 w-14 rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-elevated flex items-center justify-center transition-all hover:scale-105"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </button>
    </div>
  );
};

export default StickyWhatsApp;
