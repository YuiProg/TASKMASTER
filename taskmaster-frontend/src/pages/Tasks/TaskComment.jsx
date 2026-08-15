import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Heart, Image as ImageIcon, X } from "lucide-react";

import "../../styles/pages/task-comment.scss";
import Button from "../../components/TRCOMPONENTS/TRButton/Button";
import Spinner from "../../components/Spinner/Spinner";
import { useCommentStore } from "../../context/CommentStore.js";

function initialsOf(name) {
  if (!name) return "?";
  return name.slice(0, 2).toUpperCase();
}

function TaskComments({
  taskId,
  onLikeComment = (commentId) =>
    console.log("[TaskComments] like comment:", commentId),
}) {
  const [draft, setDraft] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const fileInputRef = useRef(null);

  const comments = useCommentStore((state) => state.comments);
  const isLoading = useCommentStore((state) => state.isLoading);
  const isButtonLoading = useCommentStore((state) => state.loadButton);
  const postComment = useCommentStore((state) => state.postComment);
  const getComments = useCommentStore((state) => state.getComments);

  useEffect(() => {
    if (taskId) {
      getComments(taskId);
    }
  }, [taskId, getComments]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePost = async () => {
    const text = draft.trim();
    if (!text && !selectedFile) return;

    let base64Image = null;

    if (selectedFile) {
      try {
        base64Image = await convertFileToBase64(selectedFile);
      } catch (err) {
        console.error("Failed to convert image to base64:", err);
        return;
      }
    }

    await postComment(text, taskId, base64Image);

    setDraft("");
    handleRemoveImage();
  };

  return (
    <div className="task-comments">
      <p className="task-comments__count">
        {comments.length} comment{comments.length === 1 ? "" : "s"}
      </p>

      {/* COMPOSER BOX */}
      <div className="task-comments__composer">
        <div className="task-comments__input-area">
          <textarea
            className="task-comments__textarea"
            placeholder="Write a comment..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
          />

          {imagePreview && (
            <div className="task-comments__preview-wrapper">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="task-comments__preview-img"
              />
              <button
                type="button"
                className="task-comments__remove-preview"
                onClick={handleRemoveImage}
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* FOOTER BAR WITH IMAGE BUTTON + POST BUTTON */}
        <div className="task-comments__composer-actions">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            style={{ display: "none" }}
          />

          <button
            type="button"
            className="task-comments__attach-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Attach image"
          >
            <ImageIcon size={18} />
          </button>

          <Button
            text="POST"
            customWidth={100}
            className="task-comments__post-btn"
            onClick={handlePost}
            disabled={isButtonLoading || (!draft.trim() && !selectedFile)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="task-comments__loading">
          <Spinner size={20} strokeWidth={3} />
        </div>
      ) : comments.length === 0 ? (
        <p className="task-comments__empty">
          No comments yet. Be the first to say something.
        </p>
      ) : (
        <div className="task-comments__list">
          {comments.map((c) => {
            const userAvatar =
              c.createdBy?.profilePicture ||
              c.createdBy?.avatarUrl ||
              c.createdBy?.image ||
              null;

            const hasImage =
              c.imageUrl ||
              (typeof c.comment === "string" &&
                (c.comment.startsWith("data:image/") ||
                  c.comment.startsWith("http://") ||
                  c.comment.startsWith("https://")));

            const imageUrl = c.imageUrl || (hasImage ? c.comment : null);

            return (
              <div key={c.id} className="task-comments__item">
                <div className="task-comments__avatar">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={c.createdBy?.username || "User avatar"}
                      className="task-comments__avatar-img"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    initialsOf(c.createdBy?.username)
                  )}
                </div>
                <div className="task-comments__body">
                  <div className="task-comments__meta">
                    <span className="task-comments__username">
                      {c.createdBy?.username || "Unknown"}
                    </span>
                  </div>

                  {c.comment && !c.comment.startsWith("data:image/") && (
                    <p className="task-comments__text">{c.comment}</p>
                  )}

                  {hasImage && imageUrl && (
                    <div className="task-comments__image-container">
                      <img
                        src={imageUrl}
                        alt="Comment attachment"
                        className="task-comments__attachment"
                        onClick={() => setFullscreenImage(imageUrl)}
                      />
                    </div>
                  )}

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
            );
          })}
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {fullscreenImage &&
        createPortal(
          <div
            className="task-comments__modal-overlay"
            onClick={() => setFullscreenImage(null)}
          >
            <div
              className="task-comments__modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="task-comments__modal-close"
                onClick={() => setFullscreenImage(null)}
              >
                <X size={20} />
              </button>
              <img
                src={fullscreenImage}
                alt="Fullscreen attachment"
                className="task-comments__modal-img"
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default TaskComments;