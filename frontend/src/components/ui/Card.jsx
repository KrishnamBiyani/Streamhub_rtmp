const Card = ({ className = "", children, ...props }) => (
  <div
    className={`rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
