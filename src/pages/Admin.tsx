import { useEffect, useState, useCallback, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  LogOut,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Clock,
  ExternalLink,
  Upload,
  Zap as LightningIcon,
  Star as StarIcon,
  MapPin,
  Image as ImageIcon,
  BarChart3,
  ChevronRight
} from "lucide-react";
import { Modal, AdminTable, ActionButton } from "../components/AdminCMS";

interface Profile {
  id: string;
  full_name: string | null;
  role: string;
}

interface Project {
  id: string;
  title: string;
  location: string;
  capacity_kw: number;
  image_url: string;
  created_at: string;
  client_name: string;
  review: string;
  client_image: string | null;
}

interface Lead {
  id: string;
  full_name: string;
  email: string;
  city: string;
  monthly_bill: number;
  roof_type: string;
  created_at: string;
}

const SidebarItem = ({
  icon: Icon,
  label,
  onClick,
  active = false
}: {
  icon: any,
  label: string,
  onClick?: () => void,
  active?: boolean
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${active
      ? "bg-white/10 text-solar-gold shadow-lg font-bold"
      : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
  >
    {active && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-solar-gold rounded-r-full" />
    )}
    <Icon className={`w-5 h-5 transition-colors ${active ? "text-solar-gold" : "group-hover:text-white"}`} />
    <span className="font-medium tracking-tight">{label}</span>
    {active && <ChevronRight className="w-4 h-4 ml-auto text-solar-gold/50" />}
  </button>
);

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [profile, setProfile] = useState<Profile | null>(null);

  // Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projectCount, setProjectCount] = useState(0);
  const [leadCount, setLeadCount] = useState(0);

  // --- Project State Setup ---
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Auth State Listener & Initial Check
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profileData || profileData.role !== "admin") {
        navigate("/");
        return;
      }

      setProfile(profileData);
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Data Fetching
  const fetchData = useCallback(async () => {
    try {
      if (activeTab === "Projects") {
        const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
        setProjects(data || []);
      } else if (activeTab === "Leads") {
        const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
        setLeads(data || []);
      }

      // Always fetch counts for Dashboard
      const { count: pC } = await supabase.from("projects").select("*", { count: "exact", head: true });
      const { count: lC } = await supabase.from("leads").select("*", { count: "exact", head: true });
      setProjectCount(pC || 0);
      setLeadCount(lC || 0);

    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!loading) fetchData();
  }, [loading, fetchData]);

  // Handlers
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // --- Project Management Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return alert("File size exceeds 5MB");
      if (!file.type.startsWith("image/")) return alert("Only image files are allowed");
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePublishProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPublishing(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      let imageUrl = editingProject?.image_url || "";

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `projects/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("project-images")
          .getPublicUrl(uploadData.path);

        imageUrl = publicUrl;
      }

      const payload = {
        title: formData.get("title") as string,
        location: formData.get("location") as string,
        capacity_kw: Number(formData.get("capacity_kw")),
        review: formData.get("review") as string,
        client_name: formData.get("client_name") as string,
        client_image: (formData.get("client_image") as string) || null,
        image_url: imageUrl ?? null
      };

      const { error: dbError } = editingProject
        ? await supabase.from("projects").update(payload).eq("id", editingProject.id)
        : await supabase.from("projects").insert([payload]);

      if (dbError) {
        console.error("Insert error:", dbError);
        alert(dbError.message);
        return;
      }

      form.reset();
      setIsProjectModalOpen(false);
      setEditingProject(null);
      setSelectedFile(null);
      setImagePreview(null);
      await fetchData();

    } catch (err: any) {
      console.error("System error:", err);
      alert(err.message || "An unexpected error occurred");
    } finally {
      setIsPublishing(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    fetchData();
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete lead.");
      return;
    }
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    fetchData(); // Update count
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-solar-gold animate-spin" />
            <ShieldCheck className="w-5 h-5 text-solar-gold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-400 font-bold tracking-widest uppercase text-xs animate-pulse font-mono">Securing Connection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-white font-sans selection:bg-solar-gold selection:text-black relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-solar-gold/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-solar-gold/5 rounded-full blur-[100px]" />
      </div>

      {/* Sidebar - Glass Design */}
      <aside className="w-[240px] border-r border-white/5 flex flex-col fixed inset-y-0 bg-gray-900/40 backdrop-blur-xl z-50 shadow-2xl">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-10 overflow-hidden">
            <div className="w-8 h-8 bg-solar-gold rounded-xl flex items-center justify-center shadow-lg shadow-solar-gold/30 flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-black" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-black tracking-tighter leading-none truncate">LUMORA</span>
              <span className="text-[9px] text-solar-gold/70 font-black tracking-[0.2em] uppercase">Control Center</span>
            </div>
          </div>

          <nav className="space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Overview" active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} />
            <SidebarItem icon={Briefcase} label="Projects" active={activeTab === "Projects"} onClick={() => setActiveTab("Projects")} />
            <SidebarItem icon={Users} label="Lead Lab" active={activeTab === "Leads"} onClick={() => setActiveTab("Leads")} />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/5 bg-black/20">
          <div className="flex items-center space-x-3 mb-6 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-solar-gold flex items-center justify-center text-black font-black shadow-inner flex-shrink-0">
              {profile?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold truncate text-gray-200 group-hover:text-white transition-colors">{profile?.full_name || 'Administrator'}</span>
              <span className="text-[9px] text-solar-gold font-black uppercase tracking-wider">{profile?.role}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border border-white/5 text-gray-500 hover:text-red-400 hover:bg-red-400/5 hover:border-red-400/20 transition-all duration-300 font-bold text-xs uppercase tracking-widest"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[240px] p-12 bg-transparent relative z-10 max-w-7xl mx-auto w-full">
        <header className="flex justify-between items-end mb-12">
          <div className="space-y-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black tracking-widest uppercase rounded-full border border-green-500/20">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Live Node
              </div>
              <span className="text-gray-500 text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5"><Clock size={11} /> {new Date().toLocaleDateString()}</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white">{activeTab === "Dashboard" ? "System Overview" : activeTab}</h1>
          </div>

          {activeTab === "Projects" && (
            <button
              onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
              className="flex items-center space-x-2 px-6 py-3.5 bg-solar-gold text-black font-black rounded-xl hover:bg-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all active:scale-95 text-xs tracking-widest"
            >
              <Plus size={18} />
              <span>NEW PROJECT</span>
            </button>
          )}
        </header>

        {/* CMS Modules */}
        {activeTab === "Dashboard" && (
          <div className="space-y-12">
            {/* Real Dynamic Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 group hover:border-solar-gold/30 hover:bg-gray-900/60 transition-all duration-500 cursor-default">
                <div className="w-10 h-10 rounded-xl bg-solar-gold/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5 text-solar-gold" />
                </div>
                <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Total Portfolio</h3>
                <p className="text-3xl font-black mt-1 text-white">{projectCount}</p>
                <div className="mt-2 text-[10px] text-solar-gold/60 font-medium">Live Projects Published</div>
              </div>

              <div className="bg-gray-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 group hover:border-solar-gold/30 hover:bg-gray-900/60 transition-all duration-500 cursor-default">
                <div className="w-10 h-10 rounded-xl bg-solar-gold/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-solar-gold" />
                </div>
                <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Incoming Leads</h3>
                <p className="text-3xl font-black mt-1 text-white">{leadCount}</p>
                <div className="mt-2 text-[10px] text-solar-gold/60 font-medium">Potential Clients Captured</div>
              </div>

              <div className="bg-gray-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 group hover:border-solar-gold/30 hover:bg-gray-900/60 transition-all duration-500 cursor-default opacity-50">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5 text-gray-400 text-green-400" />
                </div>
                <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Conversion Rate</h3>
                <p className="text-3xl font-black mt-1 text-white">18.4%</p>
                <div className="mt-2 text-[10px] text-gray-600 font-medium">System Benchmark</div>
              </div>

              <div className="bg-gray-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 group hover:border-solar-gold/30 hover:bg-gray-900/60 transition-all duration-500 cursor-default opacity-50">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                  <ImageIcon className="w-5 h-5 text-solar-gold" />
                </div>
                <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Storage Used</h3>
                <p className="text-3xl font-black mt-1 text-white">2.4k</p>
                <div className="mt-2 text-[10px] text-gray-600 font-medium">Assets Managed</div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-md rounded-3xl border border-white/5 p-8 relative overflow-hidden group">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-white text-lg font-bold tracking-tight">Recent Activity</h3>
                  <button className="text-[10px] font-black uppercase tracking-widest text-solar-gold/80 hover:text-solar-gold transition-colors">View All Logs</button>
                </div>
                <div className="space-y-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-4 group/item">
                      <div className="w-2 h-2 rounded-full bg-solar-gold/30 group-hover/item:bg-solar-gold transition-colors" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-200">System initialization complete</span>
                        <span className="text-[10px] text-gray-500 font-medium">Dashboard refined & stat modules updated • 2 mins ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-solar-gold/5 backdrop-blur-md border border-solar-gold/10 p-8 rounded-3xl flex flex-col justify-between group">
                <div>
                  <h3 className="text-solar-gold text-xs font-black uppercase tracking-[0.2em] mb-6">Quick Launch</h3>
                  <div className="space-y-3">
                    <button onClick={() => setActiveTab("Projects")} className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-solar-gold/10 hover:text-solar-gold transition-all font-bold flex items-center justify-between group/btn text-sm">
                      New Project <Plus size={16} className="group-hover/btn:rotate-90 transition-transform" />
                    </button>
                    <button onClick={() => setActiveTab("Leads")} className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-solar-gold/10 hover:text-solar-gold transition-all font-bold flex items-center justify-between group/btn text-sm">
                      Review Leads <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-solar-gold/10">
                  <p className="text-[10px] text-solar-gold/50 font-bold uppercase tracking-widest leading-relaxed">
                    Tip: You can now drag and drop images directly into the Project editor for faster publishing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Projects" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(project => {
              const annualSavings = (project.capacity_kw * 17000).toLocaleString('en-IN');
              return (
                <div key={project.id} className="group bg-gray-900/60 backdrop-blur-sm rounded-3xl border border-white/5 overflow-hidden shadow-2xl hover:-translate-y-2 transition-all duration-500 relative ring-1 ring-white/5 hover:ring-solar-gold/30">
                  {/* Image & Badge */}
                  <div className="h-56 relative overflow-hidden">
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-solar-gold text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {project.location}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{project.title}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1 px-2 bg-solar-gold/10 rounded-lg flex items-center gap-1.5 border border-solar-gold/10">
                        <LightningIcon className="w-3.5 h-3.5 text-solar-gold fill-solar-gold" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Savings:</span>
                        <span className="text-xs font-black text-white leading-none">₹{annualSavings}/yr</span>
                      </div>
                    </div>

                    <div className="h-px bg-white/5 w-full my-6 opacity-50" />

                    {/* Testimonial Section */}
                    <div className="space-y-4">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className="w-3.5 h-3.5 text-solar-gold fill-solar-gold" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-400 italic leading-relaxed font-medium">
                        "{project.review || "Amazing service and great savings!"}"
                      </p>
                      <div className="flex items-center gap-3 pt-2">
                        {project.client_image ? (
                          <img src={project.client_image} alt={project.client_name} className="w-9 h-9 rounded-full object-cover border border-white/10" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-solar-gold font-bold border border-white/10 text-xs shadow-inner">
                            {project.client_name?.charAt(0) || "C"}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white leading-none mb-1">{project.client_name || "Verified Client"}</span>
                          <span className="text-[9px] text-green-400/80 font-black uppercase tracking-widest">Verified Client</span>
                        </div>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0">
                      <div className="bg-black/80 backdrop-blur-xl p-1.5 rounded-xl flex gap-1 border border-white/10 shadow-2xl">
                        <ActionButton icon={Edit} onClick={() => { setEditingProject(project); setImagePreview(project.image_url); setIsProjectModalOpen(true); }} />
                        <ActionButton icon={Trash2} variant="danger" onClick={() => deleteProject(project.id)} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "Leads" && (
          <AdminTable headers={["Client Name", "Contact", "City", "Solar Needs"]}>
            {leads.map(lead => (
              <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                  <span className="font-bold text-white text-left block group-hover:text-solar-gold transition-colors">{lead.full_name}</span>
                </td>
                <td className="px-6 py-5 text-gray-400 text-left text-sm">{lead.email}</td>
                <td className="px-6 py-5 font-medium text-left text-gray-300">{lead.city}</td>
                <td className="px-6 py-5">
                  <div className="flex flex-col text-left">
                    <span className="text-solar-gold font-black text-xs">₹{lead.monthly_bill} bill</span>
                    <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{lead.roof_type} roof</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <button
                    onClick={() => handleDeleteLead(lead.id)}
                    className="text-red-400 hover:text-red-300 transition-all font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-red-400/10 active:scale-95"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </main>

      {/* Project Modal */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title={editingProject ? "Update Portfolio Node" : "Publish New Node"}
      >
        <form onSubmit={handlePublishProject} className="flex flex-col max-h-[75vh]">
          <div className="flex-grow overflow-y-auto pr-2 space-y-5 scroll-smooth custom-scrollbar">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Project Title</label>
              <input name="title" placeholder="e.g. 5kW Residential Solar" required defaultValue={editingProject?.title} className="w-full bg-black/40 border border-white/5 p-3.5 rounded-xl focus:border-solar-gold/50 outline-none transition-all text-sm placeholder:text-gray-700" />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Project Image (Visual Asset)</label>
              <div className={`relative h-44 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 overflow-hidden group ${imagePreview ? 'border-solar-gold/50 bg-black/40' : 'border-white/10 hover:border-solar-gold/30 hover:bg-white/5'}`}>
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <button
                        type="button"
                        onClick={() => { setSelectedFile(null); setImagePreview(null); }}
                        className="bg-red-500/80 hover:bg-red-500 p-2.5 rounded-full text-white shadow-2xl transition-all scale-90 group-hover:scale-100"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center group-hover:scale-105 transition-transform cursor-pointer w-full h-full flex flex-col items-center justify-center">
                    <Upload className="w-7 h-7 text-gray-600 mb-3 group-hover:text-solar-gold transition-colors" />
                    <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Drop Visual Asset</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Geo Location</label>
                <input name="location" placeholder="City, State" required defaultValue={editingProject?.location} className="w-full bg-black/40 border border-white/5 p-3.5 rounded-xl focus:border-solar-gold/50 outline-none transition-all text-sm placeholder:text-gray-700" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Node Capacity (kW)</label>
                <input name="capacity_kw" type="number" step="0.1" required defaultValue={editingProject?.capacity_kw} className="w-full bg-black/40 border border-white/5 p-3.5 rounded-xl focus:border-solar-gold/50 outline-none transition-all text-sm placeholder:text-gray-700" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Client Identity</label>
                <input name="client_name" placeholder="John Doe" required defaultValue={editingProject?.client_name} className="w-full bg-black/40 border border-white/5 p-3.5 rounded-xl focus:border-solar-gold/50 outline-none transition-all text-sm placeholder:text-gray-700" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Client Photo (External URL)</label>
                <input name="client_image" placeholder="https://..." defaultValue={editingProject?.client_image} className="w-full bg-black/40 border border-white/5 p-3.5 rounded-xl focus:border-solar-gold/50 outline-none transition-all text-sm placeholder:text-gray-700" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Verified Client Review</label>
              <textarea name="review" rows={4} placeholder="Input client story/experience..." required defaultValue={editingProject?.review} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl focus:border-solar-gold/50 outline-none transition-all text-sm resize-none placeholder:text-gray-700" />
            </div>
          </div>

          <div className="pt-6 mt-2 border-t border-white/5 bg-gray-900/80 backdrop-blur-xl sticky bottom-0">
            <button
              type="submit"
              disabled={isPublishing || (!imagePreview && !editingProject)}
              className="w-full py-4 bg-solar-gold text-black font-black rounded-xl hover:bg-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed text-xs"
            >
              {isPublishing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> SYNCING...
                </span>
              ) : (editingProject ? 'Apply Changes' : 'Broadcast Project')}
            </button>
          </div>
        </form>
      </Modal>
    </div >
  );
};

export default Admin;
