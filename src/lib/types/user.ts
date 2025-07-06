
import { Identifiable, Named, Emailable } from "./base";

// User types
export interface User extends Identifiable, Named, Emailable {
  role: "user" | "moderator" | "admin";
  createdAt: Date;
  isActive: boolean;
  isEmailVerified: boolean;
  isSuspended: boolean;
  communities?: string[];
  suspensionReason?: string;
  language?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  dateOfBirth?: Date;
  suspendedAt?: Date;
  suspendedBy?: string;
}

export interface AdminRoleUser extends Identifiable, Named, Emailable {
  joinDate: Date;
  communities?: string[];
}

export type AdminRole = {
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  users: AdminRoleUser[];
  icon: string;
  color: string;
};
