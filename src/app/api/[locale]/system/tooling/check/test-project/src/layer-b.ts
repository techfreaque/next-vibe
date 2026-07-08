import type { UserProfile, UserId } from "./layer-a";

export interface Post {
  id: string;
  authorId: UserId;
  title: string;
  viewCount: number;
}

export function getAuthorAge(profile: UserProfile): number {
  return profile.age;
}

export function createPost(authorId: UserId, title: string): Post {
  return { id: "post-1", authorId, title, viewCount: 0 };
}
