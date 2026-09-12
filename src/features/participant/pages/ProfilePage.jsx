// src/features/participant/pages/ProfilePage.jsx import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaGlobeAmericas,
  FaEnvelope,
  FaCode,
} from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import {
  getProfile,
  createProfile,
  updateProfile,
} from "../services/participantService";
import { uploadImageToCloudinary } from "../../../utils/cloudinary";
import Navbar from "../../../components/layout/Navbar";
import { useSelector } from "react-redux"; // ─── Zod schema ───────────────────────────────────────────────────────────────
const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  bio: z.string().optional(),
  techSkills: z.string().optional(),
  githubURL: z.string().optional(),
  linkedInURL: z.string().optional(),
  xurl: z.string().optional(),
  avatarURL: z.string().optional(),
}); // ─── Input component ──────────────────────────────────────────────────────────
function Field({ label, icon: Icon, error, hint, ...props }) {
  return (
    <div>
      {" "}
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#6F6866]">
        {" "}
        {Icon && <Icon size={13} className="text-[#6F6866]" />} {label}{" "}
      </label>{" "}
      {props.textarea ? (
        <textarea
          rows={3}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#38302E] placeholder-slate-500 outline-none transition focus:ring-2 focus:ring-[#9CAEA9]/40 ${error ? "border-red-500" : "border-[#788585]/30 focus:border-[#9CAEA9]"}`}
          {...props}
        />
      ) : (
        <input
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#38302E] placeholder-slate-500 outline-none transition focus:ring-2 focus:ring-[#9CAEA9]/40 ${error ? "border-red-500" : "border-[#788585]/30 focus:border-[#9CAEA9]"}`}
          {...props}
        />
      )}{" "}
      {hint && !error && <p className="mt-1 text-xs text-[#6F6866]">{hint}</p>}{" "}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}{" "}
    </div>
  );
} // ─── Avatar uploader ──────────────────────────────────────────────────────────
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
      {" "}
      <div className="relative h-20 w-20 flex-shrink-0">
        {" "}
        {currentUrl ? (
          <img
            src={currentUrl}
            alt="Avatar"
            className="h-20 w-20 rounded-2xl object-cover border-2 border-[#788585]/30"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white border-2 border-[#788585]/30 text-[#6F6866]">
            {" "}
            <FaGlobeAmericas size={28} />{" "}
          </div>
        )}{" "}
      </div>{" "}
      <div>
        {" "}
        <label
          className={`inline-block cursor-pointer rounded-xl border border-slate-600 bg-white px-4 py-2 text-sm font-medium text-[#38302E] transition hover:bg-[#CCDAD1]/40 ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
        >
          {" "}
          {isUploading ? "Uploading..." : "Change Photo"}{" "}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />{" "}
        </label>{" "}
        <p className="mt-1.5 text-xs text-[#6F6866]">
          JPG, PNG, or WebP — max 5 MB
        </p>{" "}
      </div>{" "}
    </div>
  );
} // ─── Profile Skeleton ───────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {" "}
      <div className="mb-8">
        {" "}
        <div className="h-4 w-24 rounded bg-white mb-2"></div>{" "}
        <div className="h-8 w-48 rounded bg-white mb-2"></div>{" "}
        <div className="h-4 w-64 rounded bg-white"></div>{" "}
      </div>{" "}
      <div className="overflow-hidden rounded-2xl border border-[#788585]/30 bg-white shadow-xl">
        {" "}
        <div className="h-32 bg-white"></div>{" "}
        <div className="px-8 pb-8">
          {" "}
          <div className="relative -mt-16 mb-4">
            {" "}
            <div className="h-32 w-32 rounded-2xl border-4 border-slate-900 bg-white"></div>{" "}
          </div>{" "}
          <div className="h-8 w-64 rounded bg-white mb-4"></div>{" "}
          <div className="space-y-2">
            {" "}
            <div className="h-4 w-full max-w-xl rounded bg-white"></div>{" "}
            <div className="h-4 w-3/4 max-w-xl rounded bg-white"></div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="rounded-2xl border border-[#788585]/30 bg-white p-8 space-y-4">
        {" "}
        <div className="h-6 w-32 rounded bg-white"></div>{" "}
        <div className="flex gap-2">
          {" "}
          <div className="h-8 w-20 rounded bg-white"></div>{" "}
          <div className="h-8 w-24 rounded bg-white"></div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
} // ─── Main page ────────────────────────────────────────────────────────────────
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
  } = useForm({ resolver: zodResolver(profileSchema) }); // eslint-disable-next-line react-hooks/incompatible-library const avatarURL = watch("avatarURL"); // Load existing profile on mount useEffect(() => { getProfile() .then((profile) => { if (profile) { setExistingProfile(profile); reset(profile); setIsEditing(false); } else { setIsEditing(true); } }) .catch((err) => { if (err.message === "Profile not found" || err.message.includes("not found")) { setIsEditing(true); toast.warning("Please submit your profile details before interacting with system further"); } else { toast.error(err.message); } }) .finally(() => setIsPageLoading(false)); }, [reset]); async function onSubmit(data) { try { const saved = existingProfile ? await updateProfile(data) : await createProfile(data); setExistingProfile(saved); setIsEditing(false); toast.success(existingProfile ? "Profile updated!" : "Profile created!"); } catch (err) { toast.error(err.message); } } if (isPageLoading) { return ( <div className="min-h-screen bg-white text-[#38302E]"> <Navbar /> <div className="py-12 mx-auto max-w-2xl px-5"> <ProfileSkeleton /> </div> </div> ); } return ( <div className="min-h-screen bg-white text-[#38302E]"> <Navbar /> <div className="py-12 mx-auto max-w-2xl px-5"> {/* Header */} <div className="mb-8 flex items-center justify-between"> <div> <p className="text-sm font-semibold uppercase tracking-widest text-[#9CAEA9]">Account</p> <h1 className="mt-2 text-3xl font-bold"> {existingProfile && !isEditing ? "My Profile" : existingProfile ? "Edit Profile" : "Create Profile"} </h1> <p className="mt-2 text-sm text-[#6F6866]"> {existingProfile && !isEditing ? "This is how organizers, judges, and teammates see you." : "Your public profile is shown to organizers, judges, and teammates."} </p> </div> {existingProfile && !isEditing && ( <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#38302E] transition hover:bg-[#CCDAD1]/40 border border-[#788585]/30 cursor-pointer" > <MdEditSquare size={16} className="text-[#9CAEA9]" /> Edit Profile </button> )} </div> {existingProfile && !isEditing ? ( // ─── VIEW MODE ────────────────────────────────────────────────── <div className="space-y-6"> <div className="overflow-hidden rounded-2xl border border-[#788585]/30 bg-white shadow-xl shadow-black/20"> <div className="h-32 bg-gradient-to-r from-indigo-900/60 to-purple-900/60"></div> <div className="px-8 pb-8"> <div className="relative -mt-16 mb-4 flex justify-between items-end"> {existingProfile.avatarURL ? ( <img src={existingProfile.avatarURL} alt={existingProfile.fullName} className="h-32 w-32 rounded-2xl border-4 border-slate-900 object-cover bg-white" /> ) : ( <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-slate-900 bg-white text-[#6F6866]"> <FaGlobeAmericas size={40} /> </div> )} </div> <div> <h2 className="text-3xl font-bold text-[#38302E]">{existingProfile.fullName}</h2> <div className="mt-2 flex flex-wrap items-center gap-3"> <span className="flex items-center gap-1.5 text-sm font-medium text-[#6F6866]"> <FaEnvelope size={13} className="text-[#6F6866]" /> {user?.email} </span> { <span className="rounded-md bg-indigo-900/40 border border-indigo-700/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300"> {platformRoles[1]} </span> } </div> {existingProfile.bio && ( <p className="mt-4 text-[#6F6866] leading-relaxed max-w-xl"> {existingProfile.bio} </p> )} </div> </div> </div> {existingProfile.techSkills && ( <div className="rounded-2xl border border-[#788585]/30 bg-white p-8"> <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#38302E]"> <FaCode className="text-[#9CAEA9]" /> Tech Skills </h3> <div className="flex flex-wrap gap-2"> {existingProfile.techSkills.split(",").map((skill, i) => ( <span key={i} className="rounded-lg bg-indigo-900/30 border border-indigo-700/30 px-3 py-1.5 text-sm font-medium text-indigo-300"> {skill.trim()} </span> ))} </div> </div> )} {(existingProfile.githubURL || existingProfile.linkedInURL || existingProfile.xurl) && ( <div className="rounded-2xl border border-[#788585]/30 bg-white p-8"> <h3 className="mb-4 text-lg font-bold text-[#38302E]">Social Links</h3> <div className="flex flex-col gap-3"> {existingProfile.githubURL && ( <a href={existingProfile.githubURL} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[#6F6866] hover:text-[#38302E] transition"> <FaGithub size={18} className="text-[#6F6866]" /> {existingProfile.githubURL} </a> )} {existingProfile.linkedInURL && ( <a href={existingProfile.linkedInURL} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[#6F6866] hover:text-[#38302E] transition"> <FaLinkedin size={18} className="text-[#6F6866]" /> {existingProfile.linkedInURL} </a> )} {existingProfile.xurl && ( <a href={existingProfile.xurl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[#6F6866] hover:text-[#38302E] transition"> <FaTwitter size={18} className="text-[#6F6866]" /> {existingProfile.xurl} </a> )} </div> </div> )} </div> ) : ( // ─── EDIT / CREATE MODE ───────────────────────────────────────── <form onSubmit={handleSubmit(onSubmit)} className="space-y-6"> {/* Avatar */} <div className="rounded-2xl border border-[#788585]/30 bg-white p-6 shadow-xl shadow-black/20"> <h2 className="mb-4 text-base font-bold text-[#38302E]">Photo</h2> <AvatarUploader currentUrl={avatarURL} onUpload={(url) => setValue("avatarURL", url)} /> <input type="hidden" {...register("avatarURL")} /> </div> {/* Basic Info */} <div className="rounded-2xl border border-[#788585]/30 bg-white p-6 space-y-4 shadow-xl shadow-black/20"> <h2 className="text-base font-bold text-[#38302E]">Basic Info</h2> <Field label="Full Name *" type="text" placeholder="e.g. Prakhar Sharma" error={errors.fullName?.message} {...register("fullName")} /> <Field label="Bio" textarea placeholder="Tell us about yourself..." error={errors.bio?.message} {...register("bio")} /> <Field label="Tech Skills" type="text" placeholder="e.g. React, Java, Spring Boot, Docker" hint="Comma-separated list of your skills" error={errors.techSkills?.message} {...register("techSkills")} /> </div> {/* Social Links */} <div className="rounded-2xl border border-[#788585]/30 bg-white p-6 space-y-4 shadow-xl shadow-black/20"> <h2 className="text-base font-bold text-[#38302E]">Social Links</h2> <Field label="GitHub" icon={FaGithub} type="url" placeholder="https://github.com/your-handle" error={errors.githubURL?.message} {...register("githubURL")} /> <Field label="LinkedIn" icon={FaLinkedin} type="url" placeholder="https://linkedin.com/in/your-handle" error={errors.linkedInURL?.message} {...register("linkedInURL")} /> <Field label="X / Twitter" icon={FaTwitter} type="url" placeholder="https://x.com/your-handle" error={errors.xurl?.message} {...register("xurl")} /> </div> {/* Submit */} <div className="flex gap-4"> <button type="submit" disabled={isSubmitting} className="flex-1 rounded-xl bg-[#9CAEA9] py-3.5 font-semibold text-[#38302E] transition hover:bg-indigo-500 disabled:opacity-50" > {isSubmitting ? "Saving..." : existingProfile ? "Save Changes" : "Create Profile"} </button> {existingProfile && ( <button type="button" onClick={() => { reset(existingProfile); setIsEditing(false); }} className="rounded-xl border border-slate-600 bg-white px-8 py-3.5 font-semibold text-[#6F6866] transition hover:bg-[#CCDAD1]/40" > Cancel </button> )} </div> </form> )} </div> </div> );
}
