"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  ExternalLink,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  ShieldAlert,
  User,
  Check,
} from "lucide-react";
import { Priority, Status } from "@prisma/client";
import { updateTaskStatusAction } from "@/actions/task-actions";
import {
  getTaskComments,
  createCommentAction,
  CommentData,
} from "@/actions/comment-actions";

export interface TaskDetail {
  ID: number;
  Title: string;
  Description?: string | null;
  Category: string;
  Priority: Priority;
  Status: Status;
  Created_At: Date | string;
  Scheduled_Start_Date?: Date | string | null;
  Completed_Date?: Date | string | null;
  Manager?: {
    Full_Name: string;
    Username: string;
  } | null;
  Links?: { ID: number; URL: string }[];
}

interface EmployeeTaskModalProps {
  task: TaskDetail | null;
  isOpen: boolean;
  currentUserId?: number;
  onClose: () => void;
  onStatusChange?: (taskId: number, newStatus: Status) => void;
}

export default function EmployeeTaskModal({
  task,
  isOpen,
  currentUserId,
  onClose,
  onStatusChange,
}: EmployeeTaskModalProps) {
  // Status state (the ONLY editable field)
  const [currentStatus, setCurrentStatus] = useState<Status>(
    task?.Status || Status.PENDING
  );
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Comment System state
  const [comments, setComments] = useState<CommentData[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const commentsEndRef = useRef<HTMLDivElement | null>(null);

  // Sync state when task changes
  useEffect(() => {
    if (task) {
      setCurrentStatus(task.Status);
      setStatusMessage(null);
      setCommentError(null);
      loadComments(task.ID);
    }
  }, [task]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const loadComments = async (taskId: number) => {
    setCommentsLoading(true);
    const data = await getTaskComments(taskId);
    setComments(data);
    setCommentsLoading(false);
  };

  // Handle Status change (Triggers Action 2 when set to DONE)
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!task) return;
    const newStatus = e.target.value as Status;
    setCurrentStatus(newStatus);
    setStatusUpdating(true);
    setStatusMessage(null);

    const res = await updateTaskStatusAction(task.ID, newStatus);
    setStatusUpdating(false);

    if (res.success) {
      setStatusMessage(res.message || `Status updated to ${newStatus}`);
      if (onStatusChange) {
        onStatusChange(task.ID, newStatus);
      }
    } else {
      setStatusMessage(`Error: ${res.message}`);
      setCurrentStatus(task.Status); // revert
    }
  };

  // Handle Comment Submission
  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !newComment.trim() || sendingComment) return;

    setSendingComment(true);
    setCommentError(null);

    const res = await createCommentAction(task.ID, newComment);
    setSendingComment(false);

    if (res.success && res.comment) {
      setComments((prev) => [...prev, res.comment!]);
      setNewComment("");
    } else {
      setCommentError(res.message || "Failed to post comment.");
    }
  };

  if (!isOpen || !task) return null;

  // Priority color badges
  const priorityStyles: Record<Priority, string> = {
    LOW: "bg-slate-100 text-slate-800 border-slate-300",
    MEDIUM: "bg-blue-50 text-navy border-navy/30",
    HIGH: "bg-amber-50 text-amber-900 border-amber-500",
    URGENT: "bg-red-50 text-maroon border-maroon font-bold",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy/60 backdrop-blur-[2px]">
      <div className="w-full max-w-3xl bg-surface border-2 border-navy max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-navy text-surface px-6 py-4 flex items-center justify-between border-b-2 border-maroon flex-shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-mono tracking-widest uppercase bg-maroon px-2 py-0.5 text-white">
              TASK #{task.ID}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-ivory">
              {task.Category}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white hover:bg-navy-hover transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto flex flex-col divide-y divide-line bg-surface">
          {/* SECTION 1: READ-ONLY TASK DETAILS & STATUS DROPDOWN */}
          <div className="p-6 space-y-5 bg-surface">
            {/* Title (Read-Only) */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                  Task Title (Read-Only)
                </span>
                {/* Priority Badge (Read-Only) */}
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
                    priorityStyles[task.Priority]
                  }`}
                >
                  Priority: {task.Priority}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-navy uppercase tracking-tight">
                {task.Title}
              </h2>
            </div>

            {/* Description (Read-Only) */}
            <div>
              <span className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">
                Description & Instructions (Read-Only)
              </span>
              <div className="p-3 bg-ivory border border-line text-xs text-navy/90 leading-relaxed whitespace-pre-wrap font-sans">
                {task.Description || "No detailed description provided by manager."}
              </div>
            </div>

            {/* Editable Status Dropdown vs Read-only Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* THE ONLY EDITABLE FIELD */}
              <div className="p-3.5 bg-ivory border-2 border-navy">
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5 flex items-center justify-between">
                  <span>Current Status (Editable)</span>
                  {statusUpdating && (
                    <span className="text-[10px] text-maroon animate-pulse font-mono">
                      Updating...
                    </span>
                  )}
                </label>
                <select
                  value={currentStatus}
                  onChange={handleStatusChange}
                  disabled={statusUpdating}
                  className="w-full px-3 py-2 text-xs font-bold uppercase tracking-wider bg-surface border border-navy focus:outline-none text-navy cursor-pointer disabled:opacity-60"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="SCHEDULED">SCHEDULED</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="DONE">DONE (Completed)</option>
                </select>
                {statusMessage && (
                  <p className="text-[10px] font-medium text-emerald-800 mt-1.5 flex items-center">
                    <Check className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span>{statusMessage}</span>
                  </p>
                )}
              </div>

              {/* Schedule / Metadata (Read-Only) */}
              <div className="p-3.5 bg-surface border border-line space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    Assigned By:
                  </span>
                  <span className="font-semibold text-navy">
                    {task.Manager?.Full_Name || "Manager"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    Scheduled Start:
                  </span>
                  <span className="font-mono text-navy">
                    {task.Scheduled_Start_Date
                      ? new Date(task.Scheduled_Start_Date).toLocaleDateString()
                      : "Immediate"}
                  </span>
                </div>
                {task.Completed_Date && (
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                      Completed At:
                    </span>
                    <span className="font-mono text-emerald-800 font-bold">
                      {new Date(task.Completed_Date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Reference Links (Read-Only) */}
            {task.Links && task.Links.length > 0 && (
              <div>
                <span className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
                  Reference Links & Assets (Read-Only)
                </span>
                <div className="space-y-1.5">
                  {task.Links.map((link) => (
                    <a
                      key={link.ID}
                      href={link.URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2 bg-ivory border border-line hover:border-navy hover:text-maroon text-xs font-mono text-navy transition-colors group"
                    >
                      <span className="truncate max-w-[90%]">{link.URL}</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-2 text-slate-400 group-hover:text-maroon flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: CHAT-STYLE COMMENT SYSTEM */}
          <div className="p-6 bg-ivory flex-1 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-maroon" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy">
                  Production Discussion & Comments
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                {comments.length} {comments.length === 1 ? "Message" : "Messages"}
              </span>
            </div>

            {/* Comment Thread Messages */}
            <div className="min-h-[180px] max-h-[260px] overflow-y-auto space-y-3 pr-1">
              {commentsLoading ? (
                <div className="text-center py-8 text-xs text-slate-400 uppercase tracking-wider font-mono">
                  Loading discussion thread...
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-line bg-surface p-6">
                  No discussion comments yet. Share sample fit notes, photoshoot status, or questions below.
                </div>
              ) : (
                comments.map((c) => {
                  const isCurrentUser = currentUserId === c.User_ID;
                  const isManager = c.User.Role === "MANAGER";

                  return (
                    <div
                      key={c.ID}
                      className={`flex flex-col ${
                        isCurrentUser ? "items-end" : "items-start"
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1 px-1">
                        <span className="text-[11px] font-bold uppercase text-navy">
                          {c.User.Full_Name}
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.2 border ${
                            isManager
                              ? "bg-maroon text-white border-maroon"
                              : "bg-slate-200 text-slate-700 border-slate-300"
                          }`}
                        >
                          {c.User.Role}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">
                          {new Date(c.Created_At).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div
                        className={`p-3 text-xs leading-relaxed max-w-[85%] border ${
                          isCurrentUser
                            ? "bg-surface border-navy text-navy"
                            : "bg-surface border-line text-navy"
                        }`}
                      >
                        {c.Content}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={commentsEndRef} />
            </div>

            {/* New Comment Input Form */}
            {commentError && (
              <p className="text-[11px] text-maroon flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                {commentError}
              </p>
            )}

            <form onSubmit={handleSendComment} className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type your message, fit notes, or task feedback..."
                className="flex-1 px-3 py-2 text-xs bg-surface border border-navy focus:outline-none text-navy placeholder:text-slate-400 font-medium"
              />
              <button
                type="submit"
                disabled={sendingComment || !newComment.trim()}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-maroon text-white text-xs font-bold uppercase tracking-wider hover:bg-maroon-hover transition-colors disabled:opacity-50 flex-shrink-0"
              >
                <span>{sendingComment ? "Posting..." : "Send"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
