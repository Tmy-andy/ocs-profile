import { useEffect, useState } from 'react';
import { Character, RelationshipStatus } from '../types';
import characterService from '../services/characterService';
import ImageUpload from './ImageUpload';

type FormData = {
  name: string;
  avatarImage: string;
  tags: string[];
  isPublic: boolean;
  core: {
    fullName: string;
    gender: string;
    birthday: string;
    age: string;
    mbti: string;
    appearance: string;
    physique: string;
    occupation: string;
    workplace: string;
    nationality: string;
    residence: string;
    relationshipStatus: RelationshipStatus;
    partner: { description: string; character: string; text: string };
    personality: string;
  };
  visual: { face: string; hair: string; skin: string };
  aesthetics: { outfit: string; colorPalette: string; accessories: string; inspiration: string };
  details: { habits: string; flaws: string; likes: string; dislikes: string; intimateLife: string };
  complexRelationships: { description: string; character: string; text: string }[];
  backstory: string;
  additional: { skills: string; assets: string; secrets: string; other: string };
};

const emptyForm: FormData = {
  name: '',
  avatarImage: '',
  tags: [],
  isPublic: true,
  core: {
    fullName: '', gender: '', birthday: '', age: '', mbti: '',
    appearance: '', physique: '', occupation: '', workplace: '', nationality: '', residence: '',
    relationshipStatus: '',
    partner: { description: '', character: '', text: '' },
    personality: '',
  },
  visual: { face: '', hair: '', skin: '' },
  aesthetics: { outfit: '', colorPalette: '', accessories: '', inspiration: '' },
  details: { habits: '', flaws: '', likes: '', dislikes: '', intimateLife: '' },
  complexRelationships: [],
  backstory: '',
  additional: { skills: '', assets: '', secrets: '', other: '' },
};

const statusOptions: { value: RelationshipStatus; label: string }[] = [
  { value: '', label: '— Không chọn —' },
  { value: 'single', label: 'Độc thân' },
  { value: 'dating', label: 'Hẹn hò' },
  { value: 'married', label: 'Hôn nhân' },
  { value: 'single-parent', label: 'Đơn thân' },
];

const fromCharacter = (c: Character): FormData => ({
  name: c.name || '',
  avatarImage: c.avatarImage || '',
  tags: c.tags || [],
  isPublic: c.isPublic !== false,
  core: {
    fullName: c.core?.fullName || '',
    gender: c.core?.gender || '',
    birthday: c.core?.birthday || '',
    age: c.core?.age || '',
    mbti: c.core?.mbti || '',
    appearance: c.core?.appearance || '',
    physique: c.core?.physique || '',
    occupation: c.core?.occupation || '',
    workplace: c.core?.workplace || '',
    nationality: c.core?.nationality || '',
    residence: c.core?.residence || '',
    relationshipStatus: c.core?.relationshipStatus || '',
    partner: {
      description: c.core?.partner?.description || '',
      character: typeof c.core?.partner?.character === 'object'
        ? (c.core?.partner?.character?._id || '')
        : (c.core?.partner?.character || ''),
      text: c.core?.partner?.text || '',
    },
    personality: c.core?.personality || '',
  },
  visual: {
    face: c.visual?.face || '', hair: c.visual?.hair || '', skin: c.visual?.skin || '',
  },
  aesthetics: {
    outfit: c.aesthetics?.outfit || '',
    colorPalette: c.aesthetics?.colorPalette || '',
    accessories: c.aesthetics?.accessories || '',
    inspiration: c.aesthetics?.inspiration || '',
  },
  details: {
    habits: c.details?.habits || '',
    flaws: c.details?.flaws || '',
    likes: c.details?.likes || '',
    dislikes: c.details?.dislikes || '',
    intimateLife: c.details?.intimateLife || '',
  },
  complexRelationships: (c.complexRelationships || []).map(r => ({
    description: r.description || '',
    character: typeof r.character === 'object' ? (r.character?._id || '') : (r.character || ''),
    text: r.text || '',
  })),
  backstory: c.backstory || '',
  additional: {
    skills: c.additional?.skills || '',
    assets: c.additional?.assets || '',
    secrets: c.additional?.secrets || '',
    other: c.additional?.other || '',
  },
});

const toPayload = (f: FormData) => ({
  name: f.name,
  avatarImage: f.avatarImage,
  tags: f.tags,
  isPublic: f.isPublic,
  core: {
    ...f.core,
    partner: {
      description: f.core.partner.description,
      character: f.core.partner.character || null,
      text: f.core.partner.text,
    },
  },
  visual: f.visual,
  aesthetics: f.aesthetics,
  details: f.details,
  complexRelationships: f.complexRelationships.map(r => ({
    description: r.description,
    character: r.character || null,
    text: r.text,
  })),
  backstory: f.backstory,
  additional: f.additional,
});

interface Props {
  initial?: Character | null;
  submitLabel: string;
  onSubmit: (payload: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    {children}
  </div>
);

const inputClass =
  'w-full px-3 py-2 bg-dark-lighter border border-neon-blue/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="glass-card p-6 space-y-4">
    <h2 className="text-lg font-bold text-neon-blue uppercase tracking-wider">{title}</h2>
    {children}
  </div>
);

const CharacterForm = ({ initial, submitLabel, onSubmit, onCancel, loading, error }: Props) => {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [tagInput, setTagInput] = useState('');
  const [myCharacters, setMyCharacters] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    if (initial) setForm(fromCharacter(initial));
  }, [initial]);

  useEffect(() => {
    (async () => {
      try {
        const res = await characterService.getMine();
        setMyCharacters((res.data || []).map(c => ({ _id: c._id, name: c.name })));
      } catch {
        // ignore
      }
    })();
  }, []);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const updateCore = (k: keyof FormData['core'], v: any) =>
    setForm(prev => ({ ...prev, core: { ...prev.core, [k]: v } }));

  const updateNested = <K extends 'visual' | 'aesthetics' | 'details' | 'additional'>(
    section: K,
    key: keyof FormData[K],
    value: any
  ) =>
    setForm(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }));

  const updatePartner = (k: 'description' | 'character' | 'text', v: string) =>
    setForm(prev => ({
      ...prev,
      core: { ...prev.core, partner: { ...prev.core.partner, [k]: v } },
    }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t) && form.tags.length < 10) {
      update('tags', [...form.tags, t]);
      setTagInput('');
    }
  };

  const addComplexRel = () =>
    update('complexRelationships', [
      ...form.complexRelationships,
      { description: '', character: '', text: '' },
    ]);

  const updateComplexRel = (i: number, k: 'description' | 'character' | 'text', v: string) => {
    const next = [...form.complexRelationships];
    next[i] = { ...next[i], [k]: v };
    update('complexRelationships', next);
  };

  const removeComplexRel = (i: number) =>
    update('complexRelationships', form.complexRelationships.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(toPayload(form));
  };

  const CharPicker = ({
    value,
    onChange,
    excludeId,
  }: { value: string; onChange: (v: string) => void; excludeId?: string }) => (
    <select value={value} onChange={e => onChange(e.target.value)} className={inputClass}>
      <option value="">— Không liên kết —</option>
      {myCharacters
        .filter(c => c._id !== excludeId)
        .map(c => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
    </select>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Basic (required) */}
      <Section title="Thông tin cơ bản (hệ thống)">
        <Field label="Tên Character *">
          <input type="text" required maxLength={100} value={form.name}
            onChange={e => update('name', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Ảnh đại diện">
          <ImageUpload value={form.avatarImage} onChange={v => update('avatarImage', v)} />
        </Field>
        <Field label="Tags (tối đa 10)">
          <div className="flex gap-2 mb-2">
            <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); addTag(); }
              }}
              placeholder="Thêm tag rồi Enter" className={inputClass} />
            <button type="button" onClick={addTag}
              className="px-4 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue border border-neon-blue/50 rounded-lg">
              Thêm
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((t, i) => (
              <span key={i} className="px-3 py-1 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded-full text-sm flex items-center gap-2">
                {t}
                <button type="button" onClick={() => update('tags', form.tags.filter((_, idx) => idx !== i))}
                  className="hover:text-red-400">×</button>
              </span>
            ))}
          </div>
        </Field>
        <Field label="Công khai">
          <label className="flex items-center gap-2 text-gray-300">
            <input type="checkbox" checked={form.isPublic}
              onChange={e => update('isPublic', e.target.checked)} />
            Cho phép mọi người xem
          </label>
        </Field>
      </Section>

      {/* 1. Core */}
      <Section title="1. Thông tin cốt lõi">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Họ và tên"><input type="text" value={form.core.fullName} onChange={e => updateCore('fullName', e.target.value)} className={inputClass} /></Field>
          <Field label="Giới tính"><input type="text" value={form.core.gender} onChange={e => updateCore('gender', e.target.value)} className={inputClass} /></Field>
          <Field label="Sinh nhật"><input type="text" value={form.core.birthday} onChange={e => updateCore('birthday', e.target.value)} className={inputClass} /></Field>
          <Field label="Độ tuổi"><input type="text" value={form.core.age} onChange={e => updateCore('age', e.target.value)} className={inputClass} /></Field>
          <Field label="MBTI"><input type="text" value={form.core.mbti} onChange={e => updateCore('mbti', e.target.value)} className={inputClass} /></Field>
        </div>

        <Field label="Ngoại hình">
          <textarea rows={3} value={form.core.appearance} onChange={e => updateCore('appearance', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Chiều cao / Thể hình">
          <input type="text" value={form.core.physique} onChange={e => updateCore('physique', e.target.value)} className={inputClass} />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nghề nghiệp"><input type="text" value={form.core.occupation} onChange={e => updateCore('occupation', e.target.value)} className={inputClass} /></Field>
          <Field label="Nơi làm việc"><input type="text" value={form.core.workplace} onChange={e => updateCore('workplace', e.target.value)} className={inputClass} /></Field>
          <Field label="Quốc tịch"><input type="text" value={form.core.nationality} onChange={e => updateCore('nationality', e.target.value)} className={inputClass} /></Field>
          <Field label="Nơi ở"><input type="text" value={form.core.residence} onChange={e => updateCore('residence', e.target.value)} className={inputClass} /></Field>
          <Field label="Tình trạng">
            <select value={form.core.relationshipStatus} onChange={e => updateCore('relationshipStatus', e.target.value as RelationshipStatus)} className={inputClass}>
              {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
        </div>

        {(form.core.relationshipStatus === 'dating' || form.core.relationshipStatus === 'married') && (
          <div className="p-4 border border-neon-blue/20 rounded-lg bg-dark-lighter/30 space-y-3">
            <p className="text-sm text-gray-400">Liên kết với OC (tùy chọn)</p>
            <Field label="Chọn OC của bạn">
              <CharPicker value={form.core.partner.character} onChange={v => updatePartner('character', v)} excludeId={initial?._id} />
            </Field>
            <Field label="Hoặc nhập link / mô tả tự do">
              <input type="text" placeholder="Link share hoặc tên OC của người khác" value={form.core.partner.text} onChange={e => updatePartner('text', e.target.value)} className={inputClass} />
            </Field>
          </div>
        )}

        <Field label="Tính cách">
          <textarea rows={4} value={form.core.personality} onChange={e => updateCore('personality', e.target.value)} className={inputClass} />
        </Field>
      </Section>

      {/* 2. Visual */}
      <Section title="2. Đặc điểm nhận dạng vật lý">
        <Field label="Khuôn mặt"><textarea rows={2} value={form.visual.face} onChange={e => updateNested('visual', 'face', e.target.value)} className={inputClass} /></Field>
        <Field label="Mái tóc"><textarea rows={2} value={form.visual.hair} onChange={e => updateNested('visual', 'hair', e.target.value)} className={inputClass} /></Field>
        <Field label="Làn da"><textarea rows={2} value={form.visual.skin} onChange={e => updateNested('visual', 'skin', e.target.value)} className={inputClass} /></Field>
      </Section>

      {/* 3. Aesthetics */}
      <Section title="3. Phong cách & diện mạo">
        <Field label="Trang phục đặc trưng"><textarea rows={3} value={form.aesthetics.outfit} onChange={e => updateNested('aesthetics', 'outfit', e.target.value)} className={inputClass} /></Field>
        <Field label="Bảng màu (Color Palette)"><textarea rows={2} value={form.aesthetics.colorPalette} onChange={e => updateNested('aesthetics', 'colorPalette', e.target.value)} className={inputClass} /></Field>
        <Field label="Phụ kiện đi kèm"><textarea rows={2} value={form.aesthetics.accessories} onChange={e => updateNested('aesthetics', 'accessories', e.target.value)} className={inputClass} /></Field>
        <Field label="Hình tượng gợi nhớ / Cảm hứng"><textarea rows={2} value={form.aesthetics.inspiration} onChange={e => updateNested('aesthetics', 'inspiration', e.target.value)} className={inputClass} /></Field>
      </Section>

      {/* 4. Details */}
      <Section title="4. Chi tiết bổ trợ">
        <Field label="Thói quen / Biểu hiện đặc trưng"><textarea rows={3} value={form.details.habits} onChange={e => updateNested('details', 'habits', e.target.value)} className={inputClass} /></Field>
        <Field label="Khuyết điểm"><textarea rows={2} value={form.details.flaws} onChange={e => updateNested('details', 'flaws', e.target.value)} className={inputClass} /></Field>
        <Field label="Sở thích"><textarea rows={2} value={form.details.likes} onChange={e => updateNested('details', 'likes', e.target.value)} className={inputClass} /></Field>
        <Field label="Không thích"><textarea rows={2} value={form.details.dislikes} onChange={e => updateNested('details', 'dislikes', e.target.value)} className={inputClass} /></Field>
        <Field label="Cuộc sống tình dục & Thân mật"><textarea rows={3} value={form.details.intimateLife} onChange={e => updateNested('details', 'intimateLife', e.target.value)} className={inputClass} /></Field>
      </Section>

      {/* Complex relationships */}
      <Section title="Mối quan hệ phức tạp">
        {form.complexRelationships.length === 0 && (
          <p className="text-sm text-gray-500">Chưa có mối quan hệ nào. Bấm nút bên dưới để thêm.</p>
        )}
        {form.complexRelationships.map((r, i) => (
          <div key={i} className="p-4 border border-neon-blue/20 rounded-lg bg-dark-lighter/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Quan hệ #{i + 1}</span>
              <button type="button" onClick={() => removeComplexRel(i)} className="text-red-400 hover:text-red-300 text-sm">Xóa</button>
            </div>
            <Field label="Mô tả ngắn">
              <input type="text" placeholder="VD: Kẻ thù, Cố nhân..." value={r.description} onChange={e => updateComplexRel(i, 'description', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Liên kết OC của bạn (tùy chọn)">
              <CharPicker value={r.character} onChange={v => updateComplexRel(i, 'character', v)} excludeId={initial?._id} />
            </Field>
            <Field label="Hoặc link / text tự do">
              <input type="text" value={r.text} onChange={e => updateComplexRel(i, 'text', e.target.value)} className={inputClass} />
            </Field>
          </div>
        ))}
        <button type="button" onClick={addComplexRel}
          className="w-full px-4 py-2 border border-dashed border-neon-blue/40 text-neon-blue rounded-lg hover:bg-neon-blue/10">
          + Thêm mối quan hệ
        </button>
      </Section>

      {/* Backstory */}
      <Section title="Câu chuyện (Backstory)">
        <Field label="Backstory">
          <textarea rows={8} value={form.backstory} onChange={e => update('backstory', e.target.value)} className={inputClass} />
        </Field>
      </Section>

      {/* 5. Additional */}
      <Section title="5. Bổ sung thêm">
        <Field label="Kỹ năng & Năng lực"><textarea rows={3} value={form.additional.skills} onChange={e => updateNested('additional', 'skills', e.target.value)} className={inputClass} /></Field>
        <Field label="Tài sản"><textarea rows={2} value={form.additional.assets} onChange={e => updateNested('additional', 'assets', e.target.value)} className={inputClass} /></Field>
        <Field label='Một số điều chỉ "người ấy" biết'><textarea rows={3} value={form.additional.secrets} onChange={e => updateNested('additional', 'secrets', e.target.value)} className={inputClass} /></Field>
        <Field label="Khác"><textarea rows={3} value={form.additional.other} onChange={e => updateNested('additional', 'other', e.target.value)} className={inputClass} /></Field>
      </Section>

      {/* Actions */}
      <div className="flex gap-3 sticky bottom-4">
        <button type="submit" disabled={loading}
          className="flex-1 px-6 py-3 bg-neon-blue hover:bg-neon-blue/80 text-dark-900 font-bold rounded-lg disabled:opacity-50">
          {loading ? 'Đang lưu...' : submitLabel}
        </button>
        <button type="button" onClick={onCancel}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
          Hủy
        </button>
      </div>
    </form>
  );
};

export default CharacterForm;
