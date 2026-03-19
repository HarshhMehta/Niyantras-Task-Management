import { useState } from 'react'
import { Search, MessageCircle, X, ChevronRight, Eye } from 'lucide-react'
import Modal from '../components/Modal'
import useFetch from '../hooks/useFetch'
import { getPosts, getUsers, getComments, getAllComments } from '../services/api'

const PURPLE = "#5730e6"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .posts-root {
   background: #f0f2f5;
    padding: 20px 24px;
    font-family: 'Nunito', 'Segoe UI', sans-serif;
    min-height: 100vh;
  }

  .posts-topbar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
  }
  .posts-page-title { font-size: 18px; font-weight: 900; color: #111827; }
  .posts-page-sub { font-size: 12px; color: #9ca3af; margin-top: 2px; }

  .p-search {
    display: flex; align-items: center; gap: 8px;
    background: white; border: 1.5px solid #e5e7eb;
    border-radius: 11px; padding: 8px 14px; min-width: 260px;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .p-search:focus-within {
    border-color: ${PURPLE};
    box-shadow: 0 0 0 3px rgba(87,48,230,0.09);
  }
  .p-search input {
    border: none; background: transparent; outline: none;
    font-size: 13px; font-weight: 600; color: #374151;
    font-family: 'Nunito', inherit; width: 100%;
  }
  .p-search input::placeholder { color: #b0b7c3; font-weight: 500; }

  /* Grid */
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  /* Post Card */
  .post-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
    cursor: pointer;
    border: 1.5px solid transparent;
    transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
    display: flex; flex-direction: column; gap: 14px;
    position: relative; overflow: hidden;
  }
  .post-card::before {
    content: '';
    position: absolute; top: 0; left: 0;
    width: 3px; height: 100%;
    background: linear-gradient(180deg, ${PURPLE}, #a78bfa);
    opacity: 0;
    transition: opacity 0.18s;
    border-radius: 3px 0 0 3px;
  }
  .post-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(87,48,230,0.12);
    border-color: #ede9fe;
  }
  .post-card:hover::before { opacity: 1; }

  .post-author-row {
    display: flex; align-items: center; justify-content: space-between;
  }
  .post-author-info { display: flex; align-items: center; gap: 9px; }
  .post-author-av {
    width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg, ${PURPLE}, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 800; color: white;
  }
  .post-author-name { font-size: 13px; font-weight: 800; color: #111827; }
  .post-author-handle { font-size: 11px; color: #9ca3af; margin-top: 1px; }

  .post-id-badge {
    font-size: 10px; font-weight: 700; color: #d1d5db;
    background: #f9fafb; border-radius: 7px; padding: 3px 9px;
  }

  .post-card-title {
    font-size: 14px; font-weight: 800; color: #1f2937;
    line-height: 1.45; text-transform: capitalize;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }
  .post-card-body {
    font-size: 12px; color: #9ca3af; line-height: 1.6;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
    margin-top: -6px;
  }

  .post-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 12px; border-top: 1px solid #f3f4f6;
  }
  .post-footer-left { display: flex; align-items: center; gap: 12px; }
  .post-meta-chip {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: #9ca3af; font-weight: 600;
  }
  .post-meta-chip.active { color: #6b7280; }

  .post-read-btn {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 700; color: ${PURPLE};
    background: #f0ecff; border-radius: 8px; padding: 5px 12px;
    border: none; cursor: pointer; font-family: 'Nunito', inherit;
    transition: background 0.15s, transform 0.12s;
  }
  .post-card:hover .post-read-btn {
    background: #ede9fe;
    transform: translateX(2px);
  }

  /* Skeleton */
  .skeleton {
    background: linear-gradient(90deg, #f3f4f6 25%, #e9eaf0 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite; border-radius: 8px;
  }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  /* Modal */
  .modal-label { font-size: 10px; color: #9ca3af; font-weight: 700; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.8px; }
  .modal-section { margin-bottom: 18px; }

  .modal-author-row { display: flex; align-items: center; gap: 10px; }
  .modal-author-av {
    width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
    background: linear-gradient(135deg, ${PURPLE}, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 800; color: white;
  }
  .modal-author-name { font-size: 14px; font-weight: 800; color: #111827; }
  .modal-author-email { font-size: 11px; color: #9ca3af; margin-top: 2px; }

  .modal-post-body {
    font-size: 13px; color: #374151; line-height: 1.7;
    background: #faf9ff; border-radius: 10px; padding: 12px 14px;
    border: 1px solid #ede9fe;
  }

  .comment-card {
    display: flex; gap: 10px;
    padding: 10px 12px;
    background: #faf9ff; border-radius: 10px;
    border: 1px solid #ede9fe; margin-bottom: 8px;
  }
  .comment-av {
    width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
    background: #ede9fe; border: 1.5px solid #ddd6fe;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: ${PURPLE};
  }
  .comment-content { flex: 1; min-width: 0; }
  .comment-name { font-size: 11px; font-weight: 700; color: #111827; margin-bottom: 2px; }
  .comment-email { font-size: 10px; color: #9ca3af; margin-bottom: 5px; }
  .comment-body-text { font-size: 12px; color: #374151; line-height: 1.55; }

  @media (max-width: 1000px) {
    .posts-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 700px) {
    .posts-root { padding: 14px 12px 100px; }
    .posts-topbar { flex-direction: column; align-items: flex-start; }
    .p-search { min-width: 0; width: 100%; }
    .posts-grid { gap: 10px; }
  }
  @media (max-width: 480px) {
    .posts-root { padding: 12px 10px 100px; }
  }
`

function PostComments({ postId }) {
  const { data: comments, loading } = useFetch(() => getComments(postId), [postId])
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 72, borderRadius: 10 }} />
      ))}
    </div>
  )
  return (
    <div style={{ maxHeight: 300, overflowY: 'auto', paddingRight: 2 }}>
      {comments?.map((c) => (
        <div key={c.id} className="comment-card">
          <div className="comment-av">{c.email[0].toUpperCase()}</div>
          <div className="comment-content">
            <div className="comment-name">{c.name}</div>
            <div className="comment-email">{c.email}</div>
            <div className="comment-body-text">{c.body}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Posts() {
  const { data: posts, loading, error } = useFetch(getPosts)
  const { data: users } = useFetch(getUsers)
  const { data: allComments } = useFetch(getAllComments)
  const [search, setSearch] = useState('')
  const [selectedPost, setSelectedPost] = useState(null)

  const getUserById = (id) => users?.find((u) => u.id === id)

  // Real comment count from API
  const getCommentCount = (postId) =>
    allComments?.filter((c) => c.postId === postId).length ?? '...'

  const filtered = posts?.filter((p) => {
    const author = getUserById(p.userId)
    const matchTitle = p.title.toLowerCase().includes(search.toLowerCase())
    const matchAuthor = author?.name.toLowerCase().includes(search.toLowerCase())
    return matchTitle || matchAuthor
  })

  return (
    <>
      <style>{css}</style>
      <div className="posts-root">

        <div className="posts-topbar">
          <div>
            <div className="posts-page-title">Posts</div>
            <div className="posts-page-sub">{filtered?.length ?? 0} posts found</div>
          </div>
          <div className="p-search">
            <Search size={14} color="#b0b7c3" />
            <input
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <X size={13} color="#9ca3af" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => setSearch('')} />
            )}
          </div>
        </div>

        {error && (
  <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: 10, fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
    <span>{error}</span>
    <button onClick={retry} style={{ background: 'transparent', border: '1.5px solid #dc2626', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#dc2626', fontFamily: 'Nunito, inherit', whiteSpace: 'nowrap' }}>
      Try Again
    </button>
  </div>
)}

        <div className="posts-grid">
          {loading
            ? Array(8).fill(0).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 170, borderRadius: 16 }} />
              ))
            : filtered?.map((post) => {
                const author = getUserById(post.userId)
                return (
                  <div key={post.id} className="post-card" onClick={() => setSelectedPost(post)}>

                    {/* Author */}
                    <div className="post-author-row">
                      <div className="post-author-info">
                        <div className="post-author-av">{author?.name?.[0] ?? 'U'}</div>
                        <div>
                          <div className="post-author-name">{author?.name ?? `User ${post.userId}`}</div>
                          <div className="post-author-handle">@{author?.username ?? `user${post.userId}`}</div>
                        </div>
                      </div>
                      <span className="post-id-badge">#{post.id}</span>
                    </div>

                    {/* Title + excerpt */}
                    <div>
                      <div className="post-card-title">{post.title}</div>
                      <div className="post-card-body">{post.body}</div>
                    </div>

                    {/* Footer */}
                    <div className="post-card-footer">
                      <div className="post-footer-left">
                        <div className="post-meta-chip">
                          <Eye size={12} />
                          Post #{post.id}
                        </div>
                        <div className="post-meta-chip active">
                          <MessageCircle size={12} />
                          {getCommentCount(post.id) } comments
                          
                        </div>
                        
                      </div>
                      <button className="post-read-btn">
                        Read <ChevronRight size={12} />
                      </button>
                    </div>

                  </div>
                )
              })
          }
        </div>

        {/* Modal */}
        <Modal
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          title={selectedPost?.title}
        >
          {selectedPost && (() => {
            const author = getUserById(selectedPost.userId)
            return (
              <div>
                <div className="modal-section">
                  <div className="modal-label">Posted by</div>
                  <div className="modal-author-row">
                    <div className="modal-author-av">{author?.name?.[0] ?? 'U'}</div>
                    <div>
                      <div className="modal-author-name">{author?.name ?? `User ${selectedPost.userId}`}</div>
                      <div className="modal-author-email">{author?.email}</div>
                    </div>
                  </div>
                </div>

                <div className="modal-section">
                  <div className="modal-label">Content</div>
                  <div className="modal-post-body">{selectedPost.body}</div>
                </div>

                <div className="modal-section" style={{ marginBottom: 0 }}>
                  <div className="modal-label">
                    Comments ({getCommentCount(selectedPost.id)})
                  </div>
                  <PostComments postId={selectedPost.id} />
                </div>
              </div>
            )
          })()}
        </Modal>

      </div>
    </>
  )
}