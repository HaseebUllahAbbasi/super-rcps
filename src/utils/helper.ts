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
  
      // Add more cases here if needed
    });
  
    return style;
  };