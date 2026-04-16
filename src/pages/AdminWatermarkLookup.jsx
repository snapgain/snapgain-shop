import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Search, Download, Loader2, AlertTriangle, FileText, User, Calendar, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { callEdge } from "@/lib/edge";

const AdminWatermarkLookup = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResults(null);
    setSearched(false);

    try {
      // Call the admin-protected edge function
      const data = await callEdge("resolve-watermark", {
        hash_segment: query.trim(),
      });

      setResults(data || []);
      setSearched(true);
      
      if (data && data.length > 0) {
        toast({
          title: "Search Complete",
          description: `Found ${data.length} matching access records.`,
        });
      } else {
        toast({
          title: "No Matches",
          description: "No access logs found matching that watermark hash segment.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Failed",
        description: error.message || "An error occurred while resolving the watermark.",
        variant: "destructive",
      });
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!results || results.length === 0) return;

    const headers = ["Timestamp", "User Email", "User ID", "Product", "Chapter", "Locale", "Watermark Hash", "IP Address"];
    const csvContent = [
      headers.join(","),
      ...results.map(row => {
        return [
          new Date(row.created_at).toISOString(),
          row.user_email || "Unknown",
          row.user_id,
          row.product_slug,
          row.chapter_number,
          row.locale,
          row.watermark_hash,
          row.ip_address || "N/A"
        ].map(cell => `"${String(cell || "").replace(/"/g, '""')}"`).join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `watermark_report_${query}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Helmet>
        <title>Watermark Forensics - SnapGain Admin</title>
      </Helmet>

      <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] font-heading">
                Content Forensics
              </h1>
              <p className="text-[var(--text-secondary)] mt-1">
                Trace leaked content back to the original access log via watermark hash.
              </p>
            </div>
          </div>

          {/* Search Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <form onSubmit={handleSearch} className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">
                  Watermark Hash (Full or Partial)
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. 7f8a9b..."
                    className="pl-10 font-mono"
                    autoFocus
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={loading || !query.trim()}
                className="bg-[var(--color-purple)] text-white hover:bg-[var(--color-purple)]/90"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                Trace Content
              </Button>
            </form>
          </div>

          {/* Results Area */}
          {results && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  Search Results <span className="text-sm font-normal text-[var(--text-secondary)] ml-2">({results.length} records)</span>
                </h2>
                {results.length > 0 && (
                  <Button variant="outline" size="sm" onClick={handleExportCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                )}
              </div>

              {results.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-12 text-center">
                  <div className="bg-slate-100 dark:bg-slate-800 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-6 w-6 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-[var(--text-primary)]">No matches found</h3>
                  <p className="text-[var(--text-secondary)] max-w-md mx-auto mt-2">
                    No access logs matched the watermark segment "{query}". Try checking the hash again or using a shorter segment.
                  </p>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-6 py-4">Timestamp</th>
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">Content Accessed</th>
                          <th className="px-6 py-4">Watermark Hash</th>
                          <th className="px-6 py-4">Context</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {results.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <span className="text-[var(--text-primary)]">
                                  {new Date(row.created_at).toLocaleDateString()}
                                </span>
                                <span className="text-[var(--text-secondary)] text-xs">
                                  {new Date(row.created_at).toLocaleTimeString()}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-slate-400" />
                                <div>
                                  <div className="font-medium text-[var(--text-primary)]">{row.user_email || "Unknown Email"}</div>
                                  <div className="text-xs text-[var(--text-secondary)] font-mono">{row.user_id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-slate-400" />
                                <div>
                                  <div className="text-[var(--text-primary)] font-medium">{row.product_slug}</div>
                                  <div className="text-xs text-[var(--text-secondary)]">Chapter {row.chapter_number} ({row.locale})</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono text-[var(--color-purple)]">
                                {row.watermark_hash}
                              </code>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-xs text-[var(--text-secondary)] space-y-1">
                                <div>IP: {row.ip_address || "N/A"}</div>
                                {row.country_code && <div>Location: {row.country_code}</div>}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminWatermarkLookup;