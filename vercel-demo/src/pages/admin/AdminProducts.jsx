import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  getAdminCategories,
  updateAdminProduct,
  uploadAdminAsset,
  BACKEND_URL,
} from "@/services/api";

const emptyProduct = {
  name: "",
  category: "",
  price: "",
  original_price: "",
  image: "",
  gallery: "",
  description: "",
  stock: "",
  colors: "",
  featured: false,
  is_new: false,
  is_promo: false,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [formValues, setFormValues] = useState(emptyProduct);
  const [formLoading, setFormLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingField, setUploadingField] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminProducts({ page, search: search || undefined });
      setProducts(data.products || []);
      setPagination(data.pagination || null);
      setError(null);
    } catch (err) {
      setError("Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  const loadCategoryOptions = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const data = await getAdminCategories();
      setCategoryOptions(data || []);
    } catch (err) {
      console.error("[AdminProducts] Erro ao carregar categorias", err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadCategoryOptions();
  }, [loadCategoryOptions]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    loadProducts();
  };

  const formattedProducts = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        createdLabel: product.created_at
          ? new Date(product.created_at).toLocaleDateString("pt-PT")
          : "-",
      })),
    [products]
  );

  const galleryItems = useMemo(() => {
    if (!formValues.gallery) return [];
    return formValues.gallery
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);
  }, [formValues.gallery]);

  const openForm = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormValues({
        name: product.name || "",
        category: product.category || "",
        price: product.price ?? "",
        original_price: product.original_price ?? "",
        image: product.image || "",
        gallery: (product.gallery || []).join("\n"),
        description: product.description || "",
        stock: product.stock ?? "",
        colors: (product.colors || []).join(", "),
        featured: !!product.featured,
        is_new: !!product.is_new,
        is_promo: !!product.is_promo,
      });
    } else {
      setEditingProduct(null);
      setFormValues(emptyProduct);
    }
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormValues(emptyProduct);
    setEditingProduct(null);
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const preparePayload = () => {
    const colors = (formValues.colors || "")
      .split(",")
      .map((color) => color.trim())
      .filter(Boolean);
    const gallery = (formValues.gallery || "")
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);

    return {
      ...formValues,
      price: Number(formValues.price) || 0,
      original_price: formValues.original_price
        ? Number(formValues.original_price)
        : undefined,
      stock: Number(formValues.stock) || 0,
      colors,
      gallery,
      featured: !!formValues.featured,
      is_new: !!formValues.is_new,
      is_promo: !!formValues.is_promo,
    };
  };

  const handleImageUpload = async (files, target) => {
    if (!files?.length) return;
    setUploadingField(target);

    try {
      const uploadedUrls = [];
      for (const file of files) {
        const response = await uploadAdminAsset(file);
        if (response?.url) {
          const normalizedUrl = response.url.startsWith("http")
            ? response.url
            : `${BACKEND_URL}${response.url}`;
          uploadedUrls.push(normalizedUrl);
        }
      }

      setFormValues((prev) => {
        if (target === "image") {
          return {
            ...prev,
            image: uploadedUrls[0] || prev.image,
          };
        }

        const existingGallery = prev.gallery
          ? prev.gallery
              .split("\n")
              .map((url) => url.trim())
              .filter(Boolean)
          : [];
        const combined = [...existingGallery, ...uploadedUrls];
        return {
          ...prev,
          gallery: combined.join("\n"),
        };
      });
    } catch (err) {
      setError("Não foi possível carregar a imagem. Tente novamente.");
    } finally {
      setUploadingField(null);
    }
  };

  const removeGalleryImage = (imageUrl) => {
    setFormValues((prev) => {
      const filtered = (prev.gallery || "")
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean)
        .filter((url) => url !== imageUrl);
      return {
        ...prev,
        gallery: filtered.join("\n"),
      };
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const payload = preparePayload();
    try {
      setFormLoading(true);
      if (editingProduct) {
        await updateAdminProduct(editingProduct.id, payload);
      } else {
        await createAdminProduct(payload);
      }
      closeForm();
      loadProducts();
    } catch (err) {
      setError("Erro ao guardar o produto.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Tem a certeza que deseja apagar este produto?"
    );
    if (!confirmed) return;
    try {
      await deleteAdminProduct(productId);
      loadProducts();
    } catch {
      setError("Erro ao apagar o produto.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-gradient-to-r from-indigo-50 via-white to-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-600">
            Catálogo
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">Produtos</h1>
          <p className="text-sm text-slate-600">
            Gere o catálogo, destaque campanhas e mantenha o stock atualizado.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="adminOutline"
            onClick={() => loadProducts()}
            className="w-full md:w-auto"
          >
            Atualizar lista
          </Button>
          <Button
            variant="admin"
            onClick={() => openForm()}
            className="w-full md:w-auto"
          >
            Novo produto
          </Button>
        </div>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:flex-row"
      >
        <Input
          placeholder="Pesquisar por nome, descrição ou categoria"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit" variant="adminOutline" className="sm:w-40">
          Pesquisar
        </Button>
      </form>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">Categoria</th>
              <th className="px-4 py-3 text-left">Preço</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Destaque</th>
              <th className="px-4 py-3 text-left">Criado em</th>
              <th className="px-4 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                  A carregar produtos...
                </td>
              </tr>
            )}
            {!loading && formattedProducts.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
            {!loading &&
              formattedProducts.map((product) => (
                <tr key={product.id} className="transition hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">
                      {product.description?.slice(0, 60)}
                      {product.description?.length > 60 ? "..." : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {Number(product.price ?? 0).toLocaleString("pt-PT", {
                      style: "currency",
                      currency: "AOA",
                    })}
                  </td>
                  <td className="px-4 py-3">{product.stock ?? 0}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.featured
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {product.featured ? "Sim" : "Não"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{product.createdLabel}</td>
                  <td className="px-4 py-3 space-x-2">
                    <Button
                      variant="adminOutline"
                      size="sm"
                      onClick={() => openForm(product)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(product.id)}
                    >
                      Apagar
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm md:flex-row md:items-center md:justify-between">
          <p>
            Página {pagination.page} de {pagination.pages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="adminOutline"
              size="sm"
              disabled={!pagination.has_prev}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Anterior
            </Button>
            <Button
              variant="adminOutline"
              size="sm"
              disabled={!pagination.has_next}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Próximo
            </Button>
          </div>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/70 px-4 py-8">
          <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-indigo-600">
                  {editingProduct ? "Editar" : "Novo"}
                </p>
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingProduct ? editingProduct.name : "Produto"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100"
                aria-label="Fechar formulário"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="max-h-[80vh] space-y-5 overflow-y-auto px-6 py-5"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">
                    Nome
                  </label>
                  <Input
                    name="name"
                    value={formValues.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">
                      Categoria
                    </label>
                    <button
                      type="button"
                      onClick={loadCategoryOptions}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Atualizar lista
                    </button>
                  </div>
                  <select
                    name="category"
                    value={formValues.category}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">
                      {categoriesLoading
                        ? "A carregar categorias..."
                        : "Selecione uma categoria"}
                    </option>
                    {categoryOptions.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Preço
                  </label>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    value={formValues.price}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Preço original
                  </label>
                  <Input
                    name="original_price"
                    type="number"
                    step="0.01"
                    value={formValues.original_price}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Stock
                  </label>
                  <Input
                    name="stock"
                    type="number"
                    value={formValues.stock}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Imagem principal (URL)
                  </label>
                  <Input
                    name="image"
                    value={formValues.image}
                    onChange={handleFormChange}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">
                    Galeria (1 URL por linha)
                  </label>
                  <textarea
                    name="gallery"
                    value={formValues.gallery}
                    onChange={handleFormChange}
                    className="h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <ImageUploadCard
                  label="Imagem principal"
                  description="Carregue uma fotografia e usamos o link automaticamente."
                  imageUrl={formValues.image}
                  uploading={uploadingField === "image"}
                  onUpload={(files) => handleImageUpload(files, "image")}
                  onRemove={() =>
                    setFormValues((prev) => ({ ...prev, image: "" }))
                  }
                />
                <ImageUploadCard
                  label="Galeria"
                  description="Envie várias imagens em lote (JPEG/PNG/WEBP)."
                  imageUrl={galleryItems[0]}
                  uploading={uploadingField === "gallery"}
                  onUpload={(files) => handleImageUpload(files, "gallery")}
                  onRemove={() =>
                    setFormValues((prev) => ({ ...prev, gallery: "" }))
                  }
                  multiple
                />
              </div>

              {galleryItems.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Pré-visualização da galeria
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {galleryItems.map((url, index) => (
                      <div
                        key={`${url}-${index}`}
                        className="group relative h-28 w-28 overflow-hidden rounded-2xl border border-slate-200"
                      >
                        <img
                          src={url}
                          alt="Galeria"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(url)}
                          className="absolute inset-x-2 bottom-2 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-rose-600 opacity-0 transition group-hover:opacity-100"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    value={formValues.description}
                    onChange={handleFormChange}
                    className="h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Cores (separadas por vírgula)
                  </label>
                  <Input
                    name="colors"
                    value={formValues.colors}
                    onChange={handleFormChange}
                    placeholder="Ex.: rosa, azul neon"
                  />
                  <div className="grid gap-2 pt-2">
                    {[
                      { id: "featured", label: "Destaque", name: "featured" },
                      { id: "is_new", label: "Novidade", name: "is_new" },
                      { id: "is_promo", label: "Promoção", name: "is_promo" },
                    ].map((toggle) => (
                      <label
                        key={toggle.id}
                        className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                      >
                        <input
                          id={toggle.id}
                          name={toggle.name}
                          type="checkbox"
                          checked={!!formValues[toggle.name]}
                          onChange={handleFormChange}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        {toggle.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2 md:flex-row md:justify-end">
                <Button
                  type="button"
                  variant="adminOutline"
                  onClick={closeForm}
                  disabled={formLoading}
                >
                  Cancelar
                </Button>
                <Button variant="admin" type="submit" disabled={formLoading}>
                  {formLoading
                    ? "A guardar..."
                    : editingProduct
                    ? "Atualizar produto"
                    : "Criar produto"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ImageUploadCard = ({
  label,
  description,
  imageUrl,
  onUpload,
  onRemove,
  uploading,
  multiple = false,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
    <div className="flex items-center justify-between gap-2">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        {description && (
          <p className="text-xs text-slate-500">{description}</p>
        )}
      </div>
      {typeof onRemove === "function" && (
        <button
          type="button"
          onClick={() => onRemove?.()}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700"
        >
          Limpar
        </button>
      )}
    </div>
    <div className="mt-4 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={label}
          className="h-32 w-full rounded-xl object-cover"
        />
      ) : (
        <div className="text-xs text-slate-400">
          Nenhuma imagem selecionada
        </div>
      )}
      <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(event) => {
            const files = Array.from(event.target.files || []);
            if (files.length) {
              onUpload?.(files);
            }
            event.target.value = "";
          }}
        />
        {uploading ? "A enviar..." : "Carregar foto"}
      </label>
    </div>
  </div>
);

export default AdminProducts;
