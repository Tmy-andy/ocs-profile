interface SectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children, icon }) => {
  return (
    <div className="section-card">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neon-blue">
          {title}
        </h3>
      </div>
      <div className="text-gray-300 leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default Section;
