import { forwardRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, id, type = "text", error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="items-center gap-4 my-2">
        <Label htmlFor={id}>{label}</Label>
        <div className="relative mt-2">
          <Input
            id={id}
            ref={ref}
            type={type === "password" && !showPassword ? "password" : "text"}
            {...props}
          />
          {type === "password" && (
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && <p className="text-start text-red-500 text-sm col-span-4">{error}</p>}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export { TextInput };
