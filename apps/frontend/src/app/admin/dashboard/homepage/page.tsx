'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Image from 'next/image';
import { homepageService } from '../../../../services';
import type { AboutImageSlot, Banner, UpdateHomepage } from '../../../../types';

const MAX_HERO_IMAGES = 3;

const ABOUT_IMAGE_SLOTS: { slot: AboutImageSlot; label: string }[] = [
  { slot: 'main', label: 'Main box' },
  { slot: 'top', label: 'Top-right box' },
  { slot: 'bottom', label: 'Bottom-right box' },
];

export default function HomepageEditor() {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [uploading, setUploading] = useState(false);
  const [aboutImages, setAboutImages] = useState<Record<AboutImageSlot, string | null | undefined>>({
    main: null,
    top: null,
    bottom: null,
  });
  const [uploadingSlot, setUploadingSlot] = useState<AboutImageSlot | null>(null);
  const [advantagesImage, setAdvantagesImage] = useState<string | null | undefined>(null);
  const [advantagesText, setAdvantagesText] = useState('');
  const [uploadingAdvantages, setUploadingAdvantages] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<UpdateHomepage>()

  const load = () =>
    homepageService.get().then(({ data }) => {
      reset({
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroImageUrl: data.heroImageUrl,
        aboutTitle: data.aboutTitle,
        aboutText: data.aboutText,
        contactTitle: data.contactTitle,
        contactSubtitle: data.contactSubtitle,
        contactPhone: data.contactPhone,
        contactAddress: data.contactAddress,
      });
      setBanners(data.banners || []);
      setAboutImages({
        main: data.aboutImageUrl,
        top: data.aboutTopImageUrl,
        bottom: data.aboutBottomImageUrl,
      });
      setAdvantagesImage(data.advantagesImageUrl);
      setAdvantagesText((data.advantages || []).join('\n'));
      setLoading(false);
    });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

   const onSubmit = async (values: UpdateHomepage) => {
    try {
      const advantages = advantagesText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      await homepageService.update({ ...values, advantages });
      toast.success('Homepage updated');
    } catch {
      toast.error('Failed to update homepage');
    }
  };

  const onUploadBanner = async (file: File) => {
    setUploading(true);
    try {
      await homepageService.uploadBanner(file);
      toast.success('Hero image uploaded');
      await load();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onRemoveBanner = async (id: string) => {
    if (!confirm('Delete this hero image?')) return;
    await homepageService.removeBanner(id);
    toast.success('Hero image deleted');
    load();
  };

  const onUploadAboutImage = async (slot: AboutImageSlot, file: File) => {
    setUploadingSlot(slot);
    try {
      const { data } = await homepageService.uploadAboutImage(slot, file);
      setAboutImages({
        main: data.aboutImageUrl,
        top: data.aboutTopImageUrl,
        bottom: data.aboutBottomImageUrl,
      });
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingSlot(null);
    }
  };

  const onRemoveAboutImage = async (slot: AboutImageSlot) => {
    if (!confirm('Remove this image?')) return;
    const { data } = await homepageService.removeAboutImage(slot);
    setAboutImages({
      main: data.aboutImageUrl,
      top: data.aboutTopImageUrl,
      bottom: data.aboutBottomImageUrl,
    });
    toast.success('Image removed');
  };

  const onUploadAdvantagesImage = async (file: File) => {
    setUploadingAdvantages(true);
    try {
      const { data } = await homepageService.uploadAdvantagesImage(file);
      setAdvantagesImage(data.advantagesImageUrl);
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingAdvantages(false);
    }
  };

  const onRemoveAdvantagesImage = async () => {
    if (!confirm('Remove this image?')) return;
    const { data } = await homepageService.removeAdvantagesImage();
    setAdvantagesImage(data.advantagesImageUrl);
    toast.success('Image removed');
  };

  if (loading) return <p className="text-[var(--color-text-muted)]">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl mb-6">Homepage content</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <fieldset className="space-y-3">
          <legend className="text-sm text-[var(--color-clay-500)] mb-2">Hero section</legend>
          <Field label="Hero title" {...register('heroTitle')} />
          <Field label="Hero subtitle" {...register('heroSubtitle')} />
          <Field label="Hero image URL" {...register('heroImageUrl')} />

          <div>
            <span className="block text-sm mb-2 text-[var(--color-text-muted)]">
              Hero photos ({banners.length}/{MAX_HERO_IMAGES}) — the 3 overlapping thumbnails on
              the hero banner
            </span>
            <div className="grid grid-cols-3 gap-3 max-w-sm mb-3">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="relative group aspect-square rounded-xl overflow-hidden bg-[var(--color-ink-700)]"
                >
                  {banner.imageUrl && (
                    <Image src={banner.imageUrl} alt={banner.title || ''} fill className="object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => onRemoveBanner(banner.id)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            {banners.length < MAX_HERO_IMAGES && (
              <label className="btn-primary inline-block cursor-pointer text-sm disabled:opacity-60">
                {uploading ? 'Uploading…' : 'Upload hero photo'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => e.target.files?.[0] && onUploadBanner(e.target.files[0])}
                />
              </label>
            )}
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm text-[var(--color-clay-500)] mb-2">About section</legend>
          <Field label="About title" {...register('aboutTitle')} />
          <TextArea label="About text" {...register('aboutText')} />

          <div>
            <span className="block text-sm mb-2 text-[var(--color-text-muted)]">
              About Us images — the 3 overlapping boxes next to the text
            </span>
            <div className="grid grid-cols-3 gap-3 max-w-sm">
              {ABOUT_IMAGE_SLOTS.map(({ slot, label }) => {
                const url = aboutImages[slot];
                return (
                  <div key={slot} className="flex flex-col gap-1.5">
                    <div className="relative group aspect-square rounded-xl overflow-hidden bg-[var(--color-ink-700)]">
                      {url && <Image src={url} alt={label} fill className="object-cover" />}
                      {url && (
                        <button
                          type="button"
                          onClick={() => onRemoveAboutImage(slot)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                        >
                          Delete
                        </button>
                      )}
                      {!url && (
                        <label className="absolute inset-0 flex items-center justify-center text-xs text-[var(--color-text-muted)] cursor-pointer hover:text-white transition-colors">
                          {uploadingSlot === slot ? 'Uploading…' : 'Upload'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingSlot === slot}
                            onChange={(e) =>
                              e.target.files?.[0] && onUploadAboutImage(slot, e.target.files[0])
                            }
                          />
                        </label>
                      )}
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)] text-center">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm text-[var(--color-clay-500)] mb-2">Advantages section</legend>
          <TextArea
            label="Advantages (one per line)"
            value={advantagesText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAdvantagesText(e.target.value)}
          />

          <div>
            <span className="block text-sm mb-2 text-[var(--color-text-muted)]">
              Advantages image
            </span>
            <div className="relative group aspect-[4/3] rounded-xl overflow-hidden bg-[var(--color-ink-700)] max-w-xs">
              {advantagesImage && (
                <Image src={advantagesImage} alt="Advantages" fill className="object-cover" />
              )}
              {advantagesImage && (
                <button
                  type="button"
                  onClick={onRemoveAdvantagesImage}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                >
                  Delete
                </button>
              )}
              {!advantagesImage && (
                <label className="absolute inset-0 flex items-center justify-center text-xs text-[var(--color-text-muted)] cursor-pointer hover:text-white transition-colors">
                  {uploadingAdvantages ? 'Uploading…' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingAdvantages}
                    onChange={(e) => e.target.files?.[0] && onUploadAdvantagesImage(e.target.files[0])}
                  />
                </label>
              )}
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm text-[var(--color-clay-500)] mb-2">Contact section</legend>
          <Field label="Contact title" {...register('contactTitle')} />
          <Field label="Contact subtitle" {...register('contactSubtitle')} />
          <Field label="Footer phone" {...register('contactPhone')} />
          <TextArea
            label="Footer address (one line per row, e.g. street then postal code)"
            {...register('contactAddress')}
          />
        </fieldset>

        <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-60">
          {isSubmitting ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, ...props }: any) {
  return (
    <label className="block">
      <span className="block text-sm mb-1 text-[var(--color-text-muted)]">{label}</span>
      <input
        {...props}
        className="w-full rounded-md bg-[var(--color-ink-700)] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-500)]"
      />
    </label>
  );
}

function TextArea({ label, ...props }: any) {
  return (
    <label className="block">
      <span className="block text-sm mb-1 text-[var(--color-text-muted)]">{label}</span>
      <textarea
        {...props}
        rows={4}
        className="w-full rounded-md bg-[var(--color-ink-700)] border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-500)]"
      />
    </label>
  );
}
