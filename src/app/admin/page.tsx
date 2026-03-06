import { getAllPostsAdmin } from "@/lib/posts";
import { logout } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";

export default function AdminDashboard() {
  const posts = getAllPostsAdmin();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
            <p className="text-sm text-text-dimmed mt-1">
              Manage blog posts and content
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/admin/new"
              className="px-4 py-2 bg-text-primary text-background font-medium rounded-md hover:bg-text-muted transition-colors text-sm"
            >
              + New Post
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="px-4 py-2 border border-border text-text-muted rounded-md hover:bg-surface transition-colors text-sm"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* Posts Table */}
        {posts.length === 0 ? (
          <div className="bg-surface border border-border rounded-lg p-12 text-center">
            <p className="text-text-dimmed">No posts yet. Create your first post!</p>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-dimmed uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-dimmed uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-dimmed uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-dimmed uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-dimmed uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.slug} className="border-b border-border last:border-b-0 hover:bg-background/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm text-text-primary font-medium">{post.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          post.type === "research"
                            ? "border-blue-500/30 text-blue-400 bg-blue-500/10"
                            : "border-green-500/30 text-green-400 bg-green-500/10"
                        }`}
                      >
                        {post.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          post.published
                            ? "border-green-500/30 text-green-400 bg-green-500/10"
                            : "border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-text-dimmed font-mono">{post.date}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/admin/edit/${post.slug}`}
                          className="text-xs px-3 py-1 border border-border text-text-muted rounded hover:bg-background transition-colors"
                        >
                          Edit
                        </a>
                        <DeleteButton slug={post.slug} title={post.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Back to site */}
        <div className="mt-8 text-center">
          <a href="/" className="text-sm text-text-dimmed hover:text-text-muted transition-colors">
            &larr; Back to site
          </a>
        </div>
      </div>
    </div>
  );
}
