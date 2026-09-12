// src/features/hackathons/components/HostStep1BasicInfo.jsx import { useDispatch, useSelector } from "react-redux";
import { updateFormData } from "../redux/hostSlice";
import ImageUploadField from "../../../components/ui/ImageUploadField";
export default function HostStep1BasicInfo() {
  const dispatch = useDispatch();
  const { formData, errors } = useSelector((state) => state.host);
  function handleChange(field, value) {
    dispatch(updateFormData({ [field]: value }));
  }
  return (
    <div className="space-y-6">
      {" "}
      {/* Title */}{" "}
      <div>
        {" "}
        <label className="block text-sm font-semibold mb-2 text-[#38302E]">
          {" "}
          Hackathon Title <span className="text-red-400">*</span>{" "}
        </label>{" "}
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g., AI Innovation Challenge 2026"
          maxLength={100}
          className="w-full rounded-xl border border-[#788585]/30 bg-white px-4 py-3 text-[#38302E] placeholder-slate-500 outline-none transition focus:border-[#9CAEA9]"
        />{" "}
        <p className="mt-1 text-xs text-[#6F6866]">
          {formData.title.length}/100
        </p>{" "}
        {errors.title && (
          <p className="mt-1 text-xs text-red-400">{errors.title}</p>
        )}{" "}
      </div>{" "}
      {/* Tagline */}{" "}
      <div>
        {" "}
        <label className="block text-sm font-semibold mb-2 text-[#38302E]">
          {" "}
          Tagline <span className="text-red-400">*</span>{" "}
        </label>{" "}
        <input
          type="text"
          value={formData.tagline}
          onChange={(e) => handleChange("tagline", e.target.value)}
          placeholder="e.g., Innovate. Build. Compete."
          maxLength={160}
          className="w-full rounded-xl border border-[#788585]/30 bg-white px-4 py-3 text-[#38302E] placeholder-slate-500 outline-none transition focus:border-[#9CAEA9]"
        />{" "}
        <p className="mt-1 text-xs text-[#6F6866]">
          {formData.tagline.length}/160
        </p>{" "}
        {errors.tagline && (
          <p className="mt-1 text-xs text-red-400">{errors.tagline}</p>
        )}{" "}
      </div>{" "}
      {/* Description */}{" "}
      <div>
        {" "}
        <label className="block text-sm font-semibold mb-2 text-[#38302E]">
          {" "}
          Full Description <span className="text-red-400">*</span>{" "}
        </label>{" "}
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Describe your hackathon — goals, themes, what participants can expect..."
          rows={5}
          maxLength={2000}
          className="w-full resize-none rounded-xl border border-[#788585]/30 bg-white px-4 py-3 text-[#38302E] placeholder-slate-500 outline-none transition focus:border-[#9CAEA9]"
        />{" "}
        <p className="mt-1 text-xs text-[#6F6866]">
          {formData.description.length}/2000
        </p>{" "}
        {errors.description && (
          <p className="mt-1 text-xs text-red-400">{errors.description}</p>
        )}{" "}
      </div>{" "}
      {/* FAQ */}{" "}
      <div>
        {" "}
        <label className="block text-sm font-semibold mb-2 text-[#38302E]">
          {" "}
          FAQ <span className="text-red-400">*</span>{" "}
        </label>{" "}
        <textarea
          value={formData.faq}
          onChange={(e) => handleChange("faq", e.target.value)}
          placeholder="Enter frequently asked questions and their answers..."
          rows={4}
          maxLength={1000}
          className="w-full resize-none rounded-xl border border-[#788585]/30 bg-white px-4 py-3 text-[#38302E] placeholder-slate-500 outline-none transition focus:border-[#9CAEA9]"
        />{" "}
        <p className="mt-1 text-xs text-[#6F6866]">
          {formData.faq?.length || 0}/1000
        </p>{" "}
        {errors.faq && (
          <p className="mt-1 text-xs text-red-400">{errors.faq}</p>
        )}{" "}
      </div>{" "}
      {/* Rules */}{" "}
      <div>
        {" "}
        <label className="block text-sm font-semibold mb-2 text-[#38302E]">
          {" "}
          Rules <span className="text-red-400">*</span>{" "}
        </label>{" "}
        <textarea
          value={formData.rules}
          onChange={(e) => handleChange("rules", e.target.value)}
          placeholder="State the rules for participants..."
          rows={4}
          maxLength={2000}
          className="w-full resize-none rounded-xl border border-[#788585]/30 bg-white px-4 py-3 text-[#38302E] placeholder-slate-500 outline-none transition focus:border-[#9CAEA9]"
        />{" "}
        <p className="mt-1 text-xs text-[#6F6866]">
          {formData.rules?.length || 0}/2000
        </p>{" "}
        {errors.rules && (
          <p className="mt-1 text-xs text-red-400">{errors.rules}</p>
        )}{" "}
      </div>{" "}
      {/* Images */}{" "}
      <div className="grid gap-6 md:grid-cols-2">
        {" "}
        <ImageUploadField
          label="Banner Image"
          currentUrl={formData.bannerImageUrl}
          aspectHint="16:9 recommended"
          onUpload={(url) => handleChange("bannerImageUrl", url)}
        />{" "}
        <ImageUploadField
          label="Profile / Logo Image"
          currentUrl={formData.profileImageUrl}
          aspectHint="1:1 recommended"
          onUpload={(url) => handleChange("profileImageUrl", url)}
        />{" "}
      </div>{" "}
      <p className="text-xs text-[#6F6866]">
        {" "}
        Images are optional but strongly recommended for a professional
        appearance.{" "}
      </p>{" "}
    </div>
  );
}
