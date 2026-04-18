import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Character, RelationshipLink } from '../types';
import characterService from '../services/characterService';
import authService from '../services/authService';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';

const STATUS_LABEL: Record<string, string> = {
  single: 'Độc thân',
  dating: 'Hẹn hò',
  married: 'Hôn nhân',
  'single-parent': 'Đơn thân',
};

const isEmpty = (v: any) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');

const anyFilled = (obj: any, keys: string[]) => keys.some(k => !isEmpty(obj?.[k]));

const SectionBox = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="p-6 rounded-2xl bg-gradient-to-br from-dark-lighter/80 to-dark/80 border-2 backdrop-blur-sm"
       style={{ borderColor: '#00d4ff', boxShadow: '0 0 10px rgba(0, 212, 255, 0.4)' }}>
    <h2 className="text-neon-blue text-sm font-bold uppercase tracking-wider mb-3">{title}</h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const Row = ({ label, value }: { label: string; value?: string }) => {
  if (isEmpty(value)) return null;
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-gray-200 whitespace-pre-wrap">{value}</span>
    </div>
  );
};

const Block = ({ label, value }: { label: string; value?: string }) => {
  if (isEmpty(value)) return null;
  return (
    <div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{value}</p>
    </div>
  );
};

const RelLink = ({ link }: { link: RelationshipLink }) => {
  const parts: React.ReactNode[] = [];
  if (link.description) parts.push(<span key="d" className="text-gray-200">{link.description}</span>);

  if (link.character && typeof link.character === 'object') {
    const c: any = link.character;
    const ownerSlug = c.owner?.slug || c.owner?.username;
    const to = ownerSlug ? `/${ownerSlug}/character/${c.slug || c._id}` : `/character/${c._id}`;
    parts.push(
      <Link key="c" to={to} className="text-neon-blue hover:underline ml-2">→ {c.name}</Link>
    );
  } else if (link.text) {
    const text = link.text.trim();
    const isUrl = /^(https?:\/\/|\/)/i.test(text);
    if (isUrl) {
      parts.push(
        <a key="t" href={text} target={text.startsWith('http') ? '_blank' : undefined}
           rel="noopener noreferrer" className="text-neon-blue hover:underline ml-2">→ {text}</a>
      );
    } else {
      parts.push(<span key="t" className="text-gray-400 ml-2">— {text}</span>);
    }
  }
  return <div className="flex flex-wrap items-center">{parts}</div>;
};

const CharacterPage = () => {
  const { id, characterSlug, slug: ownerSlug } = useParams<{ id?: string; characterSlug?: string; slug?: string }>();
  const lookupKey = characterSlug || id;
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacter = async () => {
    if (!lookupKey) return;
    try {
      setLoading(true);
      setError(null);
      const response = await characterService.getById(lookupKey);
      setCharacter(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load character');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCharacter(); }, [lookupKey]);

  const goBack = () => {
    if (ownerSlug) navigate(`/${ownerSlug}`);
    else if (character?.owner && typeof character.owner === 'object')
      navigate(`/${character.owner.slug || character.owner.username}`);
    else navigate('/');
  };

  if (loading) return <div className="min-h-screen py-8"><LoadingSkeleton /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center"><ErrorMessage message={error} onRetry={fetchCharacter} /></div>;
  if (!character) return <div className="min-h-screen flex items-center justify-center"><ErrorMessage message="Character not found" /></div>;

  const core = character.core || {};
  const visual = character.visual || {};
  const aesthetics = character.aesthetics || {};
  const details = character.details || {};
  const additional = character.additional || {};
  const complexRels = character.complexRelationships || [];

  const coreBasic = anyFilled(core, ['fullName', 'gender', 'birthday', 'age', 'mbti']);
  const coreAppearance = anyFilled(core, ['appearance', 'physique']);
  const coreWork = anyFilled(core, ['occupation', 'workplace']);
  const coreOther =
    !isEmpty(core.nationality) || !isEmpty(core.residence) || !isEmpty(core.relationshipStatus) ||
    !isEmpty(core.partner?.description) || !isEmpty(core.partner?.text) || !!core.partner?.character;
  const corePersonality = !isEmpty(core.personality);
  const hasCore = coreBasic || coreAppearance || coreWork || coreOther || corePersonality;

  const hasVisual = anyFilled(visual, ['face', 'hair', 'skin']);
  const hasAesthetics = anyFilled(aesthetics, ['outfit', 'colorPalette', 'accessories', 'inspiration']);
  const hasDetails = anyFilled(details, ['habits', 'flaws', 'likes', 'dislikes', 'intimateLife']);
  const hasComplex = complexRels.length > 0;
  const hasBackstory = !isEmpty(character.backstory);
  const hasAdditional = anyFilled(additional, ['skills', 'assets', 'secrets', 'other']);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a1f] to-[#0a0a0f] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button onClick={goBack} className="flex items-center gap-2 text-gray-400 hover:text-neon-blue">
            <span>←</span><span>Quay lại</span>
          </button>
          {authService.isAuthenticated() && (
            <button onClick={() => navigate(`/edit/${character._id}`)}
              className="px-4 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue border border-neon-blue/50 rounded-lg">
              Chỉnh sửa
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-[500px_1fr] gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="sticky top-8">
              <div className="relative p-[3px] rounded-2xl"
                   style={{ background: 'linear-gradient(135deg, #00d4ff, #3b82f6, #00d4ff)' }}>
                <div className="bg-dark rounded-2xl overflow-hidden">
                  {character.avatarImage ? (
                    <img src={character.avatarImage} alt={character.name} className="w-full aspect-[3/4] object-cover" />
                  ) : (
                    <div className="w-full aspect-[3/4] flex items-center justify-center text-gray-500">
                      Chưa có ảnh
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-bold mb-2 tracking-tight"
                  style={{
                    background: 'linear-gradient(to right, #00d4ff, #3b82f6)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                  }}>
                {character.name}
              </h1>
              <p className="text-gray-500 text-sm font-mono">ID | {character.slug || character.characterId}</p>
              {character.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {character.tags.map((t, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-sm border text-neon-blue"
                      style={{ backgroundColor: 'rgba(0, 212, 255, 0.1)', borderColor: '#00d4ff' }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 1. Core */}
            {hasCore && (
              <SectionBox title="1. Thông tin cốt lõi">
                {coreBasic && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">A. Cơ bản</p>
                    <Row label="Họ và tên" value={core.fullName} />
                    <Row label="Giới tính" value={core.gender} />
                    <Row label="Sinh nhật" value={core.birthday} />
                    <Row label="Độ tuổi" value={core.age} />
                    <Row label="MBTI" value={core.mbti} />
                  </div>
                )}
                {coreAppearance && (
                  <div className="pt-2 border-t border-neon-blue/20">
                    <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">B. Ngoại hình</p>
                    <Block label="Ngoại hình" value={core.appearance} />
                    <Row label="Chiều cao/Thể hình" value={core.physique} />
                  </div>
                )}
                {coreWork && (
                  <div className="pt-2 border-t border-neon-blue/20">
                    <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">C. Học tập / Công việc</p>
                    <Row label="Nghề nghiệp" value={core.occupation} />
                    <Row label="Nơi làm việc" value={core.workplace} />
                  </div>
                )}
                {coreOther && (
                  <div className="pt-2 border-t border-neon-blue/20">
                    <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">D. Khác</p>
                    <Row label="Quốc tịch" value={core.nationality} />
                    <Row label="Nơi ở" value={core.residence} />
                    {!isEmpty(core.relationshipStatus) && (
                      <div className="grid grid-cols-[140px_1fr] gap-3">
                        <span className="text-gray-400 text-sm">Tình trạng</span>
                        <div>
                          <span className="text-gray-200">{STATUS_LABEL[core.relationshipStatus!]}</span>
                          {(core.partner?.description || core.partner?.text || core.partner?.character) && (
                            <div className="mt-1">
                              <RelLink link={core.partner!} />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {corePersonality && (
                  <div className="pt-2 border-t border-neon-blue/20">
                    <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">E. Tính cách</p>
                    <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{core.personality}</p>
                  </div>
                )}
              </SectionBox>
            )}

            {/* 2. Visual */}
            {hasVisual && (
              <SectionBox title="2. Đặc điểm nhận dạng vật lý">
                <Block label="Khuôn mặt" value={visual.face} />
                <Block label="Mái tóc" value={visual.hair} />
                <Block label="Làn da" value={visual.skin} />
              </SectionBox>
            )}

            {/* 3. Aesthetics */}
            {hasAesthetics && (
              <SectionBox title="3. Phong cách & diện mạo">
                <Block label="Trang phục đặc trưng" value={aesthetics.outfit} />
                <Block label="Bảng màu" value={aesthetics.colorPalette} />
                <Block label="Phụ kiện đi kèm" value={aesthetics.accessories} />
                <Block label="Cảm hứng" value={aesthetics.inspiration} />
              </SectionBox>
            )}

            {/* 4. Details */}
            {hasDetails && (
              <SectionBox title="4. Chi tiết bổ trợ">
                <Block label="Thói quen / Biểu hiện đặc trưng" value={details.habits} />
                <Block label="Khuyết điểm" value={details.flaws} />
                <Block label="Sở thích" value={details.likes} />
                <Block label="Không thích" value={details.dislikes} />
                <Block label="Cuộc sống tình dục & Thân mật" value={details.intimateLife} />
              </SectionBox>
            )}

            {/* Complex relationships */}
            {hasComplex && (
              <SectionBox title="Mối quan hệ phức tạp">
                {complexRels.map((r, i) => (
                  <div key={i} className="pb-2 border-b border-neon-blue/10 last:border-0">
                    <RelLink link={r} />
                  </div>
                ))}
              </SectionBox>
            )}

            {/* Backstory */}
            {hasBackstory && (
              <SectionBox title="Backstory">
                <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{character.backstory}</p>
              </SectionBox>
            )}

            {/* 5. Additional */}
            {hasAdditional && (
              <SectionBox title="5. Bổ sung thêm">
                <Block label="Kỹ năng & Năng lực" value={additional.skills} />
                <Block label="Tài sản" value={additional.assets} />
                <Block label='Một số điều chỉ "người ấy" biết' value={additional.secrets} />
                <Block label="Khác" value={additional.other} />
              </SectionBox>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;
