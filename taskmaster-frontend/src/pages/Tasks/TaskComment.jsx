import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import './TaskComment.scss'
import Button from "../../components/TRCOMPONENTS/TRButton/Button";
import Spinner from "../../components/Spinner/Spinner";
import { useCommentStore } from "../../context/CommentStore.js";

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
    <div className="task-comments">
      <p className="task-comments__count">
        {comments.length} comment{comments.length === 1 ? "" : "s"}
      </p>

      <div className="task-comments__composer">
        <textarea
          className="task-comments__textarea"
          placeholder="Write a comment..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={1}
        />
        <Button
          text="POST"
          customWidth={100}
          className="task-comments__post-btn"
          onClick={handlePost}
          disabled={isButtonLoading}
        />
      </div>

      {isLoading ? (
        <div className="task-comments__loading">
          <Spinner size={20} strokeWidth={3} />
        </div>
      ) : comments.length === 0 ? (
        <p className="task-comments__empty">No comments yet. Be the first to say something.</p>
      ) : (
        <div className="task-comments__list">
          {comments.map((c) => (
            <div key={c.id} className="task-comments__item">
              <div className="task-comments__avatar">{initialsOf(c.createdBy?.username)}</div>
              <div className="task-comments__body">
                <div className="task-comments__meta">
                  <span className="task-comments__username">
                    {c.createdBy?.username || "Unknown"}
                  </span>
                </div>
                <p className="task-comments__text">{c.comment}</p>
                <button
                  type="button"
                  className="task-comments__like-btn"
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
