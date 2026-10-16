import { Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useShare } from "@/hooks/use-share";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title: string;
  url: string;
  size?: "sm" | "default";
  className?: string;
}

export const ShareButton = ({
  title,
  url,
  size = "sm",
  className,
}: ShareButtonProps) => {
  const { share, isSharing } = useShare();

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      disabled={isSharing}
      onClick={() => void share({ title, text: title, url })}
      className={cn("gap-2 rounded-full", className)}
      aria-label={`Compartilhar ${title}`}
    >
      <Share2 aria-hidden="true" />
      Compartilhar
    </Button>
  );
};
