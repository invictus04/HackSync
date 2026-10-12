import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { FaGithub, FaLinkedin, FaTwitter, FaGlobeAmericas, FaEnvelope, FaCode } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";

import { getProfile, createProfile, updateProfile } from "../services/participantService";
import { uploadImageToCloudinary } from "../../../utils/cloudinary";
import Navbar from "../../../components/layout/Navbar";
import { useSelector } from "react-redux";


const profileSchema = z.object({
    fullName: z.string().min(1, "Full name is required."),
    bio: z.string().optional(),
    techSkills: z.string().optional(),
    githubURL: z.string().optional(),
    linkedInURL: z.string().optional(),
    xurl: z.string().optional(),
    avatarURL: z.string().optional(),
});


function Field({ label, icon: Icon, error, hint, ...props }) {
    return (
        <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-black/60">
                {Icon && <Icon size={13} className="text-black/40" />}
                {label}
            </label>
            {props.textarea ? (
                <textarea
                    rows={3}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-deep-espresso placeholder-slate-500 outline-none transition focus:ring-2 focus:ring-dark-khaki/40 ${error ? "border-red-500" : "border-warm-stone focus:border-dark-khaki"}`}
                    {...props}
                />
            ) : (
                <input
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-deep-espresso placeholder-slate-500 outline-none transition focus:ring-2 focus:ring-dark-khaki/40 ${error ? "border-red-500" : "border-warm-stone focus:border-dark-khaki"}`}
                    {...props}
                />
            )}
            {hint && !error && <p className="mt-1 text-xs text-black/40">{hint}</p>}
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
    );
}


function AvatarUploader({ currentUrl, onUpload }) {
    const [isUploading, setIsUploading] = useState(false);

    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const url = await uploadImageToCloudinary(file);
            onUpload(url);
            toast.success("Avatar uploaded!");
        } catch {
            toast.error("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 flex-shrink-0">
                {currentUrl ? (
                    <img src={currentUrl} alt="Avatar" className="h-20 w-20 rounded-2xl object-cover border-2 border-warm-stone" />
                ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white border-2 border-warm-stone text-black/40">
                        <FaGlobeAmericas size={28} />
                    </div>
                )}
            </div>
            <div>
                <label className={`inline-block cursor-pointer rounded-xl border border-warm-stone bg-dark-khaki px-4 py-2 text-sm font-medium text-white transition hover:bg-deep-espresso ${isUploading ? "opacity-50 pointer-events-none" : ""}`}>
                    {isUploading ? "Uploading..." : "Change Photo"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploading} />
                </label>
                <p className="mt-1.5 text-xs text-black/40">JPG, PNG, or WebP — max 5 MB</p>
            </div>
        </div>
    );
}

// ─── Profile Skeleton ───────────────────────────────────────────────────────────
function ProfileSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="mb-8">
                <div className="h-4 w-24 rounded bg-warm-stone/20 mb-2"></div>
                <div className="h-8 w-48 rounded bg-warm-stone/20 mb-2"></div>
                <div className="h-4 w-64 rounded bg-warm-stone/20"></div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-warm-stone bg-white shadow-md">
                <div className="h-32 bg-warm-stone/20"></div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-4">
                        <div className="h-32 w-32 rounded-2xl border-4 border-white bg-warm-stone/20"></div>
                    </div>
                    <div className="h-8 w-64 rounded bg-warm-stone/20 mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-full max-w-xl rounded bg-warm-stone/20"></div>
                        <div className="h-4 w-3/4 max-w-xl rounded bg-warm-stone/20"></div>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-warm-stone bg-white p-8 space-y-4 shadow-md">
                <div className="h-6 w-32 rounded bg-warm-stone/20"></div>
                <div className="flex gap-2">
                    <div className="h-8 w-20 rounded bg-warm-stone/20"></div>
                    <div className="h-8 w-24 rounded bg-warm-stone/20"></div>
                </div>
            </div>
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
    const [existingProfile, setExistingProfile] = useState(null);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const { user, platformRoles } = useSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(profileSchema) });

    // eslint-disable-next-line react-hooks/incompatible-library
    const avatarURL = watch("avatarURL");

    // Load existing profile on mount
    useEffect(() => {
        getProfile()
            .then((profile) => {
                if (profile) {
                    setExistingProfile(profile);
                    reset(profile);
                    setIsEditing(false);
                } else {
                    setIsEditing(true);
                }
            })
            .catch((err) => {
                if (err.message === "Profile not found" || err.message.includes("not found")) {
                    setIsEditing(true);
                    toast.warning("Please submit your profile details before interacting with system further");
                } else {
                    toast.error(err.message);
                }
            })
            .finally(() => setIsPageLoading(false));
    }, [reset]);

    async function onSubmit(data) {
        try {
            const saved = existingProfile
                ? await updateProfile(data)
                : await createProfile(data);

            setExistingProfile(saved);
            setIsEditing(false);
            toast.success(existingProfile ? "Profile updated!" : "Profile created!");
        } catch (err) {
            toast.error(err.message);
        }
    }

    if (isPageLoading) {
        return (
            <div className="min-h-screen bg-pale-mint text-deep-espresso">
                <Navbar />
                <div className="py-12 mx-auto max-w-2xl px-5">
                    <ProfileSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pale-mint text-deep-espresso bg-white">
            <Navbar />
            <div className="py-12 mx-auto max-w-2xl px-5">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-warm-stone">Account</p>
                        <h1 className="mt-2 text-3xl font-bold">
                            {existingProfile && !isEditing ? "My Profile" : existingProfile ? "Edit Profile" : "Create Profile"}
                        </h1>
                        <p className="mt-2 text-sm text-black/60">
                            {existingProfile && !isEditing
                                ? "This is how organizers, judges, and teammates see you."
                                : "Your public profile is shown to organizers, judges, and teammates."}
                        </p>
                    </div>

                    {existingProfile && !isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-deep-espresso transition hover:bg-corn-silk border border-warm-stone cursor-pointer shadow-sm"
                        >
                            <MdEditSquare size={16} className="text-dark-khaki" /> Edit Profile
                        </button>
                    )}
                </div>

                {existingProfile && !isEditing ? (
                    // ─── VIEW MODE ──────────────────────────────────────────────────
                    <div className="space-y-6">
                        <div className="overflow-hidden rounded-2xl border border-warm-stone bg-corn-silk shadow-md">
                            <div className="h-20 "></div>

                            <div className="px-8 pb-8">
                                <div className="relative -mt-16 mb-4 flex justify-between items-end">
                                    {existingProfile.avatarURL ? (
                                        <img
                                            src={existingProfile.avatarURL}
                                            alt={existingProfile.fullName}
                                            className="h-32 w-32 rounded-2xl border-4 border-white object-cover bg-white shadow-sm"
                                        />
                                    ) : (
                                        <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-white bg-white text-black/40 shadow-sm">
                                            <FaGlobeAmericas size={40} />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h2 className="text-3xl font-bold text-deep-espresso">{existingProfile.fullName}</h2>
                                    <div className="mt-2 flex flex-wrap items-center gap-3">
                                        <span className="flex items-center gap-1.5 text-sm font-medium text-black/60">
                                            <FaEnvelope size={13} className="text-black/40" />
                                            {user?.email}
                                        </span>
                                        {
                                            <span className="rounded-md bg-dark-khaki/10 border border-dark-khaki/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-deep-espresso">
                                                {platformRoles[1]}
                                            </span>
                                        }
                                    </div>
                                    {existingProfile.bio && (
                                        <p className="mt-4 text-black/60 leading-relaxed max-w-xl">
                                            {existingProfile.bio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {existingProfile.techSkills && (
                            <div className="rounded-2xl border border-warm-stone bg-corn-silk p-8 shadow-sm">
                                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-deep-espresso">
                                    <FaCode className="text-dark-khaki" /> Tech Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {existingProfile.techSkills.split(",").map((skill, i) => (
                                        <span key={i} className="rounded-lg bg-white border border-dark-khaki/30 px-3 py-1.5 text-sm font-medium text-deep-espresso">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(existingProfile.githubURL || existingProfile.linkedInURL || existingProfile.xurl) && (
                            <div className="rounded-2xl border border-warm-stone bg-corn-silk p-8 shadow-sm">
                                <h3 className="mb-4 text-lg font-bold text-deep-espresso">Social Links</h3>
                                <div className="flex flex-col gap-3">
                                    {existingProfile.githubURL && (
                                        <a href={existingProfile.githubURL} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-black/60 hover:text-deep-espresso transition">
                                            <FaGithub size={25} className="text-black" />
                                            {existingProfile.githubURL}
                                        </a>
                                    )}
                                    {existingProfile.linkedInURL && (
                                        <a href={existingProfile.linkedInURL} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-black/60 hover:text-deep-espresso transition">
                                            <FaLinkedin size={25} className="text-[#0072b1]" />
                                            {existingProfile.linkedInURL}
                                        </a>
                                    )}
                                    {existingProfile.xurl && (
                                        <a href={existingProfile.xurl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-black/60 hover:text-deep-espresso transition">
                                            <FaTwitter size={25} className="text-[#26a7de]" />
                                            {existingProfile.xurl}
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : 
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Avatar */}
                        <div className="rounded-2xl border border-warm-stone bg-corn-silk p-6 shadow-sm">
                            <h2 className="mb-4 text-base font-bold text-deep-espresso">Photo</h2>
                            <AvatarUploader
                                currentUrl={avatarURL}
                                onUpload={(url) => setValue("avatarURL", url)}
                            />
                            <input type="hidden" {...register("avatarURL")} />
                        </div>

                        {/* Basic Info */}
                        <div className="rounded-2xl border border-warm-stone bg-corn-silk p-6 space-y-4 shadow-sm">
                            <h2 className="text-base font-bold text-deep-espresso">Basic Info</h2>

                            <Field
                                label="Full Name *"
                                type="text"
                                placeholder="e.g. Prakhar Sharma"
                                error={errors.fullName?.message}
                                {...register("fullName")}
                            />

                            <Field
                                label="Bio"
                                textarea
                                placeholder="Tell us about yourself..."
                                error={errors.bio?.message}
                                {...register("bio")}
                            />

                            <Field
                                label="Tech Skills"
                                type="text"
                                placeholder="e.g. React, Java, Spring Boot, Docker"
                                hint="Comma-separated list of your skills"
                                error={errors.techSkills?.message}
                                {...register("techSkills")}
                            />
                        </div>

                        {/* Social Links */}
                        <div className="rounded-2xl border border-warm-stone bg-corn-silk p-6 space-y-4 shadow-sm">
                            <h2 className="text-base font-bold text-deep-espresso">Social Links</h2>

                            <Field
                                label="GitHub"
                                icon={FaGithub}
                                type="url"
                                placeholder="https://github.com/your-handle"
                                error={errors.githubURL?.message}
                                {...register("githubURL")}
                            />

                            <Field
                                label="LinkedIn"
                                icon={FaLinkedin}
                                type="url"
                                placeholder="https://linkedin.com/in/your-handle"
                                error={errors.linkedInURL?.message}
                                {...register("linkedInURL")}
                            />

                            <Field
                                label="X / Twitter"
                                icon={FaTwitter}
                                type="url"
                                placeholder="https://x.com/your-handle"
                                error={errors.xurl?.message}
                                {...register("xurl")}
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 rounded-xl bg-dark-khaki py-3.5 font-semibold text-white transition hover:bg-deep-espresso disabled:opacity-50 shadow-md shadow-dark-khaki/20 hover:-translate-y-0.5"
                            >
                                {isSubmitting ? "Saving..." : existingProfile ? "Save Changes" : "Create Profile"}
                            </button>

                            {existingProfile && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        reset(existingProfile);
                                        setIsEditing(false);
                                    }}
                                    className="rounded-xl border border-warm-stone bg-white px-8 py-3.5 font-semibold text-black/60 transition hover:bg-corn-silk hover:text-deep-espresso shadow-sm"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

