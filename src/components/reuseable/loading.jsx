// components/ui/LoadingScreen.tsx
import { LoaderPinwheel } from "lucide-react";

const LoadingScreen = ({ text = "Loading...", fullScreen = false }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-muted-foreground ${
        fullScreen ? "h-[80vh]" : "py-10"
      }`}
    >
      <LoaderPinwheel className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm">{text}</p>
    </div>
  );
};

export { LoadingScreen};
