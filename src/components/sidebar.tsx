"use client";

import { useState } from "react";
import { Document, Task } from "@/lib/supabase";
import { 
  FileText, 
  Calendar, 
  CheckSquare, 
  Search,
  Clock,
  BookOpen,
  ChevronRight,
  Plus
} from "lucide-react";
import { format } from "date-fns";

interface SidebarProps {
  documents: Document[];
  tasks: Task[];
}

export function Sidebar({ documents, tasks }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"notes" | "journal" | "tasks">("notes");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const notes = filteredDocs.filter((d) => d.type === "note");
  const journals = filteredDocs.filter((d) => d.type === "journal");

  const taskCounts = {
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
    archive: tasks.filter((t) => t.status === "archive").length,
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-primary" />
          <h1 className="text-lg font-semibold">2nd Brain</h1>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-muted rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("notes")}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === "notes"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="w-4 h-4" />
          Notes
          <span className="bg-muted px-2 py-0.5 rounded-full text-xs">
            {notes.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("journal")}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === "journal"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Journal
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === "tasks"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          Tasks
          <span className="bg-muted px-2 py-0.5 rounded-full text-xs">
            {taskCounts.todo + taskCounts["in-progress"]}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "notes" && (
          <div className="p-2">
            {notes.map((note) => (
              <button
                key={note.id}
                className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium truncate flex-1">{note.title}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {note.content.slice(0, 100)}...
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(note.updated_at), "MMM d, yyyy")}
                </p>
              </button>
            ))}
            {notes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notes yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "journal" && (
          <div className="p-2">
            {journals.map((entry) => (
              <button
                key={entry.id}
                className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">
                    {format(new Date(entry.date), "MMMM d, yyyy")}
                  </span>
                  {entry.date === new Date().toISOString().split("T")[0] && (
                    <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded">
                      Today
                    </span>
                  )}
                </div>
              </button>
            ))}
            {journals.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No journal entries yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="p-2">
            {/* Task Status Summary */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-muted p-2 rounded-lg text-center">
                <p className="text-2xl font-bold">{taskCounts.todo}</p>
                <p className="text-xs text-muted-foreground">To Do</p>
              </div>
              <div className="bg-muted p-2 rounded-lg text-center">
                <p className="text-2xl font-bold">{taskCounts["in-progress"]}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
              <div className="bg-muted p-2 rounded-lg text-center">
                <p className="text-2xl font-bold">{taskCounts.done}</p>
                <p className="text-xs text-muted-foreground">Done</p>
              </div>
              <div className="bg-muted p-2 rounded-lg text-center">
                <p className="text-2xl font-bold">{taskCounts.archive}</p>
                <p className="text-xs text-muted-foreground">Archive</p>
              </div>
            </div>

            {/* Task List */}
            {tasks.map((task) => (
              <button
                key={task.id}
                className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors group mb-1"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      task.priority === "high"
                        ? "bg-red-500"
                        : task.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  />
                  <span className="font-medium truncate flex-1">{task.title}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      task.status === "todo"
                        ? "bg-muted text-muted-foreground"
                        : task.status === "in-progress"
                        ? "bg-blue-500/20 text-blue-400"
                        : task.status === "done"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {task.status.replace("-", " ")}
                  </span>
                </div>
              </button>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No tasks yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
