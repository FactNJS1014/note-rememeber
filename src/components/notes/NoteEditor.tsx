// src/components/notes/NoteEditor.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNoteAction, updateNoteAction } from "@/actions/notes";
import { createCategoryAction } from "@/actions/categories"; // นำเข้า Action สร้าง Category
import { Pin, Heart, Save, ArrowLeft, Plus, X } from "lucide-react";

export function NoteEditor({
  initialNote,
  categories: initialCategories,
}: {
  initialNote?: any;
  categories: any[];
}) {
  const router = useRouter();
  const [categoriesList, setCategoriesList] = useState(initialCategories);
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [color, setColor] = useState(initialNote?.color || "default");
  const [type, setType] = useState(initialNote?.type || "text");
  const [categoryId, setCategoryId] = useState(initialNote?.categoryId || "");
  const [tagsInput, setTagsInput] = useState(
    initialNote?.tags?.map((t: any) => t.tag.name).join(", ") || "",
  );
  const [isPinned, setIsPinned] = useState(initialNote?.isPinned || false);
  const [isFavorite, setIsFavorite] = useState(
    initialNote?.isFavorite || false,
  );

  const [isSaving, setIsSaving] = useState(false);

  // Modal State สำหรับ Quick Add Category
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isCreatingCat, setIsCreatingCat] = useState(false);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsCreatingCat(true);
    try {
      const res = await createCategoryAction(newCatName.trim());
      if (res?.category) {
        setCategoriesList((prev) => [...prev, res.category]);
        setCategoryId(res.category.id); // เลือกหมวดหมู่ที่เพิ่งสร้างให้อัตโนมัติ
        setNewCatName("");
        setIsCategoryModalOpen(false);
      }
    } catch (err) {
      alert("Failed to create category");
    } finally {
      setIsCreatingCat(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Please enter a title");

    setIsSaving(true);
    const tagsArr = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      content,
      color,
      type,
      categoryId: categoryId || null,
      tags: tagsArr,
      isPinned,
      isFavorite,
    };

    try {
      if (initialNote) {
        await updateNoteAction(initialNote.id, payload);
      } else {
        await createNoteAction(payload);
      }
      router.push("/notes");
      router.refresh();
    } catch (err) {
      alert("Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPinned(!isPinned)}
            className={`p-2 rounded-xl border ${
              isPinned
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
            }`}
          >
            <Pin className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-xl border ${
              isFavorite
                ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
            }`}
          >
            <Heart className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 text-xs"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Note"}</span>
          </button>
        </div>
      </div>

      <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Note Title..."
          required
          className="w-full bg-transparent text-2xl font-bold text-white placeholder-slate-600 focus:outline-none"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write down your details, notes, code snippets, or checklists..."
          rows={12}
          className="w-full bg-slate-950 border border-slate-800/80 rounded-2xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm leading-relaxed"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 text-xs">
          {/* Category Dropdown + Quick Add */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-slate-400 font-semibold">
                Category
              </label>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Category</span>
              </button>
            </div>

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Select Category --</option>
              {categoriesList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-2">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="#nextjs, #work, #todo"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Modal สำหรับสร้าง Category ใหม่แบบเร่งด่วน */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Create New Category
              </h3>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Work, Personal, Programming..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              autoFocus
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={isCreatingCat || !newCatName.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
              >
                {isCreatingCat ? "Creating..." : "Create Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
