import { useState } from "react";
import { X, Sparkles, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateFormData } from "../redux/hostSlice";
import { generateDescription } from "../services/hostService";

export default function AIDescriptionModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    powered_by: "",
    problem_worth_solving: "",
    hackathon_overview: "",
    total_prize_pool: "",
    prize_breakdown: "",
    categories_tracks: "",
    start_date: "",
    end_date: "",
    winners_announced: "",
    steps_to_participate: "",
    important_links: "",
    evaluation_criteria: "",
    judges_details: "",
    who_should_join: "",
    perks_of_participating: "",
    sponsor_description: "",
  });

  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFaqChange = (index, field, value) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFaq = (index) => {
    const newFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(newFaqs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert FAQs array to the object format expected in the example
    const formattedFaq = faqs
      .filter((f) => f.question && f.answer)
      .map((f) => ({ [f.question]: f.answer }));

    const payload = {
      ...formData,
      faq: formattedFaq,
    };

    setLoading(true);
    try {
      const description = await generateDescription(payload);
      dispatch(updateFormData({ description }));
      toast.success("AI Description generated successfully!");
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to generate description.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-warm-stone/40 bg-white px-4 py-2 text-sm text-deep-espresso focus:border-dark-khaki focus:outline-none focus:ring-1 focus:ring-dark-khaki transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-corn-silk shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-warm-stone/20 px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-dark-khaki" />
            <h2 className="text-xl font-bold text-deep-espresso">AI Description Generator</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-[#ff8080] hover:bg-[#ff8080]/10  transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
          <form id="ai-desc-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-deep-espresso mb-1">Title</label>
                <input name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="Hackathon Title" required />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-deep-espresso mb-1">Tagline</label>
                <input name="tagline" value={formData.tagline} onChange={handleChange} className={inputClass} placeholder="Catchy Tagline" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-deep-espresso mb-1">Powered By</label>
                <input name="powered_by" value={formData.powered_by} onChange={handleChange} className={inputClass} placeholder="Sponsoring Organization" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-deep-espresso mb-1">Start Date</label>
                <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-deep-espresso mb-1">End Date</label>
                <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-deep-espresso mb-1">Winners Announced</label>
                <input name="winners_announced" value={formData.winners_announced} onChange={handleChange} className={inputClass} placeholder="e.g. 2 days after end" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-deep-espresso mb-1">Total Prize Pool</label>
                <input name="total_prize_pool" value={formData.total_prize_pool} onChange={handleChange} className={inputClass} placeholder="$10,000" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-deep-espresso mb-1">Problem Worth Solving</label>
                <textarea rows={2} name="problem_worth_solving" value={formData.problem_worth_solving} onChange={handleChange} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-deep-espresso mb-1">Hackathon Overview</label>
                <textarea rows={2} name="hackathon_overview" value={formData.hackathon_overview} onChange={handleChange} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-deep-espresso mb-1">Prize Breakdown</label>
                <textarea rows={2} name="prize_breakdown" value={formData.prize_breakdown} onChange={handleChange} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-deep-espresso mb-1">Categories / Tracks</label>
                <textarea rows={2} name="categories_tracks" value={formData.categories_tracks} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div className="space-y-4 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-deep-espresso mb-1">Steps to Participate</label>
                    <textarea rows={2} name="steps_to_participate" value={formData.steps_to_participate} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-deep-espresso mb-1">Important Links</label>
                    <textarea rows={2} name="important_links" value={formData.important_links} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-deep-espresso mb-1">Evaluation Criteria</label>
                    <textarea rows={2} name="evaluation_criteria" value={formData.evaluation_criteria} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-deep-espresso mb-1">Judges Details</label>
                    <textarea rows={2} name="judges_details" value={formData.judges_details} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-deep-espresso mb-1">Who Should Join</label>
                    <textarea rows={2} name="who_should_join" value={formData.who_should_join} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-deep-espresso mb-1">Perks of Participating</label>
                    <textarea rows={2} name="perks_of_participating" value={formData.perks_of_participating} onChange={handleChange} className={inputClass} />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-deep-espresso mb-1">Sponsor Description</label>
                    <textarea rows={2} name="sponsor_description" value={formData.sponsor_description} onChange={handleChange} className={inputClass} />
                </div>
            </div>

            <div className="md:col-span-2 space-y-4 border-t border-warm-stone/20 pt-6 mt-2">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-deep-espresso">FAQs</label>
                    <button type="button" onClick={addFaq} className="flex items-center gap-1 text-sm font-medium text-dark-khaki hover:text-deep-espresso">
                        <Plus className="h-4 w-4" /> Add FAQ
                    </button>
                </div>
                {faqs.map((faq, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                        <div className="flex-1 space-y-2">
                            <input value={faq.question} onChange={(e) => handleFaqChange(idx, "question", e.target.value)} className={inputClass} placeholder="Question" />
                            <input value={faq.answer} onChange={(e) => handleFaqChange(idx, "answer", e.target.value)} className={inputClass} placeholder="Answer" />
                        </div>
                        {faqs.length > 1 && (
                            <button type="button" onClick={() => removeFaq(idx)} className="mt-2 text-red-500 hover:text-red-700">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-warm-stone/20 bg-corn-silk/50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2 rounded-xl text-sm font-medium border border-warm-stone/40 text-deep-espresso bg-white hover:bg-deep-espresso hover:text-white transition-colors">
            Cancel
          </button>
          <button type="submit" form="ai-desc-form" disabled={loading} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-dark-khaki text-white hover:bg-deep-espresso transition-colors disabled:opacity-50">
            {loading ? <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" /> : <Sparkles className="h-4 w-4" />}
            Generate
          </button>
        </div>

      </div>
    </div>
  );
}
