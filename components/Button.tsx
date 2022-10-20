type ButtonProps = {
  label: string;
  size: "sm" | "md" | "lg" | "xl";
  onClick: () => void;
  primary?: boolean;
  icon?: any;
};
export const Button = ({
  label,
  primary,
  size,
  onClick,
  icon,
}: ButtonProps) => {
  let sizeClass;
  switch (size) {
    case "sm":
      sizeClass = "text-xs";
      break;
    case "md":
      sizeClass = "text-base";
      break;
    case "lg":
      sizeClass = "text-lg";
      break;
    case "xl":
      sizeClass = "text-7xl";
      break;
  }

  return (
    <button
      className={`border ${sizeClass} ${primary ? "bg-blue-600" : ""} flex`}
      onClick={onClick}
    >
      <span className={`${icon ? "w-7" : "hidden"}`}>{icon}</span>
      {label}
    </button>
  );
};
