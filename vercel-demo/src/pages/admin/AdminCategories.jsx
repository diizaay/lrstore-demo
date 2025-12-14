import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
  uploadAdminAsset,
  BACKEND_URL,
} from "@/services/api";

const emptyCategory = {
  name: "",
  slug: "",
  image: "",
  description: "",
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState(emptyCategory);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getAdminCategories();
      setCategories(data);
      setError(null);
    } catch {
      setError("Não foi possível carregar as categorias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      if (editingCategory) {
        await updateAdminCategory(editingCategory.id, formValues);
      } else {
        await createAdminCategory(formValues);
      }
      setFormValues(emptyCategory);
      setEditingCategory(null);
      loadCategories();
    } catch {
      setError("Erro ao guardar a categoria.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (categoryId) => {
    const confirmed = window.confirm(
      "Deseja remover esta categoria? Esta ação não pode ser revertida."
    );
    if (!confirmed) return;
    try {
      await deleteAdminCategory(categoryId);
      loadCategories();
    } catch {
      setError("Erro ao apagar a categoria.");
    }
  };

  const startEditing = (category) => {
    setEditingCategory(category);
    setFormValues({
      name: category.name,
      slug: category.slug,
      image: category.image,
      description: category.description,
    });
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormValues(emptyCategory);
  };

  const handleImageUpload = async (fileList) => {
    const [file] = fileList ? Array.from(fileList) : [];
    if (!file) return;
    try {
      setUploadingImage(true);
      const response = await uploadAdminAsset(file);
      const normalizedUrl = response?.url?.startsWith("http")
        ? response.url
        : `${BACKEND_URL}${response.url}`;
      setFormValues((prev) => ({
        ...prev,
        image: normalizedUrl,
      }));
    } catch (error) {
      console.error("[AdminCategories] Erro no upload de imagem", error);
      setError("Não foi possível enviar a imagem. Tente novamente.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">Categorias</h1>
        <p className="text-sm text-slate-500">
          Controle a organização das vitrines e coleções.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          {editingCategory ? "Editar categoria" : "Nova categoria"}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-slate-600">Nome</label>
            <Input
              name="name"
              value={formValues.name}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-600">Slug</label>
            <Input
              name="slug"
              value={formValues.slug}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  slug: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-slate-600">
              Imagem destacada
              <span className="ml-2 text-xs font-medium text-slate-400">
                (jpeg, png ou webp)
              </span>
            </label>
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
              {formValues.image ? (
                <div className="relative mx-auto mb-4 h-40 w-40 overflow-hidden rounded-2xl border border-slate-200">
                  <img
                    src={formValues.image}
                    alt={formValues.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormValues((prev) => ({ ...prev, image: "" }))
                    }
                    className="absolute inset-x-2 bottom-2 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-rose-600 shadow-sm"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Ainda sem imagem associada.
                </p>
              )}
              <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    handleImageUpload(event.target.files);
                    event.target.value = "";
                  }}
                />
                {uploadingImage ? "A enviar..." : "Carregar imagem"}
              </label>
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-slate-600">Descrição</label>
            <textarea
              name="description"
              value={formValues.description}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-2 flex items-center justify-end gap-3">
            {editingCategory && (
              <Button type="button" variant="adminOutline" onClick={resetForm}>
                Cancelar
              </Button>
            )}
            <Button variant="admin" type="submit" disabled={saving}>
              {saving ? "A guardar..." : editingCategory ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Criada em</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  A carregar categorias...
                </td>
              </tr>
            )}
            {!loading && categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  Ainda não existem categorias.
                </td>
              </tr>
            )}
            {!loading &&
              categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {category.name}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{category.slug}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {category.created_at
                      ? new Date(category.created_at).toLocaleDateString(
                          "pt-PT"
                        )
                      : "-"}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <Button
                      variant="adminOutline"
                      size="sm"
                      onClick={() => startEditing(category)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(category.id)}
                    >
                      Apagar
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;
