import React, { useState } from "react";
import {
  X,
  Share2,
  Facebook,
  Linkedin,
  Mail,
  MessageSquare,
  Copy,
} from "lucide-react";

interface SharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionTitle: string;
  actionDescription: string;
  virtueName: string;
}

export const SharingModal: React.FC<SharingModalProps> = ({
  isOpen,
  onClose,
  actionTitle,
  actionDescription,
  virtueName,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `I just completed my course "${actionTitle}" focused on ${virtueName}! ${actionDescription} Join me in learning with Learning Micro-Academy.`;
  const shareUrl = window.location.origin;

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const shareToLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}&summary=${encodeURIComponent(shareText)}`;
    window.open(linkedinUrl, "_blank", "width=600,height=400");
  };

  const shareViaEmail = () => {
    const subject = `I completed my Learning Micro-Academy course: ${actionTitle}`;
    const body = `${shareText}\n\nCheck out Learning Micro-Academy: ${shareUrl}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const shareViaText = () => {
    const textUrl = `sms:?body=${encodeURIComponent(
      shareText + " " + shareUrl
    )}`;
    window.location.href = textUrl;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText + " " + shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Share2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Share Your Success
              </h2>
              <p className="text-sm text-slate-600">
                Inspire others with your completed action
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Action Preview */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-slate-900 mb-2">{actionTitle}</h3>
            <p className="text-sm text-slate-600 mb-2">{actionDescription}</p>
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              {virtueName}
            </span>
          </div>

          {/* Share Text Preview */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Share Message:
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700">
              {shareText}
            </div>
          </div>

          {/* Sharing Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-700 mb-3">
              Share on Social Media:
            </h4>

            {/* Facebook */}
            <button
              onClick={shareToFacebook}
              className="w-full flex items-center space-x-3 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span>Share on Facebook</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={shareToLinkedIn}
              className="w-full flex items-center space-x-3 p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span>Share on LinkedIn</span>
            </button>

            {/* Email */}
            <button
              onClick={shareViaEmail}
              className="w-full flex items-center space-x-3 p-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span>Share via Email</span>
            </button>

            {/* Text Message */}
            <button
              onClick={shareViaText}
              className="w-full flex items-center space-x-3 p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Share via Text</span>
            </button>

            {/* Copy to Clipboard */}
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center space-x-3 p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              <Copy className="h-5 w-5" />
              <span>{copied ? "Copied!" : "Copy to Clipboard"}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <p className="text-xs text-slate-500 text-center">
            Help spread the word about Learning Micro-Academy and inspire others
            to learn!
          </p>
        </div>
      </div>
    </div>
  );
};
