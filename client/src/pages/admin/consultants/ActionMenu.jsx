import React, { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ActionMenu = ({ consultantId }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* VIEW PROFILE */
  const handleViewProfile = () => {
    navigate(`/admin/consultants/profile/${consultantId}`);
    setOpen(false);
  };

  /* SUSPEND */
  const handleSuspend = () => {
    navigate(`/admin/consultants/suspend/${consultantId}`);
    setOpen(false);
  };

  /* CHANGE TIER ✅ */
  const handleChangeTier = () => {
    navigate(`/admin/consultants/change-tier/${consultantId}`);
    setOpen(false);
  };

  /* VIEW RANKING ✅ */
const handleViewRanking = () => {
  navigate(`/admin/consultants/ranking/${consultantId}`);
  setOpen(false);
};

  /* FLAG FOR REVIEW */
  const handleFlagForReview = () => {
    navigate(`/admin/consultants/flag-review/${consultantId}`);
    setOpen(false);
  };

  /* FORCE AUDIT */
  const handleForceAudit = () => {
    navigate(`/admin/consultants/force-audit/${consultantId}`);
    setOpen(false);
  }

  /* ADD INTERNAL NOTE */
  const handleAddNote = () => {
    navigate(`/admin/consultants/add-note/${consultantId}`);
    setOpen(false);
  }
  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border z-[9999]">
          <ul className="py-2 text-[15px]">

            <Item onClick={handleViewProfile}>
              View Profile
            </Item>

            <Item danger onClick={handleSuspend}>
              Suspend Consultant
            </Item>

            <Item onClick={handleChangeTier}>
              Change Tier
            </Item>

            <Item onClick={handleViewRanking}>
              View Ranking Breakdown
            </Item>

            <Item warning onClick={handleFlagForReview}>
              Flag for Review
            </Item>

            <Item onClick={handleForceAudit}>
              Force Audit
            </Item>

            <Item onClick={handleAddNote}>
              Add Internal Note
            </Item>
 

 {/* FlagForReviewModal */}
          {/* <Route path="consultants/flag-review/:id" element={<FlagForReviewModal/>} /> */}
          {/* ForceAuditModal */}
          {/* <Route path="consultants/force-audit/:id" element={<ForceAuditModal/>} /> */}
          {/* AddNoteModal */}
          {/* <Route path="consultants/add-note/:id" element={<InternalNoteModal/>} /> */}
             
          </ul>
        </div>
      )}
    </div>
  );
};

const Item = ({ children, onClick, danger, warning }) => {
  let color = "text-gray-700 hover:bg-gray-50";
  if (danger) color = "text-red-600 hover:bg-red-50";
  if (warning) color = "text-orange-600 hover:bg-orange-50";

  return (
    <li
      onClick={onClick}
      className={`px-5 py-3 cursor-pointer font-medium rounded-lg transition ${color}`}
    >
      {children}
    </li>
  );
};

export default ActionMenu;