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
    // Assumes backend serves at /api/certificates/:id
    return `/api/certificates/${achievement.certificatePdf}`;
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
      </div>
    </Card>
  );
};

export default AchievementCard;
