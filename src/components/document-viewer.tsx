"use client";

import { useState } from "react";
import { Document } from "@/lib/supabase";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  Calendar, 
  Clock, 
  Tag,
  Edit,
  Save,
  Plus
} from "lucide-react";

interface DocumentViewerProps {
  todayJournal: Document | null;
}

export function DocumentViewer({ todayJournal }: DocumentViewerProps) {
  const [activeDoc, setActiveDoc] = useState<Document | null>(todayJournal);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  const handleEdit = () => {
    if (activeDoc) {
      setEditedContent(activeDoc.content);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    // Save logic would go here
    setIsEditing(false);
  };

  if (!activeDoc) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No document selected</p>
          <p className="text-sm mt-2">Select a note, journal entry, or task from the sidebar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  activeDoc.type === "journal"
                    ? "bg-blue-500/20 text-blue-400"
                    : activeDoc.type === "task"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {activeDoc.type}
              </span>
              {activeDoc.date && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(activeDoc.date), "MMMM d, yyyy")}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold">{activeDoc.title}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Created {format(new Date(activeDoc.created_at), "MMM d, yyyy 'at' h:mm a")}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Updated {format(new Date(activeDoc.updated_at), "MMM d, yyyy 'at' h:mm a")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-full bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed"
            placeholder="Start writing in markdown..."
          />
        ) : (
          <div className="markdown max-w-3xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {activeDoc.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
