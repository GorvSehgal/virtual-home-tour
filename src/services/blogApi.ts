export type BlogStatus = "draft" | "approved" | "rejected" | "published";
export type BlogSummary = {
  slug: string; title: string; excerpt: string; category: string;
  publishedAt: string | null;
};
export type BlogArticle = BlogSummary & { body: string; updatedAt: string };
export type ManagedBlog = BlogArticle & {
  id: number; status: BlogStatus; revision: number; approvedRevision: number | null;
};
export type BlogInput = {
  slug: string; title: string; excerpt: string; category: string; body: string;
};
type Envelope<T> = { success: boolean; data?: T; message?: string };
const base = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "");

async function request<T>(path: string, token?: string, method = "GET", body?: BlogInput): Promise<T> {
  if (!base) throw new Error("Blog services are not connected yet.");
  const response = await fetch(`${base}/blog${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const result = await response.json() as Envelope<T>;
  if (!response.ok || !result.success || result.data === undefined) {
    throw new Error(result.message || `Request failed (${response.status})`);
  }
  return result.data;
}
export const listBlog = () => request<BlogSummary[]>("");
export const getBlog = (slug: string) => request<BlogArticle>(`/${encodeURIComponent(slug)}`);
export const manageBlog = (token: string) => request<ManagedBlog[]>("/manage", token);
export const saveBlog = (token: string, input: BlogInput, id?: number) =>
  request<ManagedBlog>(id ? `/${id}` : "", token, id ? "PATCH" : "POST", input);
export const changeBlogStatus = (token: string, id: number, action: "approve" | "reject" | "publish" | "unpublish") =>
  request<ManagedBlog>(`/${id}/${action}`, token, "POST");
