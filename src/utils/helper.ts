import { JwtPayload } from "@/types";
import { jwtDecode } from "jwt-decode";

export const tailwindToInlineStyle = (classString: string): React.CSSProperties => {
    const style: React.CSSProperties = {};
    const classes = classString.split(/\s+/);
  
    classes.forEach(cls => {
      if (cls.startsWith('!bg-[')) {
        const color = cls.match(/!bg-\[(.+?)\]/)?.[1];
        if (color) style.backgroundColor = color;
      }
  
      if (cls.startsWith('!text-[')) {
        const color = cls.match(/!text-\[(.+?)\]/)?.[1];
        if (color) style.color = color;
      }

       if (cls.startsWith('!border-[')) {
        const color = cls.match(/!text-\[(.+?)\]/)?.[1];
        if (color) {
           style.borderColor = color;
            style.borderWidth = '2px';
        }
      }
  
      // Add more cases here if needed
    });
  
    return style;
  };


  export const verifyJwtToken = (token: string) => {
  try {
    const decoded :JwtPayload= jwtDecode(token||"");
    return { user: decoded, success: Boolean(decoded) };
  } catch (error) {
    return { user: null, success: false,error };
  }
}
