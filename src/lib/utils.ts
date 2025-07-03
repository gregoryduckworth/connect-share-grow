import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PostDetailReply } from "@/lib/types";
import { USERS_DATA } from "@/lib/backend/data/users";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatNumber(value: number): string {
  return value.toLocaleString();
}

export function buildReplyTree(
  postId: string,
  flatReplies: any[]
): PostDetailReply[] {
  const idToReply: { [id: string]: PostDetailReply } = {};
  flatReplies.forEach((r) => {
    idToReply[r.id] = {
      id: r.id,
      author: r.author,
      content: r.content,
      timestamp: r.createdAt,
      likes: r.likes,
      isLiked: false,
      isLocked: false,
      parentId: r.parentReplyId || undefined,
      replies: [],
    };
  });
  const rootReplies: PostDetailReply[] = [];
  Object.values(idToReply).forEach((reply) => {
    if (reply.parentId) {
      idToReply[reply.parentId]?.replies.push(reply);
    } else {
      rootReplies.push(reply);
    }
  });
  return rootReplies;
}

export function mapUserNamesToReplies(
  replies: PostDetailReply[]
): PostDetailReply[] {
  return replies.map((reply) => {
    const user = USERS_DATA.find((u) => u.id === reply.author);
    return {
      ...reply,
      userName: user?.name || undefined,
      replies: mapUserNamesToReplies(reply.replies || []),
    };
  });
}

export function lockReplyRecursive(
  replies: PostDetailReply[],
  replyId: string
): PostDetailReply[] {
  return replies.map((r) =>
    r.id === replyId
      ? { ...r, isLocked: true, lockReason: "Locked by moderator" }
      : { ...r, replies: lockReplyRecursive(r.replies, replyId) }
  );
}

export function unlockReplyRecursive(
  replies: PostDetailReply[],
  replyId: string
): PostDetailReply[] {
  return replies.map((r) =>
    r.id === replyId
      ? { ...r, isLocked: false, lockReason: undefined }
      : { ...r, replies: unlockReplyRecursive(r.replies, replyId) }
  );
}
