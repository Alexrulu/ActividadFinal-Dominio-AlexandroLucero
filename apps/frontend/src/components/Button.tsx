type ButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Button({ children, className }: ButtonProps) {
  return (
    <button className={`bg-cyan-700 rounded-lg py-1 px-2 text-sm border-1 border-cyan-500 ${className ?? ''}`}>
      {children}
    </button>
  );
}