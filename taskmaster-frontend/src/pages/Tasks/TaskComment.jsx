import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import './TaskComment.css'
import Button from "../../components/TRCOMPONENTS/TRButton/Button";
import Spinner from "../../components/Spinner/Spinner";
import { useCommentStore } from "../../context/commentStore";

function initialsOf(name) {
  if (!name) return "?";
  return name.slice(0, 2).toUpperCase();
}

function TaskComments({
  taskId,
  onAddComment = (text) => console.log("[TaskComments] add comment:", text),
  onLikeComment = (commentId) =>
    console.log("[TaskComments] like comment:", commentId),
}) {
  const [draft, setDraft] = useState("");

  const comments = useCommentStore((state) => state.comments);
  const isLoading = useCommentStore((state) => state.isLoading);
  const isButtonLoading = useCommentStore((state) => state.loadButton);

  useEffect(() => {
    if (!taskId) return;
    useCommentStore.getState().getComments(taskId);
  }, [taskId]);

  const handlePost = () => {
    const text = draft.trim();
    if (!text) return;
    onAddComment(text);
    setDraft("");
  };

  return (
    <div className="tc-container">
      <p className="tc-count-line">
        {comments.length} comment{comments.length === 1 ? "" : "s"}
      </p>

      <div className="tc-composer">
        <textarea
          className="tc-textarea"
          placeholder="Write a comment..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={1}
        />
        <Button
          text="POST"
          customWidth={100}
          className="tc-post-btn"
          onClick={handlePost}
          disabled={isButtonLoading}
        />
      </div>

      {isLoading ? (
        <div className="tc-loading">
          <Spinner size={20} strokeWidth={3} />
        </div>
      ) : comments.length === 0 ? (
        <p className="tc-empty">No comments yet. Be the first to say something.</p>
      ) : (
        <div className="tc-list">
          {comments.map((c) => (
            <div key={c.id} className="tc-item">
              <div className="tc-avatar">{initialsOf(c.createdBy?.username)}</div>
              <div className="tc-body">
                <div className="tc-meta">
                  <span className="tc-username">
                    {c.createdBy?.username || "Unknown"}
                  </span>
                </div>
                <p className="tc-text">{c.comment}</p>
                <button
                  type="button"
                  className="tc-like-btn"
                  onClick={() => onLikeComment(c.id)}
                >
                  <Heart size={14} />
                  <span>{c.like || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskComments;