import { format } from "date-fns";
import { Download, Eye, FileText } from "lucide-react";
import React from "react";
import { Achievement } from "../types";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import Card from "./ui/Card";

interface AchievementCardProps {
  achievement: Achievement;
  showControls?: boolean;
  onView?: (achievement: Achievement) => void;
  onReview?: (achievement: Achievement) => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  showControls = false,
  onView,
  onReview,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge variant="success">Approved</Badge>;
      case "Rejected":
        return <Badge variant="error">Rejected</Badge>;
      case "Under Review":
      default:
        return <Badge variant="warning">Under Review</Badge>;
    }
  };

  // Helper to get certificate download/view URL
  const getCertificateUrl = () => {
    if (!achievement.certificatePdf) return "#";
    return achievement.certificatePdf; // Google Drive link
  };

  // Helper to get direct download link for Google Drive
  const getDownloadUrl = () => {
    const url = achievement.certificatePdf;
    // If it's a Google Drive share link, convert to direct download
    // e.g. https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    const match = url.match(/\/file\/d\/([^/]+)\//);
    if (match) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return url;
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {achievement.title}
        </h3>
        {getStatusBadge(achievement.status)}
      </div>

      <p className="text-gray-600 mb-3 flex-grow">{achievement.description}</p>

      <div className="text-sm text-gray-500 mb-4">
        <div className="flex justify-between">
          <span>Academic Year: {achievement.academicYear}</span>
          <span>Certificate Year: {achievement.certificateYear}</span>
        </div>
        <div className="mt-1">
          Uploaded: {format(new Date(achievement.submittedAt), "MMM d, yyyy")}
        </div>
        {achievement.status === "Approved" && achievement.reviewedAt && (
          <div>
            Accepted: {format(new Date(achievement.reviewedAt), "MMM d, yyyy")}
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-primary-600">
            <FileText size={16} className="mr-1" />
            <span className="text-sm">Certificate</span>
          </div>
          <div className="flex space-x-2">
            {achievement.certificatePdf && (
              <>
                <a
                  href={getCertificateUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-2 py-1 text-xs rounded bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200"
                  title="View Certificate PDF"
                >
                  <Download size={14} className="mr-1" />
                  View PDF
                </a>
                <a
                  href={getDownloadUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center px-2 py-1 text-xs rounded bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                  title="Download Certificate PDF"
                >
                  <Download size={14} className="mr-1" />
                  Download PDF
                </a>
              </>
            )}
            {showControls && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView && onView(achievement)}
                  className="flex items-center"
                >
                  <Eye size={14} className="mr-1" />
                  View
                </Button>
                {achievement.status === "Under Review" && onReview && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onReview && onReview(achievement)}
                  >
                    Review
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        {/* Always show PDF link for HOD/faculty */}
        {achievement.certificatePdf && (
          <div className="mt-2">
            <a
              href={achievement.certificatePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 underline text-xs"
            >
              Certificate PDF Link
            </a>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AchievementCard;
