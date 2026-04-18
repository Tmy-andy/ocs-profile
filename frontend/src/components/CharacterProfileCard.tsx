import { Character } from '../types';
import Card from './Card';
import Section from './Section';
import Tag from './Tag';

interface CharacterProfileCardProps {
  character: Character;
}

const CharacterProfileCard: React.FC<CharacterProfileCardProps> = ({ character }) => {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Character Image */}
        <div className="lg:col-span-1">
          <Card className="p-0 overflow-hidden group">
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={character.avatarImage}
                alt={character.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60" />
              
              {/* Neon glow border effect */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                   style={{ boxShadow: '0 0 30px rgba(0, 212, 255, 0.5)' }} />
            </div>
          </Card>
        </div>

        {/* Character Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Name and ID */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold"
                style={{
                  background: 'linear-gradient(to right, #00d4ff, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
              {character.name}
            </h1>
            <p className="text-gray-500 text-sm font-mono">
              Character ID | {character.characterId || character.slug}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {character.tags.map((tag, index) => (
              <Tag key={index} variant="blue">{tag}</Tag>
            ))}
          </div>

          {/* About Section */}
          <Section title="About">
            <p className="text-base italic">"{character.about}"</p>
          </Section>

          {/* Backstory Section */}
          <Section title="Backstory">
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {character.backstory}
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default CharacterProfileCard;
