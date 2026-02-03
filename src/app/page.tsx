import { Sidebar } from "@/components/sidebar";
import { DocumentViewer } from "@/components/document-viewer";
import { getDocuments, getTasks, getTodayJournal } from "@/lib/supabase";

export default async function Home() {
  const documents = await getDocuments();
  const tasks = await getTasks();
  const todayJournal = await getTodayJournal();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar documents={documents} tasks={tasks} />
      <main className="flex-1 overflow-hidden">
        <DocumentViewer todayJournal={todayJournal} />
      </main>
    </div>
  );
}
