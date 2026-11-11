"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";
import { Priority } from "@prisma/client";
import { createTaskAction, getEmployees } from "@/actions/task-actions";

interface EmployeeOption {
  ID: number;
  Full_Name: string;
  Username: string;
}

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialEmployees?: EmployeeOption[];
}

export default function NewTaskModal({
  isOpen,
  onClose,
  onSuccess,
  initialEmployees,
}: NewTaskModalProps) {
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Apparel Production");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [scheduledStartDate, setScheduledStartDate] = useState("");
  const [links, setLinks] = useState<string[]>([""]); // Starts with 1 URL field

  // Async & Feedback State
  const [employees, setEmployees] = useState<EmployeeOption[]>(initialEmployees || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Categories aligned with clothing brand operations
  const categories = [
    "Apparel Production",
    "Sample Fitting & QC",
    "Photoshoot & Creative",
    "Marketing & Campaign",
    "Inventory & Drop Logistics",
    "Fabric & Raw Materials",
  ];

  // Fetch employees if not supplied via props
  useEffect(() => {
    if (isOpen && (!initialEmployees || initialEmployees.length === 0)) {
      getEmployees().then((data) => setEmployees(data));
    }
  }, [isOpen, initialEmployees]);

  // Reset form when modal closes or opens
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Apparel Production");
    setPriority("MEDIUM");
    setEmployeeId("");
    setScheduledStartDate("");
    setLinks([""]);
    setError(null);
    setSuccessMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Dynamic Link Array Handlers
  const handleLinkChange = (index: number, value: string) => {
    const updated = [...links];
    updated[index] = value;
    setLinks(updated);
  };

  const addAnotherLink = () => {
    setLinks([...links, ""]);
  };

  const removeLink = (index: number) => {
    if (links.length <= 1) {
      setLinks([""]);
    } else {
      setLinks(links.filter((_, i) => i !== index));
    }
  };

  // Submission handler via Server Action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await createTaskAction({
        title,
        description,
        category,
        priority,
        employeeId: employeeId ? Number(employeeId) : null,
        scheduledStartDate: scheduledStartDate || null,
        links,
      });

      if (!res.success) {
        setError(res.message || "Failed to create task.");
        setLoading(false);
        return;
      }

      setSuccessMessage("Task created successfully!");
      setLoading(false);

      // Trigger optional callback and close modal after brief visual confirmation
      setTimeout(() => {
        resetForm();
        onClose();
        if (onSuccess) onSuccess();
      }, 500);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-[2px]">
      {/* Modal Surface */}
      <div className="w-full max-w-2xl bg-surface border-2 border-navy max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-navy text-surface px-6 py-4 flex items-center justify-between border-b-2 border-maroon">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-ivory" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-ivory">
                New Production Task
              </h2>
              <p className="text-[10px] text-slate-300 uppercase tracking-widest">
                Comrades Legacy Operations
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 text-slate-300 hover:text-white hover:bg-navy-hover transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 bg-surface">
          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-maroon flex items-center space-x-2 text-xs text-maroon">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border-l-4 border-emerald-700 flex items-center space-x-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
              Task Title <span className="text-maroon">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Winter Drop 2026 - Panjabi QC & Packaging"
              className="w-full px-3 py-2 text-xs bg-ivory border border-navy/30 focus:border-navy focus:outline-none text-navy placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
              Description / Instructions
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed instructions for the production or photoshoot team..."
              className="w-full px-3 py-2 text-xs bg-ivory border border-navy/30 focus:border-navy focus:outline-none text-navy placeholder:text-slate-400 font-medium resize-none"
            />
          </div>

          {/* Grid: Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                Category <span className="text-maroon">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-ivory border border-navy/30 focus:border-navy focus:outline-none text-navy font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 text-xs bg-ivory border border-navy/30 focus:border-navy focus:outline-none text-navy font-medium"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
          </div>

          {/* Grid: Assignee (Employee) & Scheduled Start Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                Assignee (Employee)
              </label>
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-ivory border border-navy/30 focus:border-navy focus:outline-none text-navy font-medium"
              >
                <option value="">— Unassigned —</option>
                {employees.map((emp) => (
                  <option key={emp.ID} value={emp.ID}>
                    {emp.Full_Name} (@{emp.Username})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                Scheduled Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={scheduledStartDate}
                  onChange={(e) => setScheduledStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-ivory border border-navy/30 focus:border-navy focus:outline-none text-navy font-medium"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Link Array Section */}
          <div className="border-t border-line pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-navy">
                <LinkIcon className="w-3.5 h-3.5 text-maroon" />
                <span>Reference Links & Assets</span>
              </label>
              <button
                type="button"
                onClick={addAnotherLink}
                className="inline-flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-maroon hover:text-maroon-hover"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Link</span>
              </button>
            </div>

            <div className="space-y-2">
              {links.map((link, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    placeholder={`https://drive.google.com/folder/... or asset URL #${index + 1}`}
                    className="flex-1 px-3 py-1.5 text-xs bg-ivory border border-navy/30 focus:border-navy focus:outline-none text-navy placeholder:text-slate-400 font-mono"
                  />
                  {links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="p-1.5 text-slate-400 hover:text-maroon border border-transparent hover:border-maroon/30 transition-colors"
                      title="Remove link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 tracking-wide">
              Paste drive links, tech packs, catalog moodboards, or sheet references.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-line flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-navy text-navy hover:bg-ivory transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-xs font-bold uppercase tracking-wider bg-maroon text-white hover:bg-maroon-hover transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <span>Creating Task...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
