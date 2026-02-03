import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Document = {
  id: string;
  title: string;
  content: string;
  type: "journal" | "note" | "task";
  date: string;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  title: string;
  content: string;
  status: "todo" | "in-progress" | "done" | "archive";
  priority: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
};

export async function getDocuments(): Promise<Document[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching documents:", error);
    return [];
  }

  return data || [];
}

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }

  return data || [];
}

export async function getTodayJournal(): Promise<Document | null> {
  const today = new Date().toISOString().split("T")[0];
  
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("type", "journal")
    .eq("date", today)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching today journal:", error);
  }

  return data;
}

export async function createDocument(doc: Partial<Document>) {
  const { data, error } = await supabase
    .from("documents")
    .insert(doc)
    .select()
    .single();

  if (error) {
    console.error("Error creating document:", error);
    return null;
  }

  return data;
}

export async function updateDocument(id: string, updates: Partial<Document>) {
  const { data, error } = await supabase
    .from("documents")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating document:", error);
    return null;
  }

  return data;
}

export async function createTask(task: Partial<Task>) {
  const { data, error } = await supabase
    .from("tasks")
    .insert(task)
    .select()
    .single();

  if (error) {
    console.error("Error creating task:", error);
    return null;
  }

  return data;
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating task:", error);
    return null;
  }

  return data;
}
