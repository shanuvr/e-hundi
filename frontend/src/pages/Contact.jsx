import { useState } from 'react';
import PolicyLayout from './PolicyLayout';
import { Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    templeName: '',
    queryType: 'general',
    message: '',
    utrNumber: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PolicyLayout
      title="Contact Us & Helpdesk"
      subtitle="Have questions about onboarding your temple or need support for a recent transaction? We are here to assist."
      icon={Phone}
      currentPath="/contact"
    >
      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-stone-100 mb-1">Registered Office</h3>
            <p className="text-xs text-stone-400 mb-3">Principal place of business</p>
            <p className="text-sm text-stone-300 leading-relaxed">
              <strong className="text-stone-100">Programers</strong><br />
              4th Floor, Park House,<br />
              Thrissur, Kerala 680001,<br />
              India
            </p>
          </div>
          <span className="text-[11px] text-stone-400 mt-4 pt-3 border-t border-stone-800">
            PIN: 680001 · Kerala, India
          </span>
        </div>

        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center mb-4">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-stone-100 mb-1">Phone & WhatsApp</h3>
            <p className="text-xs text-stone-400 mb-3">Mon - Sat: 9:30 AM to 6:00 PM IST</p>
            <div className="space-y-2">
              <a
                href="tel:+919447151442"
                className="block text-base font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                +91 9447151442
              </a>
              <p className="text-xs text-stone-400 leading-relaxed">
                Direct helpline for temple onboarding and payment discrepancy inquiries.
              </p>
            </div>
          </div>
          <span className="text-[11px] text-stone-400 mt-4 pt-3 border-t border-stone-800">
            Language: Malayalam / English
          </span>
        </div>

        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-stone-100 mb-1">Email Desk</h3>
            <p className="text-xs text-stone-400 mb-3">Official administrative inquiries</p>
            <div className="space-y-2">
              <a
                href="mailto:info@programers.in"
                className="block text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors break-all"
              >
                info@programers.in
              </a>
              <p className="text-xs text-stone-400 leading-relaxed">
                Send queries, payment UTR numbers, or temple verification documents.
              </p>
            </div>
          </div>
          <span className="text-[11px] text-stone-400 mt-4 pt-3 border-t border-stone-800">
            Fast Response Window
          </span>
        </div>
      </div>

      {/* Transaction & Grievance Resolution Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <Clock className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-stone-100">
              Payment Dispute & Double-Debit Resolution Commitment
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              If a payment fails while your bank account is debited, or if an accidental duplicate charge occurs during UPI payment, please email us at <strong className="text-amber-300">info@programers.in</strong> or call <strong className="text-amber-300">+91 9447151442</strong> with your 12-digit UPI reference (UTR number). We will investigate with Razorpay and resolve the issue within <strong className="text-amber-300">7 business days</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Helpdesk Contact Form */}
      <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold font-philosopher text-stone-100 mb-2">
          Send Us a Message
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 mb-6">
          Whether you are a temple committee looking to install Kanikkavanji or a devotee needing transaction assistance, fill in the details below.
        </p>

        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-lg font-semibold text-emerald-300">Message Received</h4>
            <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
              Thank you for reaching out. The Programers team will review your request and get back to you within 24 to 48 business hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs text-amber-400 underline pt-2 inline-block cursor-pointer"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Anand Menon"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Mobile Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="devotee@example.com"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Inquiry Category *
                </label>
                <select
                  value={formData.queryType}
                  onChange={(e) => setFormData({ ...formData, queryType: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-200 focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="general">General Inquiry</option>
                  <option value="temple_onboarding">Temple Registration (₹5,000 Setup)</option>
                  <option value="failed_payment">Payment Debited but Failed</option>
                  <option value="duplicate_charge">Duplicate Charge Concern</option>
                  <option value="technical">Technical Support</option>
                </select>
              </div>
            </div>

            {(formData.queryType === 'failed_payment' || formData.queryType === 'duplicate_charge') && (
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  UPI 12-Digit Reference / UTR Number
                </label>
                <input
                  type="text"
                  value={formData.utrNumber}
                  onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value })}
                  placeholder="e.g. 329847192837"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Message / Description *
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Provide details of your inquiry or temple details..."
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-amber-500 text-stone-950 font-semibold text-sm hover:bg-amber-400 active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-amber-500/20"
            >
              Submit Inquiry
            </button>
          </form>
        )}
      </div>
    </PolicyLayout>
  );
}
