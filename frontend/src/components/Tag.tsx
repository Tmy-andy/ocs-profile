interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'sakura' | 'blue';
}

const Tag: React.FC<TagProps> = ({ children, variant = 'default' }) => {
  return (
    <span
      className={`tag ${
        variant === 'sakura'
          ? 'border-sakura-500/50 bg-sakura-500/10 text-sakura-300'
          : variant === 'blue'
          ? 'border-neon-blue/50 bg-neon-blue/10 text-neon-blue shadow-glow-blue'
          : ''
      }`}
    >
      {children}
    </span>
  );
};

export default Tag;
