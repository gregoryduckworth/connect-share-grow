import { FC } from "react";
import { PostDetailReply } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { User, Heart, Reply, Lock, Unlock } from "lucide-react";
import UserProfileLink from "@/components/user/UserProfileLink";

interface PostReplyProps {
  reply: PostDetailReply;
  depth?: number;
  isModerator: boolean;
  postLocked: boolean;
  replyToId: string | null;
  replyContent: { [key: string]: string };
  setReplyToId: (id: string | null) => void;
  setReplyContent: (
    cb: (prev: { [key: string]: string }) => { [key: string]: string }
  ) => void;
  handleLikeReply: (replyId: string) => void;
  handleSubmitReply: (parentId?: string) => void;
  handleLockReply: (replyId: string) => void;
  handleUnlockReply: (replyId: string) => void;
}

export const PostReply: FC<PostReplyProps> = ({
  reply,
  depth = 0,
  isModerator,
  postLocked,
  replyToId,
  replyContent,
  setReplyToId,
  setReplyContent,
  handleLikeReply,
  handleSubmitReply,
  handleLockReply,
  handleUnlockReply,
}) => (
  <div className={`mb-4 ${depth > 0 ? "ml-8" : "ml-4"}`}>
    <div
      className={`rounded-xl shadow-sm w-full ${
        depth % 2 === 0
          ? "bg-white border border-gray-200"
          : "bg-gray-200 border border-gray-300"
      } ${depth > 2 ? "border-l-4 border-blue-200 pl-6" : ""}`}
    >
      <div className="pt-4 pb-4 px-6">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 bg-social-primary text-white">
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-5 w-5" />
            </div>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 justify-between">
              <div className="flex items-center gap-2">
                <UserProfileLink
                  userId={reply.author}
                  userName={reply.userName}
                />
                <span className="text-sm text-gray-400 font-normal">
                  {reply.timestamp.toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                {isModerator &&
                  (reply.isLocked ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnlockReply(reply.id)}
                      className="text-xs border-green-400 text-green-500 hover:bg-green-50"
                    >
                      <Unlock className="h-3 w-3 mr-1" />
                      Unlock Reply
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLockReply(reply.id)}
                      className="text-xs border-red-400 text-red-500 hover:bg-red-50"
                    >
                      <Lock className="h-3 w-3 mr-1" />
                      Lock Reply
                    </Button>
                  ))}
              </div>
            </div>
            <p className="text-gray-700 mb-4 text-[1.08rem] leading-relaxed">
              {reply.isLocked ? (
                <span className="italic text-gray-400">
                  [This reply has been locked and its content is redacted]
                </span>
              ) : (
                reply.content
              )}
            </p>
            {reply.isLocked && reply.lockReason && (
              <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-xs text-red-700">
                  <Lock className="h-3 w-3 inline mr-1" />
                  <strong>Reply Locked:</strong> {reply.lockReason}
                </p>
              </div>
            )}
            <div className="flex items-center gap-4 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLikeReply(reply.id)}
                className={`flex items-center gap-1 text-sm ${
                  reply.isLiked ? "text-red-500" : "text-gray-500"
                }`}
                disabled={postLocked}
              >
                <Heart
                  className={`h-3 w-3 ${reply.isLiked ? "fill-current" : ""}`}
                />
                {reply.likes}
              </Button>
              {!reply.isLocked && !postLocked && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setReplyToId(replyToId === reply.id ? null : reply.id)
                  }
                  className="flex items-center gap-1 text-sm text-gray-500"
                >
                  <Reply className="h-3 w-3" />
                  Reply
                </Button>
              )}
            </div>
            {replyToId === reply.id && !postLocked && !reply.isLocked && (
              <div className="mt-4 flex gap-3">
                <Avatar className="h-8 w-8 bg-social-primary text-white">
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                </Avatar>
                <div className="flex-1 flex gap-3">
                  <textarea
                    placeholder={`Reply to ${
                      reply.userName || reply.author
                    }...`}
                    value={replyContent[reply.id] || ""}
                    onChange={(e) =>
                      setReplyContent((prev) => ({
                        ...prev,
                        [reply.id]: e.target.value,
                      }))
                    }
                    className="flex-1 border rounded p-2"
                    rows={2}
                  />
                  <Button
                    onClick={() => handleSubmitReply(reply.id)}
                    disabled={!replyContent[reply.id]?.trim()}
                    size="sm"
                    className="self-end"
                  >
                    Reply
                  </Button>
                </div>
              </div>
            )}
            {/* Render nested replies */}
            {reply.replies.length > 0 && (
              <div className="space-y-2 mt-2">
                {reply.replies.map((nestedReply) => (
                  <PostReply
                    key={nestedReply.id}
                    reply={nestedReply}
                    depth={depth + 1}
                    isModerator={isModerator}
                    postLocked={postLocked}
                    replyToId={replyToId}
                    replyContent={replyContent}
                    setReplyToId={setReplyToId}
                    setReplyContent={setReplyContent}
                    handleLikeReply={handleLikeReply}
                    handleSubmitReply={handleSubmitReply}
                    handleLockReply={handleLockReply}
                    handleUnlockReply={handleUnlockReply}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PostReply;
